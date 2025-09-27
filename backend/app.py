# # # # # from flask import Flask, send_from_directory
# # # # # from flask_cors import CORS
# # # # # from backend.routes.user_routes import user_bp
# # # # # from backend.routes.admin_routes import admin_bp
# # # # # from backend.routes.trust_router import trust_bp  # ADD THIS LINE


# # # # # from backend.routes.auth import auth_bp
# # # # # import os

# # # # # app = Flask(__name__)
# # # # # CORS(app)

# # # # # # Register Blueprints
# # # # # app.register_blueprint(user_bp, url_prefix="/api/user")
# # # # # app.register_blueprint(admin_bp, url_prefix="/api/admin")
# # # # # app.register_blueprint(auth_bp, url_prefix="/api/auth")
# # # # # app.register_blueprint(trust_bp, url_prefix='/api/trust') 

# # # # # # Serve frontend files
# # # # # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # # # # FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# # # # # @app.route("/")
# # # # # def serve_user():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# # # # # @app.route("/login.html")
# # # # # def serve_login():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

# # # # # @app.route("/admin")
# # # # # def serve_admin():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # # # # @app.route("/user/<path:filename>")
# # # # # def serve_user_static(filename):
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# # # # # @app.route("/admin/<path:filename>")
# # # # # def serve_admin_static(filename):
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# # # # # # Test endpoints
# # # # # @app.route("/api/health")
# # # # # def health_check():
# # # # #     return {"status": "healthy", "message": "Server is running"}

# # # # # @app.route("/api/test-db")
# # # # # def test_db():
# # # # #     from backend.services.utils.db import get_db
# # # # #     conn = get_db()
# # # # #     if conn:
# # # # #         conn.close()
# # # # #         return {"database": "connected"}
# # # # #     else:
# # # # #         return {"database": "disconnected"}, 500

# # # # # if __name__ == "__main__":
# # # # #     print("🚀 Starting Continuous 2FA Authentication System...")
# # # # #     print("📍 Server running on http://127.0.0.1:5000")
# # # # #     print("👤 User dashboard: http://127.0.0.1:5000/user")
# # # # #     print("👨‍💼 Admin dashboard: http://127.0.0.1:5000/admin")
    
# # # # #     app.run(host="0.0.0.0", port=5000, debug=True)

# # # # # import os
# # # # # import sys
# # # # # from flask import Flask, send_from_directory
# # # # # from flask_cors import CORS

# # # # # # Add the backend directory to Python path
# # # # # current_dir = os.path.dirname(os.path.abspath(__file__))
# # # # # sys.path.insert(0, current_dir)

# # # # # # Now import your blueprints
# # # # # try:
# # # # #     from routes.user_routes import user_bp
# # # # #     from routes.admin_routes import admin_bp
# # # # #     from routes.trust_router import trust_bp
# # # # #     from routes.auth import auth_bp
# # # # #     from backend.config import Config
# # # # # except ImportError as e:
# # # # #     print(f"Import error: {e}")
# # # # #     print("Trying alternative import structure...")
# # # # #     from backend.routes.user_routes import user_bp
# # # # #     from backend.routes.admin_routes import admin_bp
# # # # #     from backend.routes.trust_router import trust_bp
# # # # #     from backend.routes.auth import auth_bp
# # # # #     from backend.config import Config

# # # # # app = Flask(__name__)

# # # # # # Load configuration
# # # # # app.config.from_object(Config)
# # # # # CORS(app)

# # # # # # Register Blueprints
# # # # # app.register_blueprint(user_bp, url_prefix="/api/user")
# # # # # app.register_blueprint(admin_bp, url_prefix="/api/admin")
# # # # # app.register_blueprint(auth_bp, url_prefix="/api/auth")
# # # # # app.register_blueprint(trust_bp, url_prefix='/api/trust')

# # # # # # Serve frontend files
# # # # # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # # # # FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# # # # # @app.route("/")
# # # # # def serve_user():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# # # # # @app.route("/login.html")
# # # # # def serve_login():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

