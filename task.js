const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todoapp.db');

const createTask = (id, user_id, title, completed) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO tasks (id, user_id, title, completed) VALUES (?, ?, ?, ?)`, [id, user_id, title, completed], function(err) {
            if (err) reject(err);
            resolve(this.lastID);
        });
    });
};

const getTasksByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tasks WHERE user_id = ?`, [user_id], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = { createTask, getTasksByUserId };
