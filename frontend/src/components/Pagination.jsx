export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="page-info">
        {total} task{total !== 1 ? 's' : ''}
      </span>
      <div className="page-controls">
        <button
          className="btn btn-secondary btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          Prev
        </button>
        {start > 1 && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => onPageChange(1)}>
              1
            </button>
            {start > 2 && <span className="ellipsis">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="ellipsis">…</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        <button
          className="btn btn-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
      <style>{`
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .page-info {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .page-controls {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .ellipsis {
          padding: 0 0.25rem;
          color: var(--text-muted);
        }
      `}</style>
    </nav>
  );
}
