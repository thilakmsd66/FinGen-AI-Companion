from google import genai

# TEMPORARY: paste key directly
API_KEY = "your_google_api_key_here"  # <-- paste FULL key here

client = genai.Client(api_key=API_KEY)

response = client.models.generate_content(
    model="gemini-1.0-pro",
    contents="Say hello in one short sentence"
)

print(response.text)
