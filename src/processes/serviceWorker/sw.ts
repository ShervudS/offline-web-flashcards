const version = "v0.2.2";

const enum METHOD {
	GET = "GET",
}

const staticAssetRegex = /\.(js|css)$/;
const imageRegex = /\.(jpe?g|png|gif|svg|webp|avif)$/i;
const staticCacheName = version + "staticfiles";
const pagesCacheName = "pages";
// const urlsToCache = ["/", "/icons/icon-192x192.png"];
const cacheList = [staticCacheName, pagesCacheName];

const trimCache = async (cacheName: string, maxItems: number) => {
	const cache = await caches.open(cacheName);
	const items = await cache.keys();

	if (items.length > maxItems) {
		await cache.delete(items[0]);
		await trimCache(cacheName, maxItems);
	}
};

const cacheFirstStrategy = async (cacheName: string, request: Request) => {
	const cache = await caches.open(cacheName);

	const responseFromCache = await cache.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}

	const networkResponse = await fetch(request);
	cache.put(request, networkResponse.clone());
	return networkResponse;
};

const cacheThenNetworkStrategy = async (
	cacheName: string,
	request: Request,
) => {
	const cache = await caches.open(cacheName);

	const responseFromCache = await cache.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}

	const networkResponse = await fetch(request);
	cache.put(request, networkResponse.clone());
	return networkResponse;
};

addEventListener("install", (installEvent) => {
	installEvent.waitUntil(
		caches.open(staticCacheName).then((staticCache) => {
			//   staticCache.addAll(["/path/to/font.woff", "/path/to/icon.svg"]);
			staticCache.addAll(["/index.html"]);
		}),
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
					}),
				),
			)
			.then(() => clients.claim()),
	);
});

addEventListener("fetch", (fetchEvent) => {
	if (fetchEvent.request.method !== METHOD.GET) {
		return;
	}

	const requestUrl = new URL(fetchEvent.request.url);

	if (fetchEvent.request.headers.get("Accept")?.includes("text/html")) {
		fetchEvent.respondWith(
			cacheFirstStrategy(staticCacheName, fetchEvent.request),
		);
		return;
	}

	if (imageRegex.test(fetchEvent.request.url)) {
		fetchEvent.respondWith(
			cacheThenNetworkStrategy(pagesCacheName, fetchEvent.request),
		);
		return;
	}

	if (
		staticAssetRegex.test(requestUrl.pathname) &&
		!fetchEvent.request.url.startsWith("chrome-extension")
	) {
		fetchEvent.respondWith(
			cacheFirstStrategy(staticCacheName, fetchEvent.request),
		);
		return;
	}

	fetchEvent.respondWith(
		caches
			.match(fetchEvent.request)
			.then((response) => response || fetch(fetchEvent.request)),
	);
});

addEventListener("message", (messageEvent) => {
	if (messageEvent.data == "clean up caches") {
		trimCache(pagesCacheName, 2);
		// trimCache(imageCacheName, 50);
	}
});
