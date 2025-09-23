import datetime, numpy as np
from flask import Blueprint, jsonify

from backend.models.preprocess import build_feature_vector
from backend.utils.wifi_scanner import get_wifi_rssi
from backend.utils.audio_analyzer import get_audio_mfcc_entropy
from backend.utils.watch_reader import get_watch_proximity
from backend.routes.decisions import _read_store, _write_store, _ensure_store

from .decisions import _read_store, _write_store, _ensure_store

metrics_bp = Blueprint("metrics", __name__)

# Simple heuristic model for trust score
def heuristic_trust(features):
    rssi_avg = np.mean(features['wifi_rssi'])
    entropy = features['audio_entropy']
    prox = features['watch_proximity']
    trust = 1.0 - (abs(rssi_avg + 60)/25 + abs(entropy - 0.6)/0.4 + abs(prox - 1.5)/3.5) / 3
    if prox > 3.0: trust -= 0.3
    return max(0.0, min(1.0, trust))

# Get current metrics and make a decision
@metrics_bp.route("/", methods=["GET"])
def get_metrics():
    wifi = {"rssi": get_wifi_rssi()}
    audio = {"mfcc_entropy": get_audio_mfcc_entropy()}
    watch = {"proximity_m": get_watch_proximity()}

    features = {
        "wifi_rssi": wifi["rssi"],
        "audio_entropy": audio["mfcc_entropy"],
        "watch_proximity": watch["proximity_m"]
    }

    trust = heuristic_trust(features)
    result = "safe" if trust >= 0.65 else "anomalous"
    note = "OK" if result == "safe" else "Anomaly detected"

    _ensure_store()
    data = _read_store()
    data["items"].append({
        "timestamp": datetime.datetime.utcnow().isoformat()+"Z",
        "trust": round(trust, 2),
        "result": result,
        "note": note
    })
    _write_store(data)

    return jsonify({
        "wifi": wifi, "audio": audio, "watch": watch,
        "trust": round(trust, 2), "result": result, "note": note
    })
