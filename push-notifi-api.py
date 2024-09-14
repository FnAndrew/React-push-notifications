from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pywebpush import webpush, WebPushException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VAPID_PUBLIC_KEY = "BBKeAjLw5y-w0I9EoIy1ro0IRFMNWGUU8zIWaHDo3xHKXhjo1QlcME9o5FRKg0v3_K3JYilOOXjAAqB4W8FthcM"
VAPID_PRIVATE_KEY = "dw-j5NsKVNcjAUrirmChaCMCbHTRIwIzo6tvbXEzF54"
VAPID_CLAIMS = {"sub": "mailto:example@example.com"}

def send_web_push(subscription_information, message_body):
    try:
        webpush(
            subscription_info=subscription_information,
            data=json.dumps(message_body),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS
        )
    except WebPushException as ex:
        HTTPException(status_code=500, detail=f"Web push failed {repr(ex)}")


class PushSubscription(BaseModel):
    endpoint: str
    expirationTime: str = None
    keys: dict

subscriptions = []

def subscription_exists(subscription: PushSubscription) -> bool:
    for sub in subscriptions:
        if (sub['endpoint'] == subscription.endpoint and
            sub['keys'] == subscription.keys):
            return True
    return False

@app.post("/subscribe")
async def subscribe(subscription: PushSubscription):
    if subscription_exists(subscription):
        raise HTTPException(status_code=400, detail="Subscription already exists")
    
    subscriptions.append(subscription.dict())
    
    print(f"New sub:\n{subscription}")
    
    return {"message": "Subscribed successfully!"}

@app.get("/vapid-public-key")
async def get_vapid_public_key():
    # Klient bude potřebovat veřejný klíč pro registraci subscription
    return {"vapidPublicKey": VAPID_PUBLIC_KEY}

@app.post("/notify")
async def notify(title: str = "New notification", body: str = "New info for you!", url: str = "/"):
    count = 0
    
    message_body = {
        "title": title,
        "body": body,
        "url": url
    }
    for subscription in subscriptions:
        send_web_push(subscription, message_body)
        count += 1
        
    print(f"Notifications sent to {count} subscribers.")
    return {"message": "Notifications sent to " + str(count) + " subscribers."}