import Database from 'better-sqlite3'

const db = new Database('minisoniclight.db')

db.pragma('foreign_keys = ON')

// Create table users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user'
  )
`)

// Create table drawings. If user is deleted, drawings are automatically deleted too
db.exec(`
  CREATE TABLE IF NOT EXISTS drawings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  )
`)

// Create the admin account if it does not already exist.
const admin = db
  .prepare('SELECT id FROM users WHERE username = ?')
  .get('SuperSecretAdmin')

if (!admin) {
  db.prepare(`
    INSERT INTO users (username, role)
    VALUES (?, ?)
  `).run('SuperSecretAdmin', 'admin')
}

export default db