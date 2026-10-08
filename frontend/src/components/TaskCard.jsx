function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function statusLabel(status) {
  const map = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
  return map[status] || status;
}

export default function TaskCard({ task, onView, onEdit, onDelete }) {
  return (
    <article className="task-card card">
      <div className="task-card-header">
        <h3 className="task-title" onClick={() => onView(task)} title={task.title}>
          {task.title}
        </h3>
        <div className="task-badges">
          <span className={`badge badge-${task.status}`}>{statusLabel(task.status)}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      <p className="task-desc">{task.description}</p>

      <div className="task-meta">
        <span title="Created">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {formatDate(task.createdAt)}
        </span>
        {task.dueDate && (
          <span title="Due date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Due {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onView(task)} title="View">
          View
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)} title="Edit">
          Edit
        </button>
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => onDelete(task)} title="Delete">
          Delete
        </button>
      </div>

      <style>{`
        .task-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .task-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .task-title {
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .task-title:hover {
          color: var(--primary);
        }
        .task-badges {
          display: flex;
          gap: 0.375rem;
          flex-shrink: 0;
        }
        .task-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .task-meta span {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .task-actions {
          display: flex;
          gap: 0.25rem;
          border-top: 1px solid var(--border);
          padding-top: 0.75rem;
          margin-top: auto;
        }
      `}</style>
    </article>
  );
}
