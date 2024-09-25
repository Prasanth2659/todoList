const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = "your_secret_key"; // Change this to a secure secret key.

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./todo.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            userId TEXT,
            title TEXT,
            status TEXT,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);
    }
});

// Register User
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const id = uuidv4();

    db.run(`INSERT INTO users (id, username, password) VALUES (?, ?, ?)`, [id, username, hashedPassword], function (err) {
        if (err) {
            return res.status(500).send("User registration failed.");
        }
        res.status(201).send({ id, username });
    });
});

// Login User
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(404).send("User not found.");
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send("Invalid password.");

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send("No token provided.");

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send("Failed to authenticate token.");
        req.userId = decoded.id;
        next();
    });
}

// Create a task
app.post('/api/tasks', verifyToken, (req, res) => {
    const { title } = req.body;
    const id = uuidv4();
    const userId = req.userId;

    db.run(`INSERT INTO tasks (id, userId, title, status) VALUES (?, ?, ?, ?)`, [id, userId, title, 'pending'], function (err) {
        if (err) return res.status(500).send("Task creation failed.");
        res.status(201).send({ id, title, status: 'pending' });
    });
});

// Get tasks
app.get('/api/tasks', verifyToken, (req, res) => {
    const userId = req.userId;

    db.all(`SELECT * FROM tasks WHERE userId = ?`, [userId], (err, tasks) => {
        if (err) return res.status(500).send("Failed to retrieve tasks.");
        res.status(200).send(tasks);
    });
});

// Update task status
app.put('/api/tasks/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    const taskId = req.params.id;

    db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [status, taskId], function (err) {
        if (err) return res.status(500).send("Failed to update task.");
        res.status(200).send("Task updated successfully.");
    });
});

// Delete task
app.delete('/api/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;

    db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], function (err) {
        if (err) return res.status(500).send("Failed to delete task.");
        res.status(200).send("Task deleted successfully.");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
