from flask import Blueprint, request, jsonify
import json
import os

auth_bp = Blueprint("auth", __name__)

DB = "data/users.json"

def load_users():
    if not os.path.exists(DB):
        return []
    with open(DB) as f:
        return json.load(f)

def save_users(users):
    with open(DB, "w") as f:
        json.dump(users, f)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username required"}), 400

    users = load_users()

    for user in users:
        if user["username"] == username:
            return jsonify({"status": "ok", "user": user})

    # auto register
    new_user = {"username": username}
    users.append(new_user)
    save_users(users)

    return jsonify({"status": "created", "user": new_user})