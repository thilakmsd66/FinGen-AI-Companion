import ollama

response = ollama.chat(
    model="mistral",
    messages=[
        {"role": "system", "content": "You are a banking assistant."},
        {"role": "user", "content": "Explain custody banking in one paragraph."}
    ],
    stream=False
)

print(response["message"]["content"])
