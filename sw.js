const CACHE_NAME = 'Rainy-Auto-Cache';

// 安装时立刻接管，不磨叽
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// 核心魔法：全自动网络优先 + 自动备份机制
self.addEventListener('fetch', event => {
  // 只处理我们自己的文件请求（比如 .js, .html, .png）
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // 第一步：先去问 GitHub 拿最新写的代码（网络请求）
    fetch(event.request)
      .then(networkResponse => {
        // 如果拿到了最新的代码，就偷偷在手机本地备份一份！
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        // 把最新代码交给屏幕显示
        return networkResponse;
      })
      .catch(() => {
        // 第二步：万一你手机断网了（或者开了飞行模式）
        // 管家就会自动翻出之前备份在手机里的旧文件给你看！
        return caches.match(event.request);
      })
  );
});
