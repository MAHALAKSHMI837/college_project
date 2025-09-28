import os
import sys
from flask import Flask, send_from_directory, jsonify, request
from datetime import datetime, timezone, timedelta
from flask_cors import CORS
import jwt
import sqlite3
from pathlib import Path

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'continuous-2fa-super-secret-key-2024'
app.config['DATABASE_PATH'] = os.path.join(current_dir, 'database', 'users.db')

print("🔧 Starting Continuous 2FA Authentication System...")
print(f"📁 Current directory: {current_dir}")
print(f"📁 Parent directory: {parent_dir}")

# Database setup - ENHANCED VERSION
def init_database():
    """Initialize the SQLite database with proper data"""
    db_path = app.config['DATABASE_PATH']
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            device TEXT DEFAULT 'Unknown Device',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create decisions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            trust_score REAL NOT NULL,
            decision TEXT NOT NULL,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Check if sample user exists
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'sample'")
    user_exists = cursor.fetchone()[0] > 0
    
    if not user_exists:
        # Insert sample user with hashed password
        cursor.execute('''
            INSERT INTO users (username, password_hash, email, device) 
            VALUES (?, ?, ?, ?)
        ''', ('sample', 'password123', 'sample@example.com', 'Web Browser'))
        
        print("✅ Sample user created: sample / password123")
    
    # Check for existing decisions
    cursor.execute("SELECT COUNT(*) FROM decisions")
    decision_count = cursor.fetchone()[0]
    
    print(f"📊 Database initialized: {decision_count} decisions in system")
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

# Initialize database
init_database()

def get_db_connection():
    """Get database connection"""
    try:
        conn = sqlite3.connect(app.config['DATABASE_PATH'])
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return None

# ==================== AUTHENTICATION ROUTES ====================

