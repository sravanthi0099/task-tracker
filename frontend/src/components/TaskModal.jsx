import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TaskModal = ({ task, onSave, onClose }) => {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', tags: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        tags: (task.tags || []).join(', '),
      });
    }
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (form.title.trim().length < 2) e.title = 'Title must be at least 2 characters';
    if (form.title.length > 100) e.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) e.description = 'Description cannot exceed 500 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await onSave(data);
      onClose();
    } catch (err) {
      // handled by hook
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className={`form-input${errors.title ? ' error' : ''}`}
                type="text" value={form.title} onChange={set('title')}
                placeholder="What needs to be done?"
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className={`form-textarea${errors.description ? ' error' : ''}`}
                value={form.description} onChange={set('description')}
                placeholder="Add details (optional)"
                rows={3}
              />
              <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'right' }}>{form.description.length}/500</div>
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={set('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due date</label>
              <input
                className="form-input" type="date"
                value={form.dueDate} onChange={set('dueDate')}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                className="form-input" type="text"
                value={form.tags} onChange={set('tags')}
                placeholder="design, backend, urgent (comma-separated)"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
