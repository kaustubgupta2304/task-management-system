import { useState } from 'react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import Modal from './components/Modal';
import Pagination from './components/Pagination';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const {
    tasks,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  } = useTasks();

  const [modal, setModal] = useState({ type: null, task: null }); // type: 'create' | 'edit' | 'view' | 'delete'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const openCreate = () => {
    setFormError(null);
    setModal({ type: 'create', task: null });
  };

  const openEdit = (task) => {
    setFormError(null);
    setModal({ type: 'edit', task });
  };

  const openView = (task) => setModal({ type: 'view', task });

  const openDelete = (task) => setModal({ type: 'delete', task });

  const closeModal = () => {
    setModal({ type: null, task: null });
    setFormError(null);
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await createTask(data);
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await updateTask(modal.task.id, data);
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteTask(modal.task.id);
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="container main">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Manage your tasks efficiently</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Task
          </button>
        </div>

        <TaskFilters filters={filters} onChange={updateFilters} />

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button className="btn btn-sm btn-secondary" onClick={refetch}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
            <h3>No tasks found</h3>
            <p>
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters or search query.'
                : 'Create your first task to get started.'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openCreate}>
                Create Task
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={openView}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              ))}
            </div>
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updateFilters({ page })}
            />
          </>
        )}
      </main>

      {/* Create Modal */}
      <Modal open={modal.type === 'create'} onClose={closeModal} title="Create Task">
        {formError && <div className="error-banner">{formError}</div>}
        <TaskForm onSubmit={handleCreate} onCancel={closeModal} loading={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Task">
        {formError && <div className="error-banner">{formError}</div>}
        <TaskForm
          initialData={modal.task}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          loading={submitting}
        />
      </Modal>

      {/* View Modal */}
      <Modal open={modal.type === 'view'} onClose={closeModal} title={modal.task?.title || 'Task Details'}>
        <TaskDetails
          task={modal.task}
          onEdit={(t) => openEdit(t)}
          onClose={closeModal}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={modal.type === 'delete'} onClose={closeModal} title="Delete Task">
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Are you sure you want to delete <strong>{modal.task?.title}</strong>? This action cannot be undone.
        </p>
        {formError && <div className="error-banner">{formError}</div>}
        <div className="modal-footer" style={{ padding: 0, border: 'none' }}>
          <button className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      <style>{`
        .main {
          padding-top: 1.5rem;
          padding-bottom: 3rem;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }
        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
          }
          .page-header .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
