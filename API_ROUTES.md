# API Routes Documentation - WORKING ENDPOINTS

## ✅ Authentication Routes (`/api/auth/`)

### User Login
- **POST** `/api/auth/login`
- **Body**: `{"username": "sample", "password": "password123"}`
- **Response**: `{"success": true, "data": {"token": "...", "user_id": 1, "username": "sample"}}`
- **Status**: ✅ WORKING

### Admin Login  
- **POST** `/api/auth/admin-login`
- **Body**: `{"username": "admin", "password": "admin123"}`
- **Response**: `{"success": true, "data": {"token": "...", "user_id": 999, "is_admin": true}}`
- **Status**: ✅ WORKING

### User Registration
- **POST** `/api/auth/register`
- **Body**: `{"username": "newuser", "password": "password123", "email": "user@example.com"}`
- **Response**: `{"success": true, "data": {"token": "...", "user_id": 2}}`
- **Status**: ✅ WORKING

## ✅ User Routes (`/api/user/`)

### Get User Profile
- **GET** `/api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"success": true, "data": {"id": 1, "username": "sample", "email": "..."}}`
- **Status**: ✅ WORKING

### Get User Decisions
- **GET** `/api/user/decisions`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"success": true, "data": [{"trust_score": 0.85, "result": "ALLOW", "created_at": "..."}]}`
- **Status**: ✅ WORKING

### Get Specific User Decisions
- **GET** `/api/user/decisions/<user_id>`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"success": true, "data": [...]}`
- **Status**: ✅ WORKING

## ✅ Admin Routes (`/api/admin/`)

### Get All Users
- **GET** `/api/admin/users`
- **Response**: `{"success": true, "data": [{"id": 1, "username": "sample", "email": "...", "created_at": "..."}]}`
- **Status**: ✅ WORKING

### Get All Decisions
- **GET** `/api/admin/decisions?limit=100`
- **Response**: `{"success": true, "data": [{"username": "sample", "trust_score": 0.85, "result": "ALLOW", "created_at": "..."}]}`
- **Status**: ✅ WORKING

### Get System Statistics
- **GET** `/api/admin/stats`
- **Response**: `{"success": true, "data": {"total_users": 2, "total_decisions": 10, "average_trust_score": 0.75, "decision_breakdown": {"ALLOW": 7, "CHALLENGE": 2, "BLOCK": 1}}}`
- **Status**: ✅ WORKING

## ✅ Trust Routes (`/api/trust/`)

### Calculate Trust Score
- **POST** `/api/trust/calculate`
- **Body**: `{"user_id": 1, "behavioral_data": {"wifi_rssi": [-45, -46], "audio_entropy": 0.5}}`
- **Response**: `{"success": true, "data": {"trust_score": 0.85, "decision": "ALLOW", "confidence": "high"}}`
- **Status**: ✅ WORKING

### Get Trust History
- **GET** `/api/trust/history/<user_id>`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"success": true, "data": {"trust_history": [0.85, 0.82], "recent_decisions": [...]}}`
- **Status**: ✅ WORKING

## ✅ Debug Routes (`/api/debug/`)

### Create Test Data
- **POST** `/api/debug/create-test-data`
- **Response**: `{"success": true, "data": {"decisions_created": 15, "users_processed": 3}}`
- **Status**: ✅ WORKING

### Get Debug Stats
- **GET** `/api/debug/stats`
- **Response**: `{"success": true, "data": {"users_count": 3, "decisions_stats": {...}}}`
- **Status**: ✅ WORKING

## ✅ Health Check
- **GET** `/api/health`
- **Response**: `{"status": "healthy", "message": "Continuous 2FA System is running", "version": "2.0.0"}`
- **Status**: ✅ WORKING

## ✅ Frontend Routes

### User Pages
- **GET** `/` - User Dashboard - ✅ WORKING
- **GET** `/login.html` - User Login Page - ✅ WORKING

### Admin Pages
- **GET** `/admin` - Admin Dashboard - ✅ WORKING
- **GET** `/admin-login.html` - Admin Login Page - ✅ WORKING

## 🧪 Testing

Run the endpoint test script:
```bash
python test_endpoints.py
```

## 🚀 Quick Start

1. Start backend:
```bash
python start_backend.py
```

2. Test all endpoints:
```bash
python backend/test_endpoints.py
```

3. Access frontend:
- User Login: http://127.0.0.1:5000/login.html
- Admin Login: http://127.0.0.1:5000/admin-login.html

## Authentication Headers
For protected routes, include:
```
Authorization: Bearer <jwt_token>
```

## Error Responses
All endpoints return errors in format:
```json
{
  "success": false,
  "error": "Error message",
  "code": 400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```