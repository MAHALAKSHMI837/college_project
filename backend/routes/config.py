from flask import Blueprint, jsonify

config_bp = Blueprint("config", __name__)

CONFIG = {
    "wifiIntervalSec": 60,
    "audioIntervalSec": 300,
    "watchIntervalSec": 30,
    "trustMin": 0.65,
    "watchProxMaxMeters": 3.0
}

@config_bp.route("/", methods=["GET"])
def get_config():
    return jsonify(CONFIG)
