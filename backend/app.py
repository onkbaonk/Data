import os
from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.blog import blog_bp
from routes.chat import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(blog_bp, url_prefix="/blog")
app.register_blueprint(chat_bp, url_prefix="/chat")

@app.route("/")
def home():
    return {"status": "API running"}
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)