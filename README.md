# Continuous 2FA Backend (Final Version)

Backend server for Continuous Two-Factor Authentication project.
It integrates Wi-Fi RSSI, Ambient Sound MFCC entropy, and Smartwatch proximity
to generate a trust score in real time.

## Setup
python -m venv .venv

.venv\Scripts\activate    # Windows

pip install -r backend/requirements.txt
```

For audio:
```bash
pip install sounddevice librosa
```

Linux: `sudo apt-get install portaudio19-dev`  
Mac: `brew install portaudio`  
Windows: `pip install pipwin && pipwin install pyaudio`

## Run
```bash
python backend/models/train_model.py   # train demo model
python backend/app.py                  # run backend at http://127.0.0.1:5000
```

## Endpoints
- GET `/api/config/`
- GET `/api/metrics/`
- GET `/api/decisions/?limit=12`
"# college_project" 
python -m backend.app
