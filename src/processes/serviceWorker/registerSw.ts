if (navigator.serviceWorker) {
	navigator.serviceWorker.register("/sw.js");

	if (navigator.serviceWorker.controller) {
		window.addEventListener("load", () => {
			// @ts-ignore
			navigator.serviceWorker.controller.postMessage("clean up caches");
		});
	}
}
