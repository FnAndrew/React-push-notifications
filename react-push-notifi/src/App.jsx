// src/App.jsx
import React, { useEffect } from 'react';
import { subscribeUserToPush } from './pushNotifications';

function App() {
  // useEffect(() => {
  //   // Žádost o povolení push notifikací
  //   Notification.requestPermission().then(permission => {
  //     if (permission === 'granted') {
  //       subscribeUserToPush();
  //     }
  //   });
  // }, []);

  return (
    <div className="App">
      <h1>Push Notifications</h1>
      <button onClick={subscribeUserToPush}>Subscribe</button>
    </div>
  );
}

export default App;
