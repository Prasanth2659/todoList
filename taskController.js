const { v4: uuidv4 } = require('uuid');
const { createTask, getTasksByUserId } = require('../models/task');

const addTask = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.userId;
    const taskId = uuidv4();

    try {
        await createTask(taskId, userId, title, false);
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Task creation failed' });
    }
};

const getTasks = async (req, res) => {
    const userId = req.user.userId;

    try {
        const tasks = await getTasksByUserId(userId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

module.exports = { addTask, getTasks };
