// Sporti Service Worker – Push Notifications

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

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
