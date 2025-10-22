"""
Routes package for API endpoints
"""

# Import blueprints with error handling
try:
    from .auth_routes import auth_bp
except ImportError as e:
    print(f"Warning: Could not import auth_routes: {e}")
    auth_bp = None

try:
    from .trust_routes import trust_bp
except ImportError as e:
    print(f"Warning: Could not import trust_routes: {e}")
    trust_bp = None

try:
    from .admin_routes import admin_bp
except ImportError as e:
    print(f"Warning: Could not import admin_routes: {e}")
    admin_bp = None

try:
    from .user_routes import user_bp
except ImportError as e:
    print(f"Warning: Could not import user_routes: {e}")
    user_bp = None

__all__ = ['auth_bp', 'trust_bp', 'admin_bp', 'user_bp']