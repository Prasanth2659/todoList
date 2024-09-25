const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'todolistweb.db');

// Open the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create Users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Create Todos table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'in progress', 'done', 'completed')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log('Users and Todos tables created (if they did not already exist).');
});

module.exports = db;
