# from flask import Blueprint, request, jsonify
# from backend.utils.db import get_db

# admin_bp = Blueprint("admin", __name__)

# # List all users
# @admin_bp.route("/users", methods=["GET"])
# def list_users():
#     conn = get_db()
#     users = conn.execute("SELECT * FROM users").fetchall()
#     conn.close()
#     return jsonify([dict(u) for u in users])

# # Add new user
# @admin_bp.route("/users", methods=["POST"])
# def add_user():
#     data = request.json
#     conn = get_db()
#     conn.execute("INSERT INTO users (username, device, min_trust, proximity_limit) VALUES (?,?,?,?)",
#                  (data["username"], data["device"], data.get("min_trust", 0.65), data.get("proximity_limit", 3.0)))
#     conn.commit()
#     conn.close()
#     return jsonify({"status": "success"}), 201

# # View all decisions
# @admin_bp.route("/decisions", methods=["GET"])
# def all_decisions():
#     conn = get_db()
#     rows = conn.execute("SELECT * FROM decisions ORDER BY timestamp DESC LIMIT 50").fetchall()
#     conn.close()
#     return jsonify([dict(r) for r in rows])
# # from flask import Blueprint, jsonify

# # admin_bp = Blueprint("admin", __name__)

# # # Fake users list
# # @admin_bp.route("/users", methods=["GET"])
# # def get_users():
# #     return jsonify([
# #         {"id": 1, "username": "maha-user", "device": "EEC-CSE-LAP-29"},
# #         {"id": 2, "username": "test-user", "device": "EEC-CSE-LAP-15"}
# #     ])

# # # Fake decisions list
# # @admin_bp.route("/decisions", methods=["GET"])
# # def get_decisions():
# #     return jsonify([
# #         {"user_id": 1, "decision": "ALLOW", "trust_score": 0.92, "timestamp": "2025-09-16T13:30:00"},
# #         {"user_id": 2, "decision": "DENY", "trust_score": 0.41, "timestamp": "2025-09-16T13:31:00"}
# #     ])
# from flask import Blueprint, request, jsonify
# from backend.utils.db import get_db   # <-- make sure backend/db.py exists

# admin_bp = Blueprint("admin", __name__)

# # ---------------- USERS ----------------
# @admin_bp.route("/users", methods=["GET"])
# def list_users():
#     try:
#         conn = get_db()
#         cur = conn.cursor()
#         cur.execute("SELECT id, username, device FROM users")
#         rows = cur.fetchall()
#         users = [{"id": r[0], "username": r[1], "device": r[2]} for r in rows]
#         return jsonify(users)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @admin_bp.route("/users", methods=["POST"])
# def add_user():
#     data = request.get_json(force=True)

#     # validate input
#     if not data or "username" not in data or "device" not in data:
#         return jsonify({"error": "username and device are required"}), 400

#     try:
#         conn = get_db()
#         cur = conn.cursor()
#         cur.execute("INSERT INTO users (username, device) VALUES (?, ?)",
#                     (data["username"], data["device"]))
#         conn.commit()
#         return jsonify({"message": "User added successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # ---------------- DECISIONS ----------------
# @admin_bp.route("/decisions", methods=["GET"])
# def list_decisions():
#     try:
#         conn = get_db()
#         cur = conn.cursor()
#         cur.execute("SELECT user_id, decision, trust_score, timestamp FROM decisions")
#         rows = cur.fetchall()
#         decisions = [
#             {"user_id": r[0], "decision": r[1], "trust_score": r[2], "timestamp": r[3]}
#             for r in rows
#         ]
#         return jsonify(decisions)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @admin_bp.route("/user", methods=["GET"])
# def get_users():
#     conn = get_db()
#     if not conn:
#         return jsonify({"error": "DB connection failed"}), 500
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)
#         cur.execute("SELECT * FROM users ORDER BY created_at DESC;")
#         rows = cur.fetchall()
#         return jsonify(rows)
#     finally:
#         conn.close()

# @admin_bp.route("/decisions", methods=["GET"])
# def get_decisions():
#     conn = get_db()
#     if not conn:
#         return jsonify({"error": "DB connection failed"}), 500
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)
#         cur.execute("""
#             SELECT d.id,
#                    u.username,
#                    d.trust_score,       -- correct column name
#                    d.result,
#                    d.note,
#                    d.created_at         -- correct column name
#             FROM decisions d
#             JOIN users u ON d.user_id = u.id
#             ORDER BY d.created_at DESC;
#         """)
#         rows = cur.fetchall()
#         return jsonify(rows)
#     finally:
#         conn.close()

from flask import Blueprint, jsonify, request
from backend.utils.db import get_db
from backend.models.decision_model import get_all_decisions, get_decision_stats
from psycopg2.extras import RealDictCursor

admin_bp = Blueprint("admin", __name__)

# List all users
@admin_bp.route("/users", methods=["GET"])
def get_users():
    """Get all users"""
    conn = get_db()
    if not conn: return jsonify([])
    
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT * FROM users ORDER BY created_at DESC")
        rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(f"❌ Error retrieving users: {e}")
        return jsonify([])
    finally:
        cur.close()
        conn.close()

# List all decisions
@admin_bp.route("/decisions", methods=["GET"])
def get_decisions():
    """Get all decisions with user info"""
    limit = request.args.get('limit', 50, type=int)
    decisions = get_all_decisions(limit)
    return jsonify(decisions)

# Get decision statistics
@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    """Get overall decision statistics"""
    stats = get_decision_stats()
    return jsonify(stats)

