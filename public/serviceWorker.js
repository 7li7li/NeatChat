const CHATGPT_NEXT_WEB_CACHE = "chatgpt-next-web-cache";
const CHATGPT_NEXT_WEB_FILE_CACHE = "chatgpt-next-web-file";
let a="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";let nanoid=(e=21)=>{let t="",r=crypto.getRandomValues(new Uint8Array(e));for(let n=0;n<e;n++)t+=a[63&r[n]];return t};

self.addEventListener("activate", function (event) {
  console.log("ServiceWorker activated.");
  event.waitUntil(
    caches.delete(CHATGPT_NEXT_WEB_CACHE).then(() => self.clients.claim()),
  );
});

self.addEventListener("install", function (event) {
  self.skipWaiting();  // enable new version
  event.waitUntil(
    caches.open(CHATGPT_NEXT_WEB_CACHE).then(function (cache) {
      return cache.addAll([]);
    }),
  );
});

function jsonify(data) {
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } })
}

async function upload(request, url) {
  const formData = await request.formData()
  const file = formData.getAll('file')[0]
  let ext = file.name.split('.').pop()
  if (ext === 'blob') {
    ext = file.type.split('/').pop()
  }
  const fileUrl = `${url.origin}/api/cache/${nanoid()}.${ext}`
  // console.debug('file', file, fileUrl, request)
  const cache = await caches.open(CHATGPT_NEXT_WEB_FILE_CACHE)
  await cache.put(new Request(fileUrl), new Response(file, {
    headers: {
      'content-type': file.type,
      'content-length': file.size,
      'cache-control': 'no-cache', // file already store in disk
      'server': 'ServiceWorker',
    }
  }))
  return jsonify({ code: 0, data: fileUrl })
}

async function remove(request, url) {
  const cache = await caches.open(CHATGPT_NEXT_WEB_FILE_CACHE)
  const res = await cache.delete(request.url)
  return jsonify({ code: 0 })
}

async function notifyStaticAssetMissing(url) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: "window",
  });

  for (const client of clients) {
    client.postMessage({
      type: "NEXT_STATIC_ASSET_MISSING",
      url,
    });
  }
}

async function fetchStaticAsset(request) {
  const response = await fetch(request);
  if (response.status === 404 || response.status === 410) {
    await notifyStaticAssetMissing(request.url);
  }
  return response;
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method === "GET" && /^\/_next\/static\//.test(url.pathname)) {
    e.respondWith(fetchStaticAsset(e.request));
    return;
  }

  if (/^\/api\/cache/.test(url.pathname)) {
    if ('GET' == e.request.method) {
      e.respondWith(caches.match(e.request))
    }
    if ('POST' == e.request.method) {
      e.respondWith(upload(e.request, url))
    }
    if ('DELETE' == e.request.method) {
      e.respondWith(remove(e.request, url))
    }
  }
});
