const Task = require('../models/Task');

// GET /api/tasks — list all tasks (with optional filters)
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'due-asc': { dueDate: 1 },
      'due-desc': { dueDate: -1 },
      priority: { priority: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortBy);

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/tasks/:id — single task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/tasks — create task
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({ title, description, status, priority, dueDate });

    res.status(201).json({ success: true, task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PUT /api/tasks/:id — update task
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (err.kind === 'ObjectId')
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/tasks/:id — delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PATCH /api/tasks/:id/status — quick status update
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateStatus };
