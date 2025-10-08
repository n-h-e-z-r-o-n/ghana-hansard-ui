import requests

# ✅ Your webhook URL
WEBHOOK_URL = "https://n8n.granite-automations.app/webhook/hansard-chatbot"

# 👤 A fixed user ID (for session testing)
USER_ID = "test-user-123"

# 🌐 Language
LANG = "en"

# 🧠 Common headers
COMMON_HEADERS = {
    "Accept": "application/json",
    "X-Lang": LANG,                  # custom header
    "Accept-Language": LANG          # standard HTTP language header
}

def send_text_message(message: str):
    """Send a plain text message to the webhook."""
    payload = {
        "message": message,
        "lang": LANG,
        "userId": USER_ID
    }

    print(f"➡ Sending text message: {message}")
    response = requests.post(WEBHOOK_URL, data=payload, headers=COMMON_HEADERS)

    if response.ok:
        print("✅ Webhook response:", response.json())
    else:
        print("❌ Error:", response.status_code, response.text)


def send_voice_message(audio_path: str):
    """Send an audio file to the webhook as voice input."""
    files = {
        "voice": open(audio_path, "rb")
    }
    data = {
        "lang": LANG,
        "userId": USER_ID
    }

    print(f"🎤 Sending voice file: {audio_path}")
    response = requests.post(WEBHOOK_URL, data=data, files=files, headers=COMMON_HEADERS)

    if response.ok:
        print("✅ Webhook response:", response.json())
    else:
        print("❌ Error:", response.status_code, response.text)


if __name__ == "__main__":
    # 📝 Test text message
    send_text_message("Hello, testing Ghana parliamentary chatbot response")

    url = "https://n8n.granite-automations.app/webhook/hansard-chatbot"
    data = {
        "message": "Hello, this is a plain text webhook"
    }

    # Example with form data
    response = requests.post(url, data=data, headers=COMMON_HEADERS)
    print(response.text)

    # Example with raw text body
    headers = {
        **COMMON_HEADERS,
        "Content-Type": "text/plain"
    }
    text_message = "Hello, this is the raw text body 👋"
    response = requests.post(url, data=text_message, headers=headers)
    print(response.text)