@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login endpoint with proper data storage"""
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "")
        device = data.get("device", "Web Browser")

        print(f"🔐 Login attempt for user: '{username}'")

        # Get database connection
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database error"}), 500
        
        try:
            cursor = conn.cursor()
            # Find user in database
            cursor.execute(
                "SELECT id, username, password_hash, device FROM users WHERE username = ?", 
                (username,)
            )
            user = cursor.fetchone()

            if not user:
                print(f"❌ User not found: {username}")
                return jsonify({
                    "success": False,
                    "message": "Invalid credentials"
                }), 401

         # Simple password check (in production, use proper hashing)
            stored_password = user[2]  # password_hash field
            if password != stored_password:
                print(f"❌ Invalid password for user: {username}")
                return jsonify({
                    "success": False,
                    "message": "Invalid credentials"
                }), 401
            
             # Update user's device info
            cursor.execute(
                "UPDATE users SET device = ? WHERE id = ?",
                (device, user[0])
            )
            
        # Simple authentication for demo (in production, use proper hashing)
        if username == "sample" and password == "password123":
            # Generate JWT token
            token = jwt.encode({
            'user_id': 1,
            'username': username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)  # Fixed
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            conn.commit()

            print(f"✅ Login successful for: {username}")
            
            return jsonify({
                "success": True,
                "message": "Login successful",
                "token": token,
                "user_id": 1,
                "username": username,
                "device": "Current Device"
            })
        finally:
            conn.close()
        
            else:
            print("❌ Invalid credentials")
            return jsonify({
                "success": False,
                "message": "Invalid credentials. Use: username='sample', password='password123'"
            }), 401
            
    except Exception as e:
        print(f"❌ Decision error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/auth/register", methods=["POST"])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json() or {}
        username = data.get("username", "").strip()
        password = data.get("password", "")
        email = data.get("email", "")
        
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database error"}), 500
        
        try:
            cursor = conn.cursor()
            
            # Check if username exists
            cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
            if cursor.fetchone():
                return jsonify({"error": "Username already exists"}), 400
            
            # Create user (in production, hash the password)
            cursor.execute(
                "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)",
                (username, password, email)
            )
            user_id = cursor.lastrowid
            conn.commit()
            
            # Generate token
            token = jwt.encode({
            'user_id': 1,
            'username': username,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)  # Fixed
             }, app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                "success": True,
                "message": "User registered successfully",
                "token": token,
                "user_id": user_id,
                "username": username
            }), 201
            
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/decision", methods=["POST"])
def make_decision():
    """Save authentication decision"""
    try:
        data = request.get_json() or {}
        user_id = data.get("user_id")
        trust_score = data.get("trust")
        
        if not user_id or trust_score is None:
            return jsonify({"error": "User ID and trust score are required"}), 400
        
        # Determine decision based on trust score
        if trust_score >= 0.7:
            decision = "ALLOW"
            note = "Normal behavior pattern detected"
        elif trust_score >= 0.4:
            decision = "CHALLENGE"
            note = "Additional verification required"
        else:
            decision = "BLOCK"
            note = "Suspicious activity detected"
        
        # Save to database
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO decisions (user_id, trust_score, decision, note) VALUES (?, ?, ?, ?)",
                    (user_id, trust_score, decision, note)
                )
                conn.commit()
                print(f"✅ Decision saved: {decision} (Trust: {trust_score})")
            finally:
                conn.close()
        
        return jsonify({
            "success": True,
            "result": decision,
            "note": note,
            "trust": trust_score,
            "user_id": user_id
        })
        
    except Exception as e:
        print(f"❌ Decision error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# ==================== TRUST ROUTES ====================

@app.route("/api/trust/score", methods=["POST"])
def calculate_trust_score():
    """Calculate trust score based on behavioral data"""
    try:
        data = request.get_json() or {}
        user_id = data.get("user_id")
        behavioral_data = data.get("behavioral_data", {})
        
        print(f"📊 Trust calculation request for user {user_id}")
        print(f"📈 Behavioral data: {behavioral_data}")
        
        # Mock trust score calculation
        base_score = 0.7  # Base trust level
        
        # Adjust based on behavioral data (simplified for demo)
        if behavioral_data.get('typing_metrics'):
            base_score += 0.1
        if behavioral_data.get('mouse_metrics'):
            base_score += 0.1
        if behavioral_data.get('context'):
            base_score += 0.05
        
        # Add some randomness for demo
        import random
        trust_score = base_score + (random.random() * 0.2 - 0.1)  # ±0.1 variation
        trust_score = max(0.1, min(0.99, trust_score))  # Clamp between 0.1-0.99
        
        # Determine confidence
        if trust_score > 0.7:
            confidence = 'high'
        elif trust_score > 0.4:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        print(f"✅ Trust score calculated: {trust_score:.2f} ({confidence})")
        
        return jsonify({
            'trust_score': round(trust_score, 2),
            'confidence': confidence,
            'status': 'success',
            'user_id': user_id,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        print(f"❌ Trust calculation error: {e}")
        return jsonify({'error': str(e), 'trust_score': 0.5}), 500

@app.route("/api/trust/test", methods=["GET"])
def trust_test():
    """Test endpoint for trust routes"""
    return jsonify({
        'message': 'Trust API is working!', 
        'status': 'success',
        'test_trust_score': 0.75,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })
 

# ==================== ADMIN ROUTES ====================

@app.route("/api/admin/users", methods=["GET"])
def get_all_users():
    """Get all users (admin function)"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database error"}), 500
        
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, device, created_at FROM users ORDER BY created_at DESC")
        users = []
        for row in cursor.fetchall():
            users.append({
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "device": row[3],
                "created_at": row[4]
            })
        
        conn.close()
        return jsonify(users)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/decisions", methods=["GET"])
def get_all_decisions():
    """Get all decisions (admin function)"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database error"}), 500
        
        cursor = conn.cursor()
        cursor.execute('''
            SELECT d.id, u.username, d.trust_score, d.decision, d.note, d.created_at 
            FROM decisions d 
            JOIN users u ON d.user_id = u.id 
            ORDER BY d.created_at DESC
            LIMIT 100
        ''')
        
        decisions = []
        for row in cursor.fetchall():
            decisions.append({
                "id": row[0],
                "username": row[1],
                "trust_score": row[2],
                "decision": row[3],
                "note": row[4],
                "created_at": row[5]
            })
        
        conn.close()
        return jsonify(decisions)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/stats", methods=["GET"])
def get_system_stats():
    """Get system statistics"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database error"}), 500
        
        cursor = conn.cursor()
        
        # User count
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        # Decision counts
        cursor.execute("SELECT decision, COUNT(*) FROM decisions GROUP BY decision")
        decision_counts = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Average trust score
        cursor.execute("SELECT AVG(trust_score) FROM decisions")
        avg_trust = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return jsonify({
            "total_users": user_count,
            "total_decisions": sum(decision_counts.values()),
            "decision_breakdown": decision_counts,
            "average_trust_score": round(avg_trust, 2),
            "system_status": "operational"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================== HEALTH & DEBUG ROUTES ====================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "Continuous 2FA System is running",
        'timestamp': datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    })

