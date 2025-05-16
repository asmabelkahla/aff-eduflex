const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tracking.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    grade REAL
  )`);
});

module.exports = db;
