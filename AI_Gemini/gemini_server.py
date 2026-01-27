import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import requests
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# ✅ DANH SÁCH API KEYS
API_KEYS = [
    "AIzaSyCxU8NJOMWpGp3W4wpreZJ-iwBqrujP6t4",
    "AIzaSyBsxAPmjZCuf6zczg2d9cY-D2ADCSDHRi8",
    "AIzaSyAJGPe0RJRj-1Y-_3UcVkwq1GzxUhnHgDw",
    "AIzaSyAtTNfMprkISdFdEYOpJm_4kvs2G6usS58",
    "AIzaSyDTVF6sLCWAj3uMv0McAFJca7yZrUySfCQ",
]

current_key_index = 0

@app.route('/api/ai/chat', methods=['POST'])
def chat():
    global current_key_index
    data = request.json
    user_msg = data.get("message", "")
    image_data = data.get("image")
    
    # Thử lần lượt các Key
    for _ in range(len(API_KEYS)):
        try:
            api_key = API_KEYS[current_key_index]
            print(f"🔑 Đang thử Key {current_key_index + 1}...")
            genai.configure(api_key=api_key)
            
            # Kiểm tra phiên bản thư viện (Để bạn nhìn thấy trong terminal)
            import google.generativeai as pkg
            print(f"📦 Thư viện AI version: {pkg.__version__}")
            
            # Sử dụng model Flash (Yêu cầu version > 0.5.3)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            input_data = []
            if image_data:
                img_content = image_data.split(",")[-1]
                img = Image.open(io.BytesIO(base64.b64decode(img_content)))
                input_data.append(img)
            
            if user_msg:
                input_data.append(user_msg)
            elif not input_data:
                input_data.append("Chào bạn")

            response = model.generate_content(input_data)
            
            return jsonify({"reply": response.text, "status": "success"})

        except Exception as e:
            err = str(e)
            print(f"❌ Lỗi: {err[:150]}")
            # Nếu lỗi liên quan đến Quota hoặc Key, đổi Key
            if "429" in err or "quota" in err.lower() or "403" in err:
                current_key_index = (current_key_index + 1) % len(API_KEYS)
                continue
            return jsonify({"error": err, "status": "error"}), 500
            
    return jsonify({"error": "Tất cả Key đều lỗi!", "status": "error"}), 500

if __name__ == '__main__':
    print("🚀 Halu AI Server 2.2 is starting...")
    app.run(port=5000)
