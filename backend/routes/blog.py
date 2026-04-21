from flask import Blueprint, request, jsonify
import json, os

blog_bp = Blueprint("blog", __name__)
DB = "data/blog.json"

def load():
    if not os.path.exists(DB):
        return []
    return json.load(open(DB))

def save(data):
    json.dump(data, open(DB, "w"))

@blog_bp.route("/all", methods=["GET"])
def get_blog():
    return jsonify(load())

@blog_bp.route("/add", methods=["POST"])
def add_blog():
    data = load()
    post = request.json
    data.append(post)
    save(data)
    return jsonify({"status": "ok"})