# React-push-notifications
React Vite push sample for sending push notifications to clients

A service worker `sw.js` is registered on the background to recive the notifications and the `pushNotifications.js` script handles comunication with the API.

## Requirements

You have to have installed npm and Python.
The Python libraries can be installed like this:
```
pip install fastapi pydantic pywebpush
```
## Run Locally

Clone the project

```bash
  git clone https://github.com/FnAndrew/React-push-notifications.git
```

Go to the project directory

#### Start the API:
```bash
  uvicorn push-notifi-api:app --reload
```

Open new terminal and navigate to to web's directory

```bash
  cd React-push-notifications
```

Install dependencies

```bash
  npm install
```

#### Start the server

```bash
  npm run dev
```


## Ussage

The API documentation is available at [http://localhost:8000](http://localhost:8000)

The webpage is most likely available at [http://localhost:5173](http://localhost:5173)


## Conclusion

The subscriptions are stored in local variable `subscriptions` so on the API refresh it deletes and you should use some kind of database.

Have fun!
