#!/usr/bin/env python3
"""
Quick admin login test
"""
import urllib.request
import urllib.parse
import json

def test_admin_login():
    url = "http://127.0.0.1:5000/api/auth/admin-login"
    data = {"username": "admin", "password": "admin123"}
    
    try:
        json_data = json.dumps(data).encode('utf-8')
        headers = {'Content-Type': 'application/json'}
        req = urllib.request.Request(url, data=json_data, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.getcode()
            content = response.read().decode('utf-8')
            
            print(f"Status: {status}")
            print(f"Response: {content}")
            
            if status == 200:
                result = json.loads(content)
                if result.get('success'):
                    print("✅ Admin login working!")
                    return True
            
            print("❌ Admin login failed")
            return False
            
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code}")
        try:
            error_content = e.read().decode('utf-8')
            print(f"Error response: {error_content}")
        except:
            pass
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔐 Testing Admin Login...")
    test_admin_login()