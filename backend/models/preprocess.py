import numpy as np

MODEL_FEATURES = [
    "rssi_0","rssi_1","rssi_2","rssi_3","rssi_4",
    "audio_entropy",
    "watch_proximity"
]

def build_feature_vector(features: dict) -> np.ndarray:
    rssi = features.get("wifi_rssi", [-60,-62,-65,-70,-75])[:5]
    if len(rssi) < 5:
        rssi = (rssi + [-75,-80,-85,-90,-95])[:5]
    vec = list(rssi)
    vec.append(float(features.get("audio_entropy", 0.6)))
    vec.append(float(features.get("watch_proximity", 1.5)))
    return np.array(vec, dtype=float)