@app.route("/api/debug/endpoints", methods=["GET"])
def debug_endpoints():
    """Show all registered endpoints"""
    endpoints = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            endpoints.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods),#type: ignore
                'path': str(rule)
            })
    return jsonify(endpoints)

@app.route("/api/debug/database", methods=["GET"])
def debug_database():
    """Debug database info"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = conn.cursor()
        
        # Table info
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Row counts
        table_counts = {}
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            table_counts[table] = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            "database_file": app.config['DATABASE_PATH'],
            "tables": tables,
            "row_counts": table_counts,
            "file_exists": os.path.exists(app.config['DATABASE_PATH'])
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================== FRONTEND SERVING ====================

FRONTEND_DIR = os.path.join(parent_dir, "frontend")

@app.route("/")
def serve_user_dashboard():
    """Serve user dashboard"""
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

@app.route("/login.html")
def serve_login():
    """Serve login page"""
    return send_from_directory(FRONTEND_DIR, "login.html")

@app.route("/admin")
def serve_admin_dashboard():
    """Serve admin dashboard"""
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # Serve static files
# @app.route("/<path:filename>")
# def serve_static(filename):
#     """Serve static files from user or admin directories"""
#     # Try user directory first
#     user_path = os.path.join(FRONTEND_DIR, "user", filename)
#     admin_path = os.path.join(FRONTEND_DIR, "admin", filename)
    
#     if os.path.exists(user_path):
#         return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)
#     elif os.path.exists(admin_path):
#         return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)
#     else:
#         return "File not found", 404

@app.route("/<path:filename>")
def serve_static(filename):
    """Serve static files from appropriate directories"""
    # Define possible file locations
    possible_paths = [
        os.path.join(FRONTEND_DIR, "user", filename),
        os.path.join(FRONTEND_DIR, "admin", filename),
        os.path.join(FRONTEND_DIR, filename)  # For files in root frontend directory
    ]
    
    # Try each path
    for path in possible_paths:
        if os.path.exists(path):
            directory = os.path.dirname(path)
            file_to_serve = os.path.basename(path)
            return send_from_directory(directory, file_to_serve)
    
    return "File not found", 404


@app.route("/user/<path:filename>")
def serve_user_files(filename):
    """Serve user static files"""
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

@app.route("/admin/<path:filename>")
def serve_admin_files(filename):
    """Serve admin static files"""
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found", "path": request.path}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ==================== MAIN APPLICATION ====================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 CONTINUOUS 2FA AUTHENTICATION SYSTEM")
    print("="*60)
    
    print("\n🌐 APPLICATION URLs:")
    print("   📍 User Dashboard: http://127.0.0.1:5000/")
    print("   🔐 Login Page:     http://127.0.0.1:5000/login.html")
    print("   👨‍💼 Admin Panel:    http://127.0.0.1:5000/admin")
    
    print("\n🔧 API ENDPOINTS:")
    print("   ✅ Health Check:    http://127.0.0.1:5000/api/health")
    print("   🔐 Auth Login:      http://127.0.0.1:5000/api/auth/login")
    print("   📊 Trust Score:     http://127.0.0.1:5000/api/trust/score")
    print("   👥 Admin Users:     http://127.0.0.1:5000/api/admin/users")
    print("   📈 Admin Decisions: http://127.0.0.1:5000/api/admin/decisions")
    
    print("\n🐛 DEBUG ENDPOINTS:")
    print("   🔍 All Endpoints:   http://127.0.0.1:5000/api/debug/endpoints")
    print("   💾 Database Info:   http://127.0.0.1:5000/api/debug/database")
    
    print("\n🔑 TEST CREDENTIALS:")
    print("   👤 Username: sample")
    print("   🔒 Password: password123")
    
    print("\n" + "="*60)
    print("✅ Server starting on http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    app.run(host="0.0.0.0", port=5000, debug=True)