function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function statusLabel(status) {
  const map = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
  return map[status] || status;
}

export default function TaskDetails({ task, onEdit, onClose }) {
  if (!task) return null;

  return (
    <div className="task-details">
      <div className="detail-row">
        <span className="detail-label">Status</span>
        <span className={`badge badge-${task.status}`}>{statusLabel(task.status)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Priority</span>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Description</span>
        <p className="detail-value">{task.description}</p>
      </div>
      <div className="detail-row">
        <span className="detail-label">Due Date</span>
        <span className="detail-value">{task.dueDate ? formatDate(task.dueDate) : '—'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Created</span>
        <span className="detail-value">{formatDate(task.createdAt)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Updated</span>
        <span className="detail-value">{formatDate(task.updatedAt)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">ID</span>
        <span className="detail-value mono">{task.id}</span>
      </div>

      <div className="modal-footer" style={{ padding: '1.25rem 0 0', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={() => onEdit(task)}>
          Edit Task
        </button>
      </div>

      <style>{`
        .task-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .detail-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--text-muted);
        }
        .detail-value {
          font-size: 0.9375rem;
          color: var(--text-primary);
          white-space: pre-wrap;
        }
        .mono {
          font-family: ui-monospace, monospace;
          font-size: 0.8125rem;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
