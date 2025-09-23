import os, json
from flask import Blueprint, jsonify, request

decisions_bp = Blueprint("decisions", __name__)
STORE_PATH = os.path.abspath("data/processed/decisions_store.json")

# Simple file-based storage for decisions
def _ensure_store():
    os.makedirs(os.path.dirname(STORE_PATH), exist_ok=True)
    if not os.path.exists(STORE_PATH):
        with open(STORE_PATH, "w") as f:
            json.dump({"items": []}, f)

# Read and write decision store
def _read_store():
    _ensure_store()
    with open(STORE_PATH, "r") as f:
        return json.load(f)

# Write the entire store
def _write_store(data):
    with open(STORE_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Save a new decision
@decisions_bp.route("/", methods=["GET"])
def get_decisions():
    limit = int(request.args.get("limit", 12))
    data = _read_store()
    return jsonify({"items": data.get("items", [])[-limit:][::-1]})
