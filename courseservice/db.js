const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./courses.db');

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS validated_courses (
        user_id INTEGER,
        course_id INTEGER
      )`);
      
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prerequisites (
    course_id INTEGER,
    prerequisite_id INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS enrollments (
    user_id INTEGER,
    course_id INTEGER
  )`);
  db.run(`INSERT INTO courses (name, description) VALUES (?, ?)`, ["JavaScript", "Langage de programmation web"]);

});

module.exports = db;
