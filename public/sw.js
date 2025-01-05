const version = "v0.1";

const staticCacheName = version + "staticfiles";
const pagesCacheName = "pages";
const urlsToCache = ["/", "/icons/icon-192x192.png"];
const cacheList = [staticCacheName, pagesCacheName];

const stashInCache = async (request, cacheName) =>
  fetch(request).then((responseFromFetch) => {
    caches
      .open(cacheName)
      .then((theCache) => theCache.put(request, responseFromFetch));
  });

const trimCache = (cacheName, maxItems) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((items) => {
      if (items.length > maxItems) {
        cache.delete(items[0]).then(() => {
          trimCache(cacheName, maxItems);
        });
      }
    });
  });
};

addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
    //   staticCache.addAll(["/path/to/font.woff", "/path/to/icon.svg"]);
      return staticCache.addAll(["*.css", "*.js", "/"]);
    })
  );
});

addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheList.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => clients.claim())
  );
});

addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  if (request.headers.get("Accept").includes("text/html")) {
    fetchEvent.respondWith(
      fetch(request).catch(() => caches.match("/index.html")) // end fetch catch
    );
    return;
  }

  if (request.url.match(/\.(jpe?g|png|gif|svg|webp|avif)$/)) {
    fetchEvent.respondWith(
      caches.match(request).then((responseFromCache) => {
        if (responseFromCache) {
          return responseFromCache;
        }

        return fetch(request).then((responseFromFetch) => {
          const copy = responseFromFetch.clone();
          fetchEvent.waitUntil(
            caches
              .open(pagesCacheName)
              .then((pagesCache) => pagesCache.put(request, copy))
          );
          return responseFromFetch;
        });
      })
    );
    return;
  }

  fetchEvent.respondWith(
    caches.match(request).then((responseFromCache) => {
      if (responseFromCache) {
        return responseFromCache;
      }

      return fetch(request);
    })
  );
});

addEventListener("message", (messageEvent) => {
  if (messageEvent.data == "clean up caches") {
    trimCache(pagesCacheName, 2);
    // trimCache(imageCacheName, 50);
  }
});
