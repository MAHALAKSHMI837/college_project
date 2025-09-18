# from backend.utils.db import get_db
# import datetime


# def get_decisions_for_user(user_id):
#     conn = get_db()
#     cur = conn.cursor()
#     cur.execute("SELECT id, trust_score, result, note, created_at FROM decisions WHERE user_id = %s ORDER BY created_at DESC LIMIT 20", (user_id,))
#     rows = cur.fetchall()
#     cur.close()
#     conn.close()
#     return [
#         {"id": r[0], "trust": float(r[1]), "result": r[2], "note": r[3], "timestamp": r[4].isoformat()}
#         for r in rows
#     ]

# def log_decision(user_id, trust, result, note=""):
#     conn = get_db()
#     cur = conn.cursor()
#     cur.execute("""
#         INSERT INTO decisions (user_id, timestamp, trust, result, note)
#         VALUES (?, ?, ?, ?, ?)
#     """, (user_id, datetime.datetime.now().isoformat(), trust, result, note))
#     conn.commit()
#     conn.close()

# def get_recent_decisions(limit=20):
#     conn = get_db()
#     rows = conn.execute(
#         "SELECT * FROM decisions ORDER BY timestamp DESC LIMIT ?", (limit,)
#     ).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]

# def get_user_decisions(user_id, limit=20):
#     conn = get_db()
#     rows = conn.execute(
#         "SELECT * FROM decisions WHERE user_id=? ORDER BY timestamp DESC LIMIT ?",
#         (user_id, limit)
#     ).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]

from backend.models.db import get_db

# Fetch decisions for a given user
def get_decisions_for_user(user_id):
    conn = get_db()
    if not conn:
        return []   # fail gracefully if DB is down

    cur = conn.cursor()
    cur.execute(
        "SELECT id, trust_score, result, note, created_at "
        "FROM decisions WHERE user_id = %s "
        "ORDER BY created_at DESC LIMIT 20",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "id": r[0],
            "trust": float(r[1]),
            "result": r[2],
            "note": r[3],
            "timestamp": r[4].isoformat()
        }
        for r in rows
    ]

# Insert a new decision
def create_decision(user_id, trust_score, result, note=""):
    conn = get_db()
    if not conn:
        return False

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO decisions (user_id, trust_score, result, note) VALUES (%s, %s, %s, %s)",
        (user_id, trust_score, result, note)
    )
    conn.commit()
    cur.close()
    conn.close()
    return True
# Fetch recent decisions across all users
