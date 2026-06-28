import { useState } from 'react';
import { Pencil, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };
const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && task.status !== 'done';
  const isDueToday = dueDate && isToday(dueDate);

  const handleStatusSelect = (status) => {
    onStatusChange(task._id, status);
    setStatusOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      <div className="card-top">
        <div className="badges">
          <span className={`badge priority-badge priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          {dueDate && (
            <span className={`badge due-badge ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'today' : ''}`}>
              <Calendar size={12} />
              {isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}
              {format(dueDate, 'MMM d')}
            </span>
          )}
        </div>
        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit task">
            <Pencil size={15} />
          </button>
          <button
            className={`icon-btn ${confirmDelete ? 'danger-confirm' : 'danger'}`}
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className={`card-title ${task.status === 'done' ? 'done' : ''}`}>{task.title}</h3>

      {task.description && (
        <p className="card-desc">{task.description}</p>
      )}

      <div className="card-footer">
        <div className="status-dropdown">
          <button
            className={`status-btn status-${task.status}`}
            onClick={() => setStatusOpen(!statusOpen)}
          >
            {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
            <ChevronDown size={14} />
          </button>
          {statusOpen && (
            <div className="status-menu">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`status-opt ${opt.value === task.status ? 'active' : ''} status-${opt.value}`}
                  onClick={() => handleStatusSelect(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="created-at">
          {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
