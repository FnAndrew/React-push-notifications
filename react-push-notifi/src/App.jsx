// src/App.jsx
import React, { useEffect } from 'react';
import { subscribeUserToPush } from './pushNotifications';

function App() {

  return (
    <div className="App">
      <h1>Push Notifications</h1>
      <button onClick={subscribeUserToPush}>Subscribe</button>
    </div>
  );
}

export default App;
