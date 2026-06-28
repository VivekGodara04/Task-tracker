import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Plus, CheckSquare, RefreshCw } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Filters from './components/Filters';
import Stats from './components/Stats';
import EmptyState from './components/EmptyState';

function App() {
  const { tasks, loading, error, filters, setFilters, createTask, updateTask, deleteTask, updateStatus, refetch } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', search: '', sort: 'newest' });
  };

  const isFiltered = filters.status || filters.priority || filters.search;

  const openEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    if (editTask) return updateTask(editTask._id, data);
    return createTask(data);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTask(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <CheckSquare size={26} className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <main className="main">
        <div className="page-title-row">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">Stay on top of what matters most.</p>
          </div>
          <button className="icon-btn refresh-btn" onClick={refetch} title="Refresh">
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </div>

        <Stats tasks={tasks} />
        <Filters filters={filters} onChange={handleFilterChange} total={tasks.length} />

        {error && (
          <div className="error-banner">
            {error}&nbsp;
            <button onClick={refetch} className="retry-btn">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="task-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState filtered={isFiltered} onClear={clearFilters} />
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm task={editTask} onSubmit={handleFormSubmit} onClose={closeForm} />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1e1e2e', color: '#cdd6f4', border: '1px solid #313244' },
          success: { iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' } },
          error: { iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' } },
        }}
      />
    </div>
  );
}

export default App;
