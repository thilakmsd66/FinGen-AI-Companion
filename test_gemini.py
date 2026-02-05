import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

print("API KEY =", os.getenv("GOOGLE_API_KEY"))

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Say hello in one line"
)

print(response.text)
