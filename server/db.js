const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "comments.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

const insertComment = db.prepare(
    "INSERT INTO comments (name, message) VALUES (?, ?)"
);

const getComments = db.prepare(
    "SELECT id, name, message, created_at FROM comments ORDER BY created_at DESC LIMIT 200"
);

module.exports = { insertComment, getComments };
