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


============================================================================================================================

# Continuous Two-Factor Authentication Using Wi-Fi and Ambient Sound

A prototype **Continuous 2FA (Two-Factor Authentication) system** that enhances user verification by leveraging **Wi-Fi fingerprints**, **ambient audio entropy**, and **wearable device proximity**.  
It provides a **web-based dashboard** for both **users** and **admins** to monitor trust scores, recent authentication decisions, and system statistics in real time.

---

## 🚀 Features

- **Multi-sensor Authentication**
  - Wi-Fi RSSI patterns (fingerprint stability).
  - Ambient audio MFCC entropy.
  - Smartwatch / wearable proximity.
- **Trust Score Computation**
  - Rolling average trust calculation.
  - Configurable thresholds for safe / challenge / block decisions.
- **User Dashboard**
  - Live trust score visualization.
  - Recent authentication decisions.
  - Real-time stream charts.
- **Admin Dashboard**
  - Manage users and devices.
  - Monitor decision trends and statistics.
  - Trust trend (line chart) and decision breakdown (pie chart).
  - Auto-refresh and manual refresh support.
- **Backend API**
  - RESTful endpoints for users, metrics, and admin controls.
  - PostgreSQL database with structured tables (`users`, `metrics`, `decisions`).
- **Scalable Architecture**
  - Flask backend + PostgreSQL.
  - Frontend in vanilla JS + Chart.js.
  - Modular file structure (backend routes, models, utils).

---

## 🏗️ Architecture
┌──────────────┐       ┌───────────────┐
│ User App     │◀────▶│ Flask API     │◀────┐
│ (Dashboard)  │       │ (backend/)    │      │
└──────────────┘       └───────────────┘      │
                                              │
┌──────────────┐         ┌───────────────┐    │
│ Admin App    │  ◀────▶│ REST Endpoints│    │
│ (Dashboard)  │         │ /api/admin/*  │    │
└──────────────┘         └───────────────┘    │
                                              │
                                ┌─────────────▼──-───────────┐
                                │ PostgreSQL DB              │
                                │ users / metrics / decisions│
                                └────────────────────────────┘


---

## 📂 Project Structure
continuous-2fa-auth/
│
├── backend/
│ ├── app.py # Flask entry point
│ ├── utils/
│ │ └── db.py # PostgreSQL connection helper
│ ├── models/
│ │ ├── user_model.py # User table logic
│ │ ├── decision_model.py # Decision table logic
│ │ └── metrics_model.py # Metrics table logic
│ ├── routes/
│ │ ├── auth.py # Auth decision simulation
│ │ ├── user_routes.py # User dashboard endpoints
│ │ └── admin_routes.py # Admin dashboard endpoints
│ └── requirements.txt # Python dependencies
│
├── frontend/
│ ├── user/
│ │ ├── index.html # User dashboard
│ │ ├── app.js # User dashboard logic
│ │ └── user.css # Styles
│ ├── admin/
│ │ ├── index.html # Admin dashboard
│ │ ├── admin.js # Admin logic (charts, stats)
│ │ └── admin.css # Styles
│
├── docs/
│ ├── abstract.md # Abstract of the project
│ ├── architecture.png # Architecture diagram
│ └── block_diagram.png # Block diagram
│
└── README.md # This file


---

## 🛠️ Setup

### 1. Clone the Repository
```bash
git clone https://github.com/MAHALAKSHMI837/continuous-2fa-auth.git
cd continuous-2fa-auth

2. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt


3. Database Setup (PostgreSQL)
Create a new database in pgAdmin or psql:
CREATE DATABASE auth_system;

Inside it, create tables:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    device VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decisions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trust_score FLOAT NOT NULL,
    result VARCHAR(20) NOT NULL,
    note TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    wifi_rssi FLOAT,
    audio_entropy FLOAT,
    watch_proximity FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Update your db.py with correct credentials:

import psycopg2

def get_db():
    return psycopg2.connect(
        dbname="auth_system",
        user="postgres",
        password="your_password",
        host="localhost",
        port="5432"
    )


4. Run Backend
cd backend
python -m app
Runs at: http://127.0.0.1:5000

5. Run Frontend
Open:
User Dashboard → frontend/user/index.html
Admin Dashboard → frontend/admin/index.html

API Endpoints
User Routes

POST /api/user/register → Register new user
GET /api/user/metrics/<user_id> → Fetch latest metrics
GET /api/user/decisions/<user_id> → Recent decisions for user

Admin Routes

GET /api/admin/users → List users
GET /api/admin/decisions → List all decisions
GET /api/admin/stats → Statistics (total users, avg trust, breakdown)

Auth Simulation
POST /api/auth/decision → Insert a decision (used by simulator)

📊 Dashboards
User Dashboard:-
Trust Score (line chart).
Wi-Fi RSSI variation.
Audio entropy detection.
Recent decisions table.
Live stream simulation.

Admin Dashboard:-
Total Users, Total Decisions, Avg Trust.
Users table.
Trust trend (24h line chart).
Decision breakdown (pie chart).
Recent decisions (latest 10).
Auto-refresh toggle.

🧪 Testing
Insert fake data:
INSERT INTO users (username, device) VALUES ('Maha', 'EEC-CSE-LAP-29');
INSERT INTO decisions (user_id, trust_score, result, note)
VALUES (1, 0.72, 'ALLOW', 'Wi-Fi stable');


🌱 Future Enhancements
Integration with real Wi-Fi scanning tools (instead of simulated metrics).
Real-time audio fingerprinting using Python audio libraries.
Wearable device integration via Bluetooth API.
Authentication policies configurable from Admin UI.
Production-ready deployment with Docker.

📜 License
This project is for research & academic purposes.
If using for commercial applications, please ensure compliance with patent & intellectual property laws.
