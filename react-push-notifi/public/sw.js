// public/sw.js
self.addEventListener('push', function(event) {
    // console.log('Push zavolán:', event);

    const data = event.data ? event.data.json() : {};

    const title = data.title || 'Notification Title';
    const options = {
        body: data.body || 'Notification Body',
        icon: '/icon.png', // Path to icon
        badge: '/badge.png', // Path to badge
        data: {
            url: data.url || '/' // URL to open on notification click
        }
    };

    //alert('Notification received: ' + title + ' ' + options.body + ' ' + options.url);

    event.waitUntil(
        self.registration.showNotification(title, options)
        .then(() => {
            // console.log('Notification displayed successfully');
        })
        .catch(err => {
            console.error('Notification display failed:', err);
        })
    );

    // console.log('Notification was displayed');
});


self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // Získání URL z notifikace
    const urlToOpen = event.notification.data.url || '/'; // Defaultní URL, pokud data nejsou k dispozici

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Pokud je nějaké otevřené okno aplikace, přepni se na něj
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Pokud žádné okno není otevřené nebo není na správné URL, otevři nové okno
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});