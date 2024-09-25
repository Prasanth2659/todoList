const express = require('express');
const { addTask, getTasks } = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/tasks', authenticateToken, addTask);
router.get('/tasks', authenticateToken, getTasks);

module.exports = router;
