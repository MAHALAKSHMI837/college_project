# Continuous 2FA Backend (with Real Audio)

This backend provides APIs for Continuous Two-Factor Authentication using Wi-Fi, Ambient Sound, and Smartwatch data.  
Now updated to include **real ambient sound recording** via microphone.

---

## 🚀 Quick Start

### 1. Create & Activate Virtual Environment
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

If using the audio module, also ensure:
```bash
pip install sounddevice librosa
```

- On Linux: you may need `sudo apt-get install portaudio19-dev`
- On Windows: `pip install pipwin && pipwin install pyaudio`
- On macOS: `brew install portaudio`

### 3. Train the Demo Model
```bash
python backend/models/train_model.py
```

### 4. Run the Backend
```bash
python backend/app.py
```
Now your API runs on **http://127.0.0.1:5000**

---

## 🎤 Audio Feature Extraction

The updated `backend/utils/audio_analyzer.py` will:
1. Record 3 seconds of ambient sound from your default microphone.
2. Extract MFCC (Mel-Frequency Cepstral Coefficients) using `librosa`.
3. Compute a simple **entropy-like score** (0.0 – 1.0).

- **Quiet environment** → Low entropy (e.g., 0.4–0.5)
- **Noisy environment** → High entropy (e.g., 0.7–0.9)

This entropy is used as one of the trust factors in continuous authentication.

### Example (quiet room)
```json
"audio": {"mfcc_entropy": 0.42}, "trust": 0.89, "result": "safe"
```

### Example (noisy cafeteria)
```json
"audio": {"mfcc_entropy": 0.81}, "trust": 0.47, "result": "anomalous"
```

---

## 🔗 API Endpoints

- `GET /api/config/` → System configuration (intervals, thresholds)
- `GET /api/metrics/` → Current Wi-Fi, Audio, Watch metrics + trust score
- `GET /api/decisions/` → Recent authentication decisions

---

## 📂 Project Structure
- `backend/utils/audio_analyzer.py` → Ambient sound capture + MFCC entropy
- `backend/utils/wifi_scanner.py` → Simulated Wi-Fi RSSI values
- `backend/utils/watch_reader.py` → Simulated smartwatch proximity
- `backend/models/` → ML model training + preprocessing
- `backend/routes/` → API routes for metrics, config, decisions
- `data/processed/decisions_store.json` → Rolling decision history

---

## ⚠️ Notes
- Ensure your microphone is accessible to Python when running the backend.
- If microphone access fails, the system returns a fallback entropy value of `0.6`.

