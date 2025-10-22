#!/usr/bin/env python3
"""
Comprehensive endpoint testing script for Continuous 2FA API
"""
try:
    import requests
except ImportError:
    print("❌ Error: 'requests' library not found.")
    print("Install it with: pip install requests")
    exit(1)

import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(method, endpoint, data=None, headers=None, expected_status=200):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        status_ok = response.status_code == expected_status
        status_icon = "✅" if status_ok else "❌"
        
        print(f"{status_icon} {method} {endpoint} - Status: {response.status_code}")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            try:
                json_data = response.json()
                if not status_ok:
                    print(f"   Response: {json_data}")
                return json_data
            except:
                print(f"   Response: {response.text[:100]}...")
        
        return status_ok
        
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint} - Connection Error (Server not running?)")
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return False

def main():
    print("🚀 Testing Continuous 2FA API Endpoints")
    print("=" * 50)
    
    # Test health check first
    print("\n📊 Health Check:")
    health = test_endpoint("GET", "/api/health")
    
    if not health:
        print("❌ Server is not running. Please start the backend first.")
        return
    
    # Test authentication endpoints
    print("\n🔐 Authentication Endpoints:")
    
    # Test user login
    login_data = {"username": "sample", "password": "password123"}
    login_response = test_endpoint("POST", "/api/auth/login", login_data)
    
    user_token = None
    if login_response and login_response.get('success'):
        user_token = login_response.get('data', {}).get('token')
        print(f"   User token obtained: {user_token[:20]}...")
    
    # Test admin login
    admin_data = {"username": "admin", "password": "admin123"}
    admin_response = test_endpoint("POST", "/api/auth/admin-login", admin_data)
    
    admin_token = None
    if admin_response and admin_response.get('success'):
        admin_token = admin_response.get('data', {}).get('token')
        print(f"   Admin token obtained: {admin_token[:20]}...")
    
    # Test user registration
    register_data = {
        "username": f"testuser_{int(time.time())}",
        "password": "testpass123",
        "email": "test@example.com"
    }
    test_endpoint("POST", "/api/auth/register", register_data, expected_status=201)
    
    # Test user endpoints (with authentication)
    print("\n👤 User Endpoints:")
    if user_token:
        headers = {"Authorization": f"Bearer {user_token}"}
        test_endpoint("GET", "/api/user/profile", headers=headers)
        test_endpoint("GET", "/api/user/decisions", headers=headers)
        test_endpoint("GET", "/api/user/decisions/1", headers=headers)
    else:
        print("   ⚠️  Skipping user endpoints (no token)")
    
    # Test admin endpoints
    print("\n👨‍💼 Admin Endpoints:")
    test_endpoint("GET", "/api/admin/users")
    test_endpoint("GET", "/api/admin/decisions")
    test_endpoint("GET", "/api/admin/stats")
    
    # Test trust calculation endpoints
    print("\n🧠 Trust Calculation Endpoints:")
    trust_data = {
        "user_id": 1,
        "behavioral_data": {
            "wifi_rssi": [-45, -46, -44],
            "audio_entropy": 0.65,
            "watch_proximity": 0.8
        }
    }
    test_endpoint("POST", "/api/trust/calculate", trust_data)
    
    if user_token:
        headers = {"Authorization": f"Bearer {user_token}"}
        test_endpoint("GET", "/api/trust/history/1", headers=headers)
    
    # Test debug endpoints
    print("\n🐛 Debug Endpoints:")
    test_endpoint("POST", "/api/debug/create-test-data")
    test_endpoint("GET", "/api/debug/stats")
    
    # Test frontend routes
    print("\n🌐 Frontend Routes:")
    test_endpoint("GET", "/")
    test_endpoint("GET", "/login.html")
    test_endpoint("GET", "/admin-login.html")
    test_endpoint("GET", "/admin")
    
    print("\n" + "=" * 50)
    print("✅ Endpoint testing completed!")
    print("\n📝 Next steps:")
    print("   1. Check failed endpoints above")
    print("   2. Verify database connection")
    print("   3. Test frontend functionality")

if __name__ == "__main__":
    main()