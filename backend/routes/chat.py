from flask import Blueprint, request, jsonify
import json, os

chat_bp = Blueprint("chat", __name__)
DB = "data/chat.json"

def load():
    if not os.path.exists(DB):
        return []
    return json.load(open(DB))

def save(data):
    json.dump(data, open(DB, "w"))

@chat_bp.route("/all", methods=["GET"])
def get_chat():
    return jsonify(load())

@chat_bp.route("/send", methods=["POST"])
def send_chat():
    data = load()
    msg = request.json
    data.append(msg)
    save(data)
    return jsonify({"status": "sent"})