import sqlite3
from datetime import datetime

DB_PATH = "/Users/bobvarkey/.openclaw/workspace/memory_test.db"

def setup_db(path):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS bookmarks (id TEXT PRIMARY KEY, date TEXT, author TEXT, text TEXT, url TEXT, tags TEXT, engagement INTEGER)")
    conn.commit()
    return conn

def insert_sample(conn):
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO bookmarks (id, date, author, text, url, tags, engagement) VALUES (?,?,?,?,?,?,?)",
                ("sample-001", datetime.now().isoformat(), "AuthorX", "Sample tweet content for testing", "https://twitter.com/example", "test,ai", 42))
    conn.commit()

if __name__ == "__main__":
    conn = setup_db(DB_PATH)
    insert_sample(conn)
    print("Test run complete. Sample bookmark inserted into memory test DB at", DB_PATH)
    conn.close()