# # # # # @app.route("/admin")
# # # # # def serve_admin():
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # # # # @app.route("/user/<path:filename>")
# # # # # def serve_user_static(filename):
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# # # # # @app.route("/admin/<path:filename>")
# # # # # def serve_admin_static(filename):
# # # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# # # # # # Test endpoints
# # # # # @app.route("/api/health")
# # # # # def health_check():
# # # # #     return {"status": "healthy", "message": "Server is running"}

# # # # # @app.route("/api/test-db")
# # # # # def test_db():
# # # # #     try:
# # # # #         from services.utils.db import get_db
# # # # #         conn = get_db()
# # # # #         if conn:
# # # # #             conn.close()
# # # # #             return {"database": "connected"}
# # # # #         else:
# # # # #             return {"database": "disconnected"}, 500
# # # # #     except Exception as e:
# # # # #         return {"database": "error", "message": str(e)}, 500

# # # # # if __name__ == "__main__":
# # # # #     print("🚀 Starting Continuous 2FA Authentication System...")
# # # # #     print("📍 Server running on http://127.0.0.1:5000")
# # # # #     print("👤 User dashboard: http://127.0.0.1:5000/")
# # # # #     print("👨‍💼 Admin dashboard: http://127.0.0.1:5000/admin")
# # # # #     print("🔧 Health check: http://127.0.0.1:5000/api/health")
    
# # # # #     app.run(host="0.0.0.0", port=5000, debug=True)

# # # # import os
# # # # import sys
# # # # from flask import Flask, send_from_directory
# # # # from flask_cors import CORS

# # # # # Add the current directory to Python path
# # # # current_dir = os.path.dirname(os.path.abspath(__file__))
# # # # sys.path.insert(0, current_dir)

# # # # app = Flask(__name__)

# # # # # Try to import configuration
# # # # try:
# # # #     from config import Config
# # # #     app.config.from_object(Config)
# # # #     print("✅ Configuration loaded successfully")
# # # # except ImportError as e:
# # # #     print(f"⚠️  Config import warning: {e}")
# # # #     # Set some basic config manually
# # # #     app.config['SECRET_KEY'] = 'fallback-secret-key'

# # # # CORS(app)

# # # # # Import and register blueprints
# # # # try:
# # # #     from routes.user_routes import user_bp
# # # #     from routes.admin_routes import admin_bp
# # # #     from routes.trust_router import trust_bp
# # # #     from routes.auth import auth_bp
    
# # # #     app.register_blueprint(user_bp, url_prefix="/api/user")
# # # #     app.register_blueprint(admin_bp, url_prefix="/api/admin")
# # # #     app.register_blueprint(auth_bp, url_prefix="/api/auth")
# # # #     app.register_blueprint(trust_bp, url_prefix='/api/trust')
# # # #     print("✅ All blueprints registered successfully")
    
# # # # except ImportError as e:
# # # #     print(f"❌ Error importing blueprints: {e}")

# # # # # Serve frontend files
# # # # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # # # FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# # # # @app.route("/")
# # # # def serve_user():
# # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# # # # @app.route("/login.html")
# # # # def serve_login():
# # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

# # # # @app.route("/admin")
# # # # def serve_admin():
# # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # # # @app.route("/user/<path:filename>")
# # # # def serve_user_static(filename):
# # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# # # # @app.route("/admin/<path:filename>")
# # # # def serve_admin_static(filename):
# # # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# # # # # Test endpoints
# # # # @app.route("/api/health")
# # # # def health_check():
# # # #     return {"status": "healthy", "message": "Server is running"}

# # # # if __name__ == "__main__":
# # # #     print("🚀 Starting Continuous 2FA Authentication System...")
# # # #     print("📍 Server running on http://127.0.0.1:5000")
    
# # # #     app.run(host="0.0.0.0", port=5000, debug=True)

# # # import os
# # # import sys
# # # from flask import Flask, send_from_directory, jsonify
# # # from flask_cors import CORS

# # # # Add the current directory to Python path
# # # current_dir = os.path.dirname(os.path.abspath(__file__))
# # # sys.path.insert(0, current_dir)

