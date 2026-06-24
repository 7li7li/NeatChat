const STATIC_ASSET_RECOVERY_KEY = "neatchat-static-asset-recovery";
const STATIC_ASSET_RECOVERY_LIMIT = 2;

const script = `
(function () {
  var storageKey = "${STATIC_ASSET_RECOVERY_KEY}";
  var limit = ${STATIC_ASSET_RECOVERY_LIMIT};

  function isNextStaticUrl(value) {
    if (!value) return false;
    try {
      var url = new URL(value, window.location.href);
      return url.origin === window.location.origin &&
        url.pathname.indexOf("/_next/static/") === 0;
    } catch (_) {
      return String(value).indexOf("/_next/static/") === 0;
    }
  }

  function recover(reason) {
    try {
      var record = JSON.parse(window.sessionStorage.getItem(storageKey) || "{}");
      var now = Date.now();
      if (record.time && now - record.time > 120000) record.count = 0;
      if ((record.count || 0) >= limit) return;
      window.sessionStorage.setItem(
        storageKey,
        JSON.stringify({ count: (record.count || 0) + 1, time: now, reason: reason })
      );
    } catch (_) {}

    var url = new URL(window.location.href);
    url.searchParams.set("__next_static_recover", Date.now().toString());
    window.location.replace(url.toString());
  }

  window.addEventListener(
    "error",
    function (event) {
      var target = event && event.target;
      var url = target && (target.src || target.href);
      if (isNextStaticUrl(url)) recover("resource");
    },
    true
  );

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event && event.reason;
    var message = reason && (reason.message || String(reason));
    if (/ChunkLoadError|Loading chunk|failed to fetch dynamically imported module/i.test(message)) {
      recover("chunk");
    }
  });

  navigator.serviceWorker && navigator.serviceWorker.addEventListener("message", function (event) {
    if (event.data && event.data.type === "NEXT_STATIC_ASSET_MISSING") {
      recover("service-worker");
    }
  });
})();
`;

export function StaticAssetRecoveryScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: script,
      }}
    />
  );
}
