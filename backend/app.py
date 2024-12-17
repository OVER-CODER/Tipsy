from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    error_message = data.get("error", "No error provided.")
    try:

        payload={
            "contents" : [{"parts": [{"text": f"""
🛑 Error Detected:
"{error_message}"

---

🚨 Why This Happens:
Provide a clear and concise explanation of why this error occurs.

---

🔧 How to Fix It:
Provide a step-by-step solution to fix this error, including a properly formatted code example.

Format your response exactly like this:

🛑 Error Detected:
"[Error Message]"

---

🚨 Why This Happens:
[Brief explanation of why the error occurs]

---

🔧 How to Fix It:
[Clear steps to fix the issue with an example in a code block]
"""
                                      
                                      }]}],
        }
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json = payload,
            headers = {"Content-Type": "application/json"}
        )

        ai_response = response.json()
        suggestions = ai_response.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No suggestions available.")

        return jsonify({"suggestions": suggestions})


    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
