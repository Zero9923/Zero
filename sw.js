// 永远不缓存！只做全屏壳子！

self.addEventListener('install', (e) => {
  self.skipWaiting(); // 立刻生效
});

self.addEventListener('activate', (e) => {
  // 把以前那个智障管家存的死缓存全部砸烂删掉！
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 核心：不管你要什么文件，直接去 GitHub 拿最新的！不准拦截！
  e.respondWith(fetch(e.request));
});