# # # app = Flask(__name__)

# # # # Try to import configuration
# # # try:
# # #     from config import Config
# # #     app.config.from_object(Config)
# # #     print("✅ Configuration loaded successfully")
# # # except ImportError as e:
# # #     print(f"⚠️  Config import warning: {e}")
# # #     # Set some basic config manually
# # #     app.config['SECRET_KEY'] = 'fallback-secret-key-for-development'

# # # CORS(app)

# # # # Import and register blueprints
# # # try:
# # #     from routes.user_routes import user_bp
# # #     app.register_blueprint(user_bp, url_prefix="/api/user")
# # #     print("✅ User routes registered")
# # # except ImportError as e:
# # #     print(f"❌ User routes error: {e}")

# # # try:
# # #     from routes.admin_routes import admin_bp
# # #     app.register_blueprint(admin_bp, url_prefix="/api/admin")
# # #     print("✅ Admin routes registered")
# # # except ImportError as e:
# # #     print(f"❌ Admin routes error: {e}")

# # # try:
# # #     from routes.auth import auth_bp
# # #     app.register_blueprint(auth_bp, url_prefix="/api/auth")
# # #     print("✅ Auth routes registered")
# # # except ImportError as e:
# # #     print(f"❌ Auth routes error: {e}")

# # # try:
# # #     from routes.trust_router import trust_bp
# # #     app.register_blueprint(trust_bp, url_prefix='/api/trust')
# # #     print("✅ Trust routes registered")
# # # except ImportError as e:
# # #     print(f"❌ Trust routes error: {e}")

# # # # Serve frontend files
# # # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # # FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# # # @app.route("/")
# # # def serve_user():
# # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# # # @app.route("/login.html")
# # # def serve_login():
# # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

# # # @app.route("/admin")
# # # def serve_admin():
# # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # # @app.route("/user/<path:filename>")
# # # def serve_user_static(filename):
# # #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# # # @app.route("/admin/<path:filename>")
# # # def serve_admin_static(filename):
# # #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# # # # Test endpoints
# # # @app.route("/api/health")
# # # def health_check():
# # #     return jsonify({"status": "healthy", "message": "Server is running"})

# # # @app.route("/api/debug/endpoints")
# # # def debug_endpoints():
# # #     """Show all registered endpoints"""
# # #     endpoints = []
# # #     for rule in app.url_map.iter_rules():
# # #         if rule.endpoint != 'static':
# # #             endpoints.append({
# # #                 'endpoint': rule.endpoint,
# # #                 'methods': list(rule.methods),
# # #                 'path': str(rule)
# # #             })
# # #     return jsonify(endpoints)

# # # # Error handlers
# # # @app.errorhandler(404)
# # # def not_found(error):
# # #     return jsonify({"error": "Endpoint not found"}), 404

# # # @app.errorhandler(500)
# # # def internal_error(error):
# # #     return jsonify({"error": "Internal server error"}), 500

# # # if __name__ == "__main__":
# # #     print("🚀 Starting Continuous 2FA Authentication System...")
# # #     print("📍 Server running on http://127.0.0.1:5000")
# # #     print("🔧 Debug endpoints:")
# # #     print("   - http://127.0.0.1:5000/api/health")
# # #     print("   - http://127.0.0.1:5000/api/auth/test") 
# # #     print("   - http://127.0.0.1:5000/api/trust/test")
# # #     print("   - http://127.0.0.1:5000/api/debug/endpoints")
    
# # #     app.run(host="0.0.0.0", port=5000, debug=True)

# # import os
# # import sys
# # from flask import Flask, send_from_directory, jsonify
# # from flask_cors import CORS

# # # Add the current directory to Python path
# # current_dir = os.path.dirname(os.path.abspath(__file__))
# # sys.path.insert(0, current_dir)

# # app = Flask(__name__)
# # CORS(app)

# # print("🔧 Starting application initialization...")

