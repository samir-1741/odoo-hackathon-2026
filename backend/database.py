import sqlite3

DATABASE = 'hackathon.db'

def get_db_connection():
    """Connect to the database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Returns dict-like rows
    return conn

def init_db():
    """Create tables if they don't exist"""
    conn = get_db_connection()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS items (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            description TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT    NOT NULL UNIQUE,
            email      TEXT    NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized!")
