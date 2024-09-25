import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { 'x-access-token': token },
            });
            setTasks(response.data);
        };
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/tasks', { title: newTask }, {
            headers: { 'x-access-token': token },
        });
        setNewTask('');
        // Refresh the task list
        const response = await axios.get('http://localhost:5000/api/tasks', {
            headers: { 'x-access-token': token },
        });
        setTasks(response.data);
    };

    const handleUpdateTask = async (id, status) => {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, {
            headers: { 'x-access-token': token },
        });
        // Refresh the task list
           const response = await axios.get('http://localhost:5000/api/tasks', {
               headers: { 'x-access-token': token },
           });
           setTasks(response.data);
       };

       const handleDeleteTask = async (id) => {
           const token = localStorage.getItem('token');
           await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
               headers: { 'x-access-token': token },
           });
           // Refresh the task list
           const response = await axios.get('http://localhost:5000/api/tasks', {
               headers: { 'x-access-token': token },
           });
           setTasks(response.data);
       };

       return (
           <div>
               <h2>Todo List</h2>
               <input
                   type="text"
                   placeholder="New Task"
                   value={newTask}
                   onChange={(e) => setNewTask(e.target.value)}
               />
               <button onClick={handleAddTask}>Add Task</button>
               <ul>
                   {tasks.map(task => (
                       <li key={task.id}>
                           <span>{task.title} - {task.status}</span>
                           <button onClick={() => handleUpdateTask(task.id, task.status === 'completed' ? 'pending' : 'completed')}>
                               Mark as {task.status === 'completed' ? 'Pending' : 'Completed'}
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                       </li>
                   ))}
               </ul>
           </div>
       );
   };

   export default Todo;