# # # Try to import configuration
# # try:
# #     from config import Config
# #     app.config.from_object(Config)
# #     print("✅ Configuration loaded successfully")
# # except ImportError as e:
# #     print(f"⚠️  Config import warning: {e}")
# #     app.config['SECRET_KEY'] = 'fallback-secret-key'

# # # Manual route registration to avoid import issues
# # @app.route("/api/health")
# # def health_check():
# #     return jsonify({"status": "healthy", "message": "Server is running"})

# # @app.route("/api/auth/test")
# # def auth_test():
# #     return jsonify({"message": "Auth test endpoint is working!"})

# # @app.route("/api/trust/test") 
# # def trust_test():
# #     return jsonify({"message": "Trust test endpoint is working!", "trust_score": 0.75})

# # @app.route("/api/debug/endpoints")
# # def debug_endpoints():
# #     endpoints = []
# #     for rule in app.url_map.iter_rules():
# #         if rule.endpoint != 'static':
# #             endpoints.append({
# #                 'endpoint': rule.endpoint,
# #                 'methods': list(rule.methods),
# #                 'path': str(rule)
# #             })
# #     return jsonify(endpoints)

# # # Try to import and register blueprints with better error handling
# # try:
# #     print("🔄 Attempting to import routes...")
    
# #     # Try different import styles
# #     try:
# #         from routes.auth import auth_bp
# #         app.register_blueprint(auth_bp, url_prefix="/api/auth")
# #         print("✅ Auth routes registered via 'routes.auth'")
# #     except ImportError as e:
# #         print(f"❌ routes.auth import failed: {e}")
# #         try:
# #             from backend.routes.auth import auth_bp
# #             app.register_blueprint(auth_bp, url_prefix="/api/auth")
# #             print("✅ Auth routes registered via 'backend.routes.auth'")
# #         except ImportError as e:
# #             print(f"❌ backend.routes.auth import failed: {e}")

# #     try:
# #         from routes.trust_router import trust_bp
# #         app.register_blueprint(trust_bp, url_prefix="/api/trust")
# #         print("✅ Trust routes registered via 'routes.trust_router'")
# #     except ImportError as e:
# #         print(f"❌ routes.trust_router import failed: {e}")
# #         try:
# #             from backend.routes.trust_router import trust_bp
# #             app.register_blueprint(trust_bp, url_prefix="/api/trust")
# #             print("✅ Trust routes registered via 'backend.routes.trust_router'")
# #         except ImportError as e:
# #             print(f"❌ backend.routes.trust_router import failed: {e}")

# # except Exception as e:
# #     print(f"❌ Route registration error: {e}")

# # # Serve frontend files
# # BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# # FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# # @app.route("/")
# # def serve_user():
# #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

# # @app.route("/login.html")
# # def serve_login():
# #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

# # @app.route("/admin")
# # def serve_admin():
# #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# # @app.route("/user/<path:filename>")
# # def serve_user_static(filename):
# #     return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

# # @app.route("/admin/<path:filename>")
# # def serve_admin_static(filename):
# #     return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

# # if __name__ == "__main__":
# #     print("🚀 Starting Continuous 2FA Authentication System...")
# #     print("📍 Server running on http://127.0.0.1:5000")
# #     print("🔧 Testing endpoints:")
# #     print("   - http://127.0.0.1:5000/api/health")
# #     print("   - http://127.0.0.1:5000/api/auth/test")
# #     print("   - http://127.0.0.1:5000/api/trust/test")
# #     print("   - http://127.0.0.1:5000/api/debug/endpoints")
    
# #     app.run(host="0.0.0.0", port=5000, debug=True)

# import os
# import sys
# from flask import Flask, send_from_directory, jsonify
# from flask_cors import CORS

# # Add the current directory to Python path
# current_dir = os.path.dirname(os.path.abspath(__file__))
# parent_dir = os.path.dirname(current_dir)
# sys.path.insert(0, parent_dir)
# sys.path.insert(0, current_dir)

# app = Flask(__name__)
# CORS(app)

# print("🔧 Starting application initialization...")
# print(f"📁 Current directory: {current_dir}")
# print(f"📁 Parent directory: {parent_dir}")

