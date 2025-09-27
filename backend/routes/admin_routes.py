from flask import Blueprint, jsonify, request
from backend.utils.db import get_db
from backend.models.decision_model import get_all_decisions, get_decision_stats
from psycopg2.extras import RealDictCursor
from backend.middleware.auth import token_required 

admin_bp = Blueprint("admin", __name__)

# @admin_bp.route("/users", methods=["GET"])

# @token_required
# def get_users():
#     """Get all users"""
#     conn = get_db()
#     if not conn: return jsonify([])
    
#     cur = conn.cursor(cursor_factory=RealDictCursor)
#     try:
#         cur.execute("SELECT * FROM users ORDER BY created_at DESC")
#         rows = cur.fetchall()
#         return jsonify(rows)
#     except Exception as e:
#         print(f"❌ Error retrieving users: {e}")
#         return jsonify([])
#     finally:
#         cur.close()
#         conn.close()

@admin_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify({
        "users": [
            {"id": 1, "username": "sample", "status": "active"},
            {"id": 2, "username": "admin", "status": "active"}
        ]
    })

# @admin_bp.route("/decisions", methods=["GET"])
# def get_decisions():
#     """Get all decisions with user info"""
#     limit = request.args.get('limit', 50, type=int)
#     decisions = get_all_decisions(limit)
#     return jsonify(decisions)

@admin_bp.route("/decisions", methods=["GET"])
def get_decisions():
    return jsonify({
        "decisions": [
            {"id": 1, "user_id": 1, "trust_score": 0.85, "result": "ALLOW"},
            {"id": 2, "user_id": 2, "trust_score": 0.92, "result": "ALLOW"}
        ]
    })

# @admin_bp.route("/stats", methods=["GET"])
# def get_stats():
#     """Get overall decision statistics"""
#     stats = get_decision_stats()
#     return jsonify(stats)

@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "total_users": 2,
        "total_decisions": 10,
        "average_trust": 0.87
    })

@admin_bp.route("/debug-schema", methods=["GET"])
def debug_schema():
    """Debug endpoint to see the actual database schema"""
    conn = get_db()
    if not conn: return jsonify({"error": "Database connection failed"})
    
    cur = conn.cursor()
    try:
        # Get decisions table schema
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'decisions' 
            ORDER BY ordinal_position;
        """)
        decisions_columns = cur.fetchall()
        
        return jsonify({
            "decisions_table": [{"column": col[0], "type": col[1]} for col in decisions_columns]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cur.close()
        conn.close()
        
# Test endpoint
@admin_bp.route("/test", methods=["GET"])
def test_admin():
    return jsonify({"message": "Admin routes are working!"})