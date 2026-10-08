export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <div className="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search tasks"
        />
      </div>

      <div className="filter-group">
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value })}
          aria-label="Filter by priority"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onChange({ sortBy, sortOrder });
          }}
          aria-label="Sort by"
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="priority-desc">Priority (high → low)</option>
          <option value="priority-asc">Priority (low → high)</option>
          <option value="dueDate-asc">Due date (soonest)</option>
          <option value="dueDate-desc">Due date (latest)</option>
          <option value="title-asc">Title (A–Z)</option>
        </select>
      </div>

      <style>{`
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .search-box svg {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-box input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .search-box input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .filter-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .filter-group select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
        }
        .filter-group select:focus {
          outline: none;
          border-color: var(--primary);
        }
        @media (max-width: 640px) {
          .filters {
            flex-direction: column;
          }
          .filter-group {
            width: 100%;
          }
          .filter-group select {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