# # Basic configuration
# app.config['SECRET_KEY'] = 'fallback-secret-key-for-development'

# # Manual test endpoints that will always work
# @app.route("/api/health")
# def health_check():
#     return jsonify({"status": "healthy", "message": "Server is running"})

# @app.route("/api/auth/login", methods=["POST", "GET"])
# def manual_auth_login():
#     """Manual login endpoint that always works"""
#     return jsonify({
#         "success": True, 
#         "message": "Manual login endpoint working!",
#         "token": "manual-test-token",
#         "user_id": 1,
#         "username": "testuser"
#     })

# @app.route("/api/admin/users", methods=["GET"])
# def manual_admin_users():
#     return jsonify({"users": [], "message": "Manual admin users endpoint"})

# @app.route("/api/admin/decisions", methods=["GET"])
# def manual_admin_decisions():
#     return jsonify({"decisions": [], "message": "Manual admin decisions endpoint"})

# @app.route("/api/admin/stats", methods=["GET"])
# def manual_admin_stats():
#     return jsonify({"stats": {}, "message": "Manual admin stats endpoint"})

# @app.route("/api/trust/score", methods=["POST"])
# def manual_trust_score():
#     return jsonify({"trust_score": 0.85, "confidence": "high"})

# # Try to import and register blueprints
# try:
#     print("🔄 Attempting to import routes...")
    
#     # Try absolute imports first
#     try:
#         from backend.routes.auth import auth_bp
#         app.register_blueprint(auth_bp, url_prefix="/api/auth")
#         print("✅ Auth routes registered via 'backend.routes.auth'")
#     except ImportError as e:
#         print(f"❌ backend.routes.auth import failed: {e}")
#         try:
#             from routes.auth import auth_bp
#             app.register_blueprint(auth_bp, url_prefix="/api/auth")
#             print("✅ Auth routes registered via 'routes.auth'")
#         except ImportError as e:
#             print(f"❌ routes.auth import failed: {e}")

#     try:
#         from backend.routes.trust_router import trust_bp
#         app.register_blueprint(trust_bp, url_prefix="/api/trust")
#         print("✅ Trust routes registered via 'backend.routes.trust_router'")
#     except ImportError as e:
#         print(f"❌ backend.routes.trust_router import failed: {e}")
#         try:
#             from routes.trust_router import trust_bp
#             app.register_blueprint(trust_bp, url_prefix="/api/trust")
#             print("✅ Trust routes registered via 'routes.trust_router'")
#         except ImportError as e:
#             print(f"❌ routes.trust_router import failed: {e}")

#     try:
#         from backend.routes.admin_routes import admin_bp
#         app.register_blueprint(admin_bp, url_prefix="/api/admin")
#         print("✅ Admin routes registered via 'backend.routes.admin_routes'")
#     except ImportError as e:
#         print(f"❌ backend.routes.admin_routes import failed: {e}")
#         try:
#             from routes.admin_routes import admin_bp
#             app.register_blueprint(admin_bp, url_prefix="/api/admin")
#             print("✅ Admin routes registered via 'routes.admin_routes'")
#         except ImportError as e:
#             print(f"❌ routes.admin_routes import failed: {e}")

# except Exception as e:
#     print(f"❌ Route registration error: {e}")

# @app.route("/api/debug/endpoints")
# def debug_endpoints():
#     endpoints = []
#     for rule in app.url_map.iter_rules():
#         if rule.endpoint != 'static':
#             endpoints.append({
#                 'endpoint': rule.endpoint,
#                 'methods': list(rule.methods),
#                 'path': str(rule)
#             })
#     return jsonify(endpoints)

# # Serve frontend files
# @app.route("/")
# def serve_user():
#     frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
#     return send_from_directory(os.path.join(frontend_dir, "user"), "index.html")

# @app.route("/login.html")
# def serve_login():
#     frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
#     return send_from_directory(os.path.join(frontend_dir, "user"), "login.html")

# @app.route("/admin")
# def serve_admin():
#     frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
#     return send_from_directory(os.path.join(frontend_dir, "admin"), "index.html")

