const taskService = require('../services/task.service');
const { VALID_STATUSES, VALID_PRIORITIES } = taskService;

/**
 * Validate task payload
 */
const validateTaskPayload = (body, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('Title is required and must be a non-empty string');
    }
  }

  if (!isUpdate || body.description !== undefined) {
    if (!body.description || typeof body.description !== 'string' || !body.description.trim()) {
      errors.push('Description is required and must be a non-empty string');
    }
  }

  if (body.status !== undefined && body.status !== null) {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  if (body.priority !== undefined && body.priority !== null) {
    if (!VALID_PRIORITIES.includes(body.priority)) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
  }

  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== '') {
    const date = new Date(body.dueDate);
    if (isNaN(date.getTime())) {
      errors.push('dueDate must be a valid date (YYYY-MM-DD or ISO format)');
    }
  }

  return errors;
};

/**
 * GET /api/tasks
 */
const getTasks = (req, res, next) => {
  try {
    const { search, status, priority, sortBy, sortOrder, page, limit } = req.query;
    const result = taskService.getAllTasks({
      search,
      status,
      priority,
      sortBy,
      sortOrder,
      page,
      limit,
    });
    res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:id
 */
const getTask = (req, res, next) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tasks
 */
const createTask = (req, res, next) => {
  try {
    const errors = validateTaskPayload(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const task = taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id
 */
const updateTask = (req, res, next) => {
  try {
    const existing = taskService.getTaskById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const errors = validateTaskPayload(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const task = taskService.updateTask(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = (req, res, next) => {
  try {
    const deleted = taskService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
