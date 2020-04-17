var APP_NAME = 'partnerspace';
var CACHE_STATIC_NAME = APP_NAME + '_static';
var CACHE_CONFIG = {
    TYPE: ["pages", "css", "js", "jpg", "png", "svg"],
    URL: [
        // Add URLs here to force cache
    ]
};

self.addEventListener('install', function (event) {
    console.log('Service Worker Installed for ' + APP_NAME, event);
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keyList) { return Promise.all(keyList.map(function (key) { if (key !== CACHE_STATIC_NAME) { return caches.delete(key); } })); }));
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    var req = event.request;
    event.respondWith(caches.match(req).then(function (resp) { return (req.cache && resp) || fetch(req).then(resp => ada.cache(req, resp)); }));
});

var ada = {
    cache: (req, res) => {
        if (CACHE_CONFIG.TYPE.includes(getType(req.URL)) || CACHE_CONFIG.URL.includes(req.URL)) window.caches.open(CACHE_STATIC_NAME).then(c => c.put(req, res));
        return res;
    },
    getType: r => r.includes('.') ? r.substr(r.lastIndexOf('.')) : 'page'
}