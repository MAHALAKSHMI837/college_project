import random

# Simulate WiFi RSSI readings
def get_wifi_rssi():
    base = -60 + random.uniform(-3,3)
    return [round(base + random.uniform(-6,6),1) for _ in range(5)]