# @app.route("/<path:filename>")
# def serve_static(filename):
#     frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
#     # Try user directory first
#     try:
#         return send_from_directory(os.path.join(frontend_dir, "user"), filename)
#     except:
#         # Then try admin directory
#         try:
#             return send_from_directory(os.path.join(frontend_dir, "admin"), filename)
#         except:
#             return "File not found", 404

# if __name__ == "__main__":
#     print("🚀 Starting Continuous 2FA Authentication System...")
#     print("📍 Server running on http://127.0.0.1:5000")
#     print("🔧 Available endpoints:")
    
#     # Print available endpoints
#     for rule in app.url_map.iter_rules():
#         if rule.endpoint != 'static' and rule.rule.startswith('/api'):
#             print(f"   - {list(rule.methods)} {rule.rule}")
    
#     app.run(host="0.0.0.0", port=5000, debug=True)

import os
import sys
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

app = Flask(__name__)
CORS(app)

print("🔧 Starting application initialization...")
print(f"📁 Current directory: {current_dir}")

# Basic configuration
app.config['SECRET_KEY'] = 'your_super_secure_secret_key_here_make_it_very_long_and_random'

# Manual test endpoints that will always work
@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"})

@app.route("/api/auth/test", methods=["GET"])
def manual_auth_test():
    return jsonify({"message": "Auth test endpoint is working!"})

@app.route("/api/auth/login", methods=["POST"])
def manual_auth_login():
    """Manual login endpoint that always works"""
    return jsonify({
        "success": True, 
        "message": "Login successful!",
        "token": "test-jwt-token-12345",
        "user_id": 1,
        "username": "sample"
    })

@app.route("/api/admin/users", methods=["GET"])
def manual_admin_users():
    return jsonify({"users": [
        {"id": 1, "username": "sample", "status": "active"},
        {"id": 2, "username": "admin", "status": "active"}
    ]})

@app.route("/api/admin/decisions", methods=["GET"])
def manual_admin_decisions():
    return jsonify({"decisions": [
        {"id": 1, "user_id": 1, "trust_score": 0.85, "result": "ALLOW"}
    ]})

@app.route("/api/admin/stats", methods=["GET"])
def manual_admin_stats():
    return jsonify({
        "total_users": 2,
        "total_decisions": 5,
        "average_trust": 0.87
    })

@app.route("/api/trust/score", methods=["POST"])
def manual_trust_score():
    return jsonify({"trust_score": 0.85, "confidence": "high"})

@app.route("/api/trust/test", methods=["GET"])
def manual_trust_test():
    return jsonify({"message": "Trust test endpoint working!", "trust_score": 0.75})

# Serve frontend files with proper static handling
FRONTEND_DIR = os.path.join(parent_dir, "frontend")

@app.route("/")
def serve_user():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "index.html")

@app.route("/login.html")
def serve_login():
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), "login.html")

@app.route("/admin")
def serve_admin():
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), "index.html")

# Serve static files (CSS, JS, images)
@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

@app.route("/user/<path:filename>")
def serve_user_files(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "user"), filename)

@app.route("/admin/static/<path:filename>")
def serve_admin_static(filename):
    return send_from_directory(os.path.join(FRONTEND_DIR, "admin"), filename)

@app.route("/api/debug/endpoints")
def debug_endpoints():
    endpoints = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            endpoints.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods),
                'path': str(rule)
            })
    return jsonify(endpoints)

if __name__ == "__main__":
    print("🚀 Starting Continuous 2FA Authentication System...")
    print("📍 Server running on http://127.0.0.1:5000")
    print("🔧 Available endpoints:")
    
    # Print available endpoints
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static' and rule.rule.startswith('/api'):
            print(f"   - {list(rule.methods)} {rule.rule}")
    
    print("\n🌐 Frontend URLs:")
    print("   - User login: http://127.0.0.1:5000/")
    print("   - Admin panel: http://127.0.0.1:5000/admin")
    
    app.run(host="0.0.0.0", port=5000, debug=True)