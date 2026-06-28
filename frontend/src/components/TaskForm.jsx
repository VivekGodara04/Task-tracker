import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const INITIAL = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 2) errs.title = 'Title must be at least 2 characters';
    else if (form.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
    if (form.dueDate && new Date(form.dueDate) < new Date(new Date().toDateString()))
      errs.dueDate = 'Due date cannot be in the past';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    const payload = { ...form, dueDate: form.dueDate || null };
    const result = await onSubmit(payload);
    setSubmitting(false);
    if (result?.success !== false) onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="task-form" noValidate>
          <div className="field">
            <label htmlFor="title">Title *</label>
            <input
              id="title" name="title" type="text"
              value={form.title} onChange={handleChange}
              placeholder="What needs to be done?"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description" name="description"
              value={form.description} onChange={handleChange}
              placeholder="Add some details (optional)"
              rows={3}
              className={errors.description ? 'error' : ''}
              maxLength={500}
            />
            <div className="char-count">{form.description.length}/500</div>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate" name="dueDate" type="date"
              value={form.dueDate} onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
            />
            {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="spin" /> Saving…</> : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
