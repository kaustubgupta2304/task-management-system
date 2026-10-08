// Simple unique ID generator (avoids external uuid dependency if missing)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// In-memory storage
let tasks = [];

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Get all tasks with optional filters, search, sort, and pagination
 */
const getAllTasks = ({ search, status, priority, sortBy, sortOrder, page, limit } = {}) => {
  let result = [...tasks];

  // Search by title or description
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
    );
  }

  // Filter by status
  if (status && VALID_STATUSES.includes(status)) {
    result = result.filter((t) => t.status === status);
  }

  // Filter by priority
  if (priority && VALID_PRIORITIES.includes(priority)) {
    result = result.filter((t) => t.priority === priority);
  }

  // Sort
  const order = sortOrder === 'desc' ? -1 : 1;
  const sortField = sortBy || 'createdAt';

  result.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      valA = priorityOrder[a.priority] || 0;
      valB = priorityOrder[b.priority] || 0;
    } else if (sortField === 'dueDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return -1 * order;
    if (valA > valB) return 1 * order;
    return 0;
  });

  const total = result.length;

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const start = (pageNum - 1) * limitNum;
  const paginated = result.slice(start, start + limitNum);

  return {
    tasks: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Get a single task by ID
 */
const getTaskById = (id) => {
  return tasks.find((t) => t.id === id) || null;
};

/**
 * Create a new task
 */
const createTask = (data) => {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
};

/**
 * Update an existing task
 */
const updateTask = (id, data) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = tasks[index];
  const updated = {
    ...existing,
    title: data.title !== undefined ? data.title.trim() : existing.title,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    status: data.status !== undefined ? data.status : existing.status,
    priority: data.priority !== undefined ? data.priority : existing.priority,
    dueDate: data.dueDate !== undefined ? data.dueDate : existing.dueDate,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  return updated;
};

/**
 * Delete a task
 */
const deleteTask = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};

/**
 * Seed some sample tasks (optional, for demo)
 */
const seedSampleTasks = () => {
  if (tasks.length > 0) return;
  const samples = [
    {
      title: 'Complete assignment',
      description: 'Build the full-stack task manager with React and Express',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-10-10',
    },
    {
      title: 'Write documentation',
      description: 'Add README and API docs for the project',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-10-12',
    },
    {
      title: 'Add dark mode',
      description: 'Implement theme toggle for better UX',
      status: 'pending',
      priority: 'low',
      dueDate: '2026-10-15',
    },
  ];
  samples.forEach((s) => createTask(s));
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  seedSampleTasks,
  VALID_STATUSES,
  VALID_PRIORITIES,
};
