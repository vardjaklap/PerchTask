import express from 'express';
import sequelize from '../database';
import Task from '../database/models/task.model';

const router = express.Router();


//Get ALL tasks
router.get('/', async (req, res) => {
    const tasks = await sequelize.models.Task.findAll();

    res.json(
        tasks,
    );
});

//Create a task
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        res.status(400).json({ message: 'Title is required for a new task.' });
        return;
    }

    const task = new Task({ title: title, description: description, completed: false });

    await task.save();
    res.status(201).json(task);

});

//Update the task
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed value is invalid.' });
    }

    const task = await Task.findOne({ where: { id: id } });

    if (!task) {
        
        return res.status(404).json({ message: 'Task not found' }).send();
    }

    task.title = title;
    task.description = description;
    task.completed = completed;
    await task.save();

    res.status(200).json(task);


});

//delete the task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id: id } });

    if (!task) {
        
        return res.status(404).json({ message: 'Task not found' }).send();
    }
    await task.destroy();

    res.status(204).send(); // No content to send back


});
export default router;
