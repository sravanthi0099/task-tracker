const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  return null;
};

// @route  GET /api/tasks
// @desc   Get all tasks for current user with filtering & sorting
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const sortOptions = {};
    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));

    // Stats for dashboard
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { todo: 0, 'in-progress': 0, completed: 0 };
    stats.forEach((s) => { statsMap[s._id] = s.count; });

    res.json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: statsMap,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

// @route  POST /api/tasks
// @desc   Create a new task
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
      const { title, description, status, priority, dueDate, tags } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
        user: req.user._id,
      });

      res.status(201).json({ message: 'Task created', task });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Failed to create task.' });
    }
  }
);

// @route  GET /api/tasks/:id
// @desc   Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Task not found.' });
    res.status(500).json({ message: 'Failed to fetch task.' });
  }
});

// @route  PUT /api/tasks/:id
// @desc   Update a task
router.put(
  '/:id',
  [
    body('title').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  ],
  async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    try {
      const { title, description, status, priority, dueDate, tags } = req.body;
      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate || null;
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [];

      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!task) return res.status(404).json({ message: 'Task not found.' });
      res.json({ message: 'Task updated', task });
    } catch (error) {
      if (error.name === 'CastError') return res.status(404).json({ message: 'Task not found.' });
      res.status(500).json({ message: 'Failed to update task.' });
    }
  }
);

// @route  DELETE /api/tasks/:id
// @desc   Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Task not found.' });
    res.status(500).json({ message: 'Failed to delete task.' });
  }
});

// @route  PATCH /api/tasks/:id/status
// @desc   Quick status update
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Status updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

module.exports = router;
