// Sporti Service Worker – Push Notifications (no caching)

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  // Clear all caches on activate to prevent stale content
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

// Always fetch from network, never serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})

// Handle push events
self.addEventListener('push', (event) => {
  let data = { title: 'Sporti', body: 'Neue Nachricht', url: '/sporti/' }
  try {
    data = event.data.json()
  } catch (e) {
    data.body = event.data?.text() || data.body
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Sporti', {
      body: data.body,
      icon: '/sporti/favicon.svg',
      badge: '/sporti/favicon.svg',
      data: { url: data.url || '/sporti/' },
      vibrate: [200, 100, 200],
    })
  )
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/sporti/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/sporti') && 'focus' in client) return client.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
