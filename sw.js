const CACHE_NAME = 'Rainy-v2';

// 我们只强制缓存最核心的两个文件，绝不让图片报错卡死整个进程！
const urlsToCache = [
  './',
  './index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('开始缓存核心文件');
        // 用一种不会报错的方式缓存
        return cache.addAll(urlsToCache).catch(err => console.log('部分缓存失败，但不影响安装', err));
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
