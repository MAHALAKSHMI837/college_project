#!/usr/bin/env python3
"""
Simple endpoint testing using built-in urllib (no external dependencies)
"""
import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test endpoint using urllib"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if headers is None:
            headers = {}
        
        if method.upper() == "GET":
            req = urllib.request.Request(url, headers=headers)
        elif method.upper() == "POST":
            json_data = json.dumps(data or {}).encode('utf-8')
            headers['Content-Type'] = 'application/json'
            req = urllib.request.Request(url, data=json_data, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.getcode()
            content = response.read().decode('utf-8')
            
            print(f"✅ {method} {endpoint} - Status: {status}")
            
            try:
                return json.loads(content)
            except:
                return True
                
    except urllib.error.HTTPError as e:
        print(f"❌ {method} {endpoint} - HTTP Error: {e.code}")
        try:
            error_content = e.read().decode('utf-8')
            error_data = json.loads(error_content)
            print(f"   Error: {error_data}")
        except:
            pass
        return False
    except urllib.error.URLError:
        print(f"❌ {method} {endpoint} - Connection Error (Server not running?)")
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return False

def main():
    print("🚀 Simple API Test (No External Dependencies)")
    print("=" * 50)
    
    # Test health check
    print("\n📊 Health Check:")
    health = test_endpoint("GET", "/api/health")
    
    if not health:
        print("❌ Server is not running. Start with: python app_optimized.py")
        return
    
    # Test auth endpoints
    print("\n🔐 Authentication:")
    login_data = {"username": "sample", "password": "password123"}
    login_response = test_endpoint("POST", "/api/auth/login", login_data)
    
    admin_data = {"username": "admin", "password": "admin123"}
    admin_response = test_endpoint("POST", "/api/auth/admin-login", admin_data)
    
    # Test admin endpoints (no auth required)
    print("\n👨💼 Admin Endpoints:")
    test_endpoint("GET", "/api/admin/users")
    test_endpoint("GET", "/api/admin/decisions")
    test_endpoint("GET", "/api/admin/stats")
    
    # Test trust endpoint
    print("\n🧠 Trust Calculation:")
    trust_data = {"user_id": 1, "behavioral_data": {"wifi_rssi": [-45]}}
    test_endpoint("POST", "/api/trust/calculate", trust_data)
    
    # Test frontend
    print("\n🌐 Frontend:")
    test_endpoint("GET", "/")
    test_endpoint("GET", "/login.html")
    test_endpoint("GET", "/admin-login.html")
    
    print("\n✅ Basic testing completed!")

if __name__ == "__main__":
    main()