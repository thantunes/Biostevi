console.log('[service-worker] Entering push handler');

self.addEventListener('push', function(event) {
  if (!event.data) {
      return;
  }

  let data;
  try {
      data = event.data.json();
  } catch (err) {
      console.error('Error occurred when trying to decode push event', err);
      return;
  }

  const promiseChain = self.registration.showNotification(data.title || '', {
      body: data.message,
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('fetch', function(event) {
  console.log('[example-sw] Fetch of service worker');
});

self.addEventListener('install', function(event) {
  console.log('[example-sw] Install of service worker');
});

self.addEventListener('message', function(event) {
  console.log('[example-sw] Message of service worker');
});

self.addEventListener('sync', function(event) {
  console.log('[example-sw] Sync of service worker');
});

