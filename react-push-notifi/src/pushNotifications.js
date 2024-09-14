// src/pushNotifications.js
const serverURL = 'http://127.0.0.1:8000'; //'http://127.0.0.1:8000'

async function getVapidPublicKey() {
  const response = await fetch(serverURL+'/vapid-public-key');
  const data = await response.json();
  return data.vapidPublicKey;
}


export async function subscribeUserToPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const publicKey = await getVapidPublicKey();
            console.warn('Public key:', publicKey);

            const registration = await navigator.serviceWorker.ready;

            // console.log('Registration:', registration);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: await urlBase64ToUint8Array(publicKey)
            }).catch(e => {
                alert(e);
            })

            // Poslání subscription na server
            await fetch(serverURL+'/subscribe', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'token': '123'
                },
                body: JSON.stringify(subscription)
            }).then(response => {
                if (response.ok) {
                    console.log('Subscription was sent to the server', subscription);
                } else {
                    console.error('Failed to send subscription to the server');
                }
            });

            return subscription;
        } catch (error) {
            console.error('Failed to subscribe the user: ', error);
        }
    }
}

// Pomocná funkce pro převod VAPID klíče na uint8 array
async function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
