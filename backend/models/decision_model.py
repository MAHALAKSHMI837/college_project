# # from backend.utils.db import get_db
# # import datetime


# # def get_decisions_for_user(user_id):
# #     conn = get_db()
# #     cur = conn.cursor()
# #     cur.execute("SELECT id, trust_score, result, note, created_at FROM decisions WHERE user_id = %s ORDER BY created_at DESC LIMIT 20", (user_id,))
# #     rows = cur.fetchall()
# #     cur.close()
# #     conn.close()
# #     return [
# #         {"id": r[0], "trust": float(r[1]), "result": r[2], "note": r[3], "timestamp": r[4].isoformat()}
# #         for r in rows
# #     ]

# # def log_decision(user_id, trust, result, note=""):
# #     conn = get_db()
# #     cur = conn.cursor()
# #     cur.execute("""
# #         INSERT INTO decisions (user_id, timestamp, trust, result, note)
# #         VALUES (?, ?, ?, ?, ?)
# #     """, (user_id, datetime.datetime.now().isoformat(), trust, result, note))
# #     conn.commit()
# #     conn.close()

# # def get_recent_decisions(limit=20):
# #     conn = get_db()
# #     rows = conn.execute(
# #         "SELECT * FROM decisions ORDER BY timestamp DESC LIMIT ?", (limit,)
# #     ).fetchall()
# #     conn.close()
# #     return [dict(r) for r in rows]

# # def get_user_decisions(user_id, limit=20):
# #     conn = get_db()
# #     rows = conn.execute(
# #         "SELECT * FROM decisions WHERE user_id=? ORDER BY timestamp DESC LIMIT ?",
# #         (user_id, limit)
# #     ).fetchall()
# #     conn.close()
# #     return [dict(r) for r in rows]

# from backend.models.db import get_db

# # Fetch decisions for a given user
# def get_decisions_for_user(user_id):
#     conn = get_db()
#     if not conn:
#         return []   # fail gracefully if DB is down

#     cur = conn.cursor()
#     cur.execute(
#         "SELECT id, trust_score, result, note, created_at "
#         "FROM decisions WHERE user_id = %s "
#         "ORDER BY created_at DESC LIMIT 20",
#         (user_id,)
#     )
#     rows = cur.fetchall()
#     cur.close()
#     conn.close()

#     return [
#         {
#             "id": r[0],
#             "trust": float(r[1]),
#             "result": r[2],
#             "note": r[3],
#             "timestamp": r[4].isoformat()
#         }
#         for r in rows
#     ]

# # Insert a new decision
# def create_decision(user_id, trust_score, result, note=""):
#     conn = get_db()
#     if not conn:
#         return False

#     cur = conn.cursor()
#     cur.execute(
#         "INSERT INTO decisions (user_id, trust_score, result, note) VALUES (%s, %s, %s, %s)",
#         (user_id, trust_score, result, note)
#     )
#     conn.commit()
#     cur.close()
#     conn.close()
#     return True
# # Fetch recent decisions across all users


from backend.utils.db import get_db

# Save a new decision to the database
def save_decision(user_id, trust, result, note=""):
    conn = get_db()
    if not conn:
        return None
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO decisions (user_id, trust, result, note, timestamp)
            VALUES (%s, %s, %s, %s, NOW())
            RETURNING id;
            """,
            (user_id, trust, result, note),
        )
        conn.commit()
        decision_id = cur.fetchone()[0]
        return decision_id
    finally:
        conn.close()
        cur.close()

# Fetch recent decisions across all users
def get_all_decisions(limit=50):
    """
    Get all recent decisions across all users
    
    Args:
        limit (int): Maximum number of decisions to return
    
    Returns:
        list: List of decision dictionaries with user information
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return []
    
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT d.id, u.id as user_id, u.username, d.trust, d.result, d.note, d.timestamp
            FROM decisions d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.timestamp DESC
            LIMIT %s
        """, (limit,))
        
        rows = cur.fetchall()
        decisions = []
        for row in rows:
            decisions.append({
                "id": row[0],
                "user_id": row[1],
                "username": row[2],
                "trust": float(row[3]),
                "result": row[4],
                "note": row[5] or "",
                "timestamp": row[6]
            })
        print(f"✅ Retrieved {len(decisions)} decisions")
        return decisions
    except Exception as e:
        print(f"❌ Error retrieving all decisions: {e}")
        return []
    finally:
        cur.close()
        conn.close()

# Get statistics about decisions
def get_decision_stats(user_id=None):
    """
    Get statistics about decisions
    
    Args:
        user_id (int, optional): If provided, get stats for specific user
    
    Returns:
        dict: Statistics about decisions
    """
    conn = get_db()
    if not conn: 
        print("❌ Database connection failed")
        return {}
    
    cur = conn.cursor()
    try:
        if user_id:
            # Get stats for specific user
            cur.execute("""
                SELECT 
                    COUNT(*) as total_decisions,
                    AVG(trust) as avg_trust,
                    SUM(CASE WHEN result = 'ALLOW' THEN 1 ELSE 0 END) as allow_count,
                    SUM(CASE WHEN result = 'CHALLENGE' THEN 1 ELSE 0 END) as challenge_count,
                    SUM(CASE WHEN result = 'BLOCK' THEN 1 ELSE 0 END) as block_count
                FROM decisions 
                WHERE user_id = %s
            """, (user_id,))
        else:
            # Get overall stats
            cur.execute("""
                SELECT 
                    COUNT(*) as total_decisions,
                    AVG(trust) as avg_trust,
                    SUM(CASE WHEN result = 'ALLOW' THEN 1 ELSE 0 END) as allow_count,
                    SUM(CASE WHEN result = 'CHALLENGE' THEN 1 ELSE 0 END) as challenge_count,
                    SUM(CASE WHEN result = 'BLOCK' THEN 1 ELSE 0 END) as block_count
                FROM decisions
            """)
        
        row = cur.fetchone()
        stats = {
            "total_decisions": row[0] or 0,
            "avg_trust": float(row[1] or 0) if row[1] is not None else 0,
            "allow_count": row[2] or 0,
            "challenge_count": row[3] or 0,
            "block_count": row[4] or 0
        }
        
        print(f"✅ Retrieved decision statistics")
        return stats
    except Exception as e:
        print(f"❌ Error retrieving decision stats: {e}")
        return {}
    finally:
        cur.close()
        conn.close()