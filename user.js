const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todoapp.db');

const createUser = (id, username, password) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (id, username, password) VALUES (?, ?, ?)`, [id, username, password], function(err) {
            if (err) reject(err);
            resolve(this.lastID);
        });
    });
};

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

module.exports = { createUser, findUserByUsername };
