# Continuous 2FA Project - Clean Status

## 🧹 Cleaned Project Structure

### Backend Files (Working)
- **app.py** - Main Flask application (cleaned, working)
- **test_db.py** - Database connection test
- **config.py** - Configuration settings

### Models (Working)
- **decision_model.py** ✅ - Database operations for authentication decisions
- **user_model.py** ✅ - User management and authentication
- **db.py** - Database initialization

### Routes (Working)
- **trust_routes.py** ✅ - Trust calculation endpoints with rate limiting
- **auth_routes.py** - Authentication routes
- **admin_routes.py** - Admin dashboard routes
- **user_routes.py** - User dashboard routes

### Utils (Working)
- **wifi_scanner.py** ✅ - Real WiFi scanning + simulation fallback
- **watch_reader.py** ✅ - Smartwatch proximity simulation
- **audio_analyzer.py** - Audio MFCC entropy analysis
- **database.py** - Database connection manager
- **cache.py** - Caching system

### Frontend Files (Cleaned)
- **admin/trading-dashboard.html** ✅ - Professional trading-style admin dashboard
- **admin/trading-dashboard.css** ✅ - Dark cyber theme styling
- **admin/trading-dashboard.js** ✅ - Interactive charts and filtering
- **admin/admin-login.html** ✅ - Admin login page
- **user/index.html** ✅ - User dashboard
- **user/login.html** ✅ - User login (fixed API response format)
- **user/app.js** ✅ - User dashboard JavaScript
- **user/user.css** ✅ - User dashboard styling

## 🗑️ Removed Duplicates
- ❌ app_optimized.py, app_simple.py (kept app.py)
- ❌ simple_test.py, test_admin_login.py (kept test_db.py)
- ❌ admin/index.html, admin.css, admin.js (kept trading-dashboard)
- ❌ user/app_clean.js, app_fixed.js (kept app.js)

## ✅ Working Features

### WiFi Scanner
- Real WiFi scanning on Windows/Linux/macOS
- Simulation fallback if real scanning fails
- Signal stability calculation
- Network fingerprinting
- Continuous scanning with threading

### Watch Reader
- Proximity simulation with realistic variations
- Gaussian distribution for natural behavior

### Trust Routes
- Rate limiting (100 calculations/minute)
- Authentication middleware
- Trust score calculation
- Decision logging

### Models
- User authentication with password hashing
- Decision tracking and statistics
- Database connection pooling

### Dashboards
- **Admin**: Professional trading-style interface with filters, charts, live monitoring
- **User**: Clean modern interface with real-time updates

## 🚀 How to Run

1. **Start PostgreSQL** (through pgAdmin or services)
2. **Test Database**: `python test_db.py`
3. **Run Backend**: `python app.py`
4. **Access URLs**:
   - User Dashboard: http://127.0.0.1:5000/
   - User Login: http://127.0.0.1:5000/login.html
   - Admin Login: http://127.0.0.1:5000/admin-login.html
   - Admin Dashboard: http://127.0.0.1:5000/admin

## 🔑 Login Credentials
- **User**: Any username/password
- **Admin**: admin/admin123

## 📊 API Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/trust/calculate` - Calculate trust score
- `GET /api/trust/history/<user_id>` - Trust history

All files are now clean, organized, and working properly!