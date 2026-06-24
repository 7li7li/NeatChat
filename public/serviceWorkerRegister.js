if ("serviceWorker" in navigator) {
  window.addEventListener("DOMContentLoaded", function () {
    let refreshing = false;

    navigator.serviceWorker
      .register("/serviceWorker.js", { updateViaCache: "none" })
      .then(
        function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope,
          );

          registration.update().then((res) => {
            console.log("ServiceWorker registration update: ", res);
          });
          window._SW_ENABLED = true;
        },
        function (err) {
          console.error("ServiceWorker registration failed: ", err);
        },
      );

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;
      refreshing = true;
      console.log("ServiceWorker controllerchange");
      window.location.reload();
    });

    navigator.serviceWorker.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "NEXT_STATIC_ASSET_MISSING") {
        return;
      }
      if (refreshing) return;
      refreshing = true;
      const url = new URL(window.location.href);
      url.searchParams.set("__next_static_recover", Date.now().toString());
      window.location.replace(url.toString());
    });
  });
}
