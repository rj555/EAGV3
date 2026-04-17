import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
prompt = "Design a webpage for a Company Secretary offering her services in Corporate Governance, secretarial compliances, board meeting management,XBRL filing and virtual CFO services. Include details about her experience, qualifications and contact information. The webpage should be professional and easy to navigate. Also provide the link to the webpage. Generate only HTML. No markdown. Include images of a Company Secretary working on a laptop and attending a board meeting. It should work if I save the HTML in a file and open in a browser."
response = client.models.generate_content(
  model="gemini-3-flash-preview",
  contents=prompt,
  config=types.GenerateContentConfig(
    thinking_config=types.ThinkingConfig(
      include_thoughts=True
    )
  )
)

for part in response.candidates[0].content.parts:
  if not part.text:
    continue
  if part.thought:
    print("Thought summary:")
    print(part.text)
    print()
  else:
    print("Answer:")
    print(part.text)
    print()