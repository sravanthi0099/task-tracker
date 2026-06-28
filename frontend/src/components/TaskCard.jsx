import React, { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';

const statusLabel = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Completed' };
const statusClass = { todo: 'badge-todo', 'in-progress': 'badge-in-progress', completed: 'badge-completed' };
const statusDot = { todo: '#9899b3', 'in-progress': '#3b82f6', completed: '#10b981' };
const priorityClass = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
const priorityIcon = { low: '↓', medium: '→', high: '↑' };

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [statusChanging, setStatusChanging] = useState(false);

  const handleStatusCycle = async () => {
    const cycle = { todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' };
    const next = cycle[task.status];
    setStatusChanging(true);
    try {
      await onStatusChange(task._id, next);
    } finally {
      setStatusChanging(false);
    }
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && task.status !== 'completed' && !isToday(dueDate);
  const isDueToday = dueDate && isToday(dueDate) && task.status !== 'completed';

  return (
    <div className="card fade-in" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.statusRow}>
          <button
            onClick={handleStatusCycle}
            disabled={statusChanging}
            style={{ ...styles.statusCircle, borderColor: statusDot[task.status], background: task.status === 'completed' ? statusDot[task.status] : 'transparent' }}
            title={`Click to move to: ${statusLabel[{ todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' }[task.status]]}`}
          >
            {task.status === 'completed' && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
          </button>
          <span
            className={`badge ${statusClass[task.status]}`}
            style={{ cursor: 'pointer' }}
            onClick={handleStatusCycle}
          >
            {statusLabel[task.status]}
          </span>
        </div>
        <div style={styles.actions}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(task)} title="Edit" style={{ fontSize: 14 }}>✎</button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(task._id)} title="Delete" style={{ fontSize: 14 }}>✕</button>
        </div>
      </div>

      <h3 style={{ ...styles.title, textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.6 : 1 }}>
        {task.title}
      </h3>

      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      <div style={styles.footer}>
        <span className={`badge ${priorityClass[task.priority]}`}>
          {priorityIcon[task.priority]} {task.priority}
        </span>

        {dueDate && (
          <span style={{
            fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
            color: isOverdue ? 'var(--danger)' : isDueToday ? 'var(--warning)' : 'var(--text-3)'
          }}>
            <span>{isOverdue ? '⚠' : isDueToday ? '⏰' : '📅'}</span>
            {isOverdue ? 'Overdue · ' : isDueToday ? 'Due today · ' : ''}{format(dueDate, 'MMM d, yyyy')}
          </span>
        )}

        {task.tags?.length > 0 && (
          <div style={styles.tags}>
            {task.tags.slice(0, 3).map(tag => (
              <span key={tag} style={styles.tag}>#{tag}</span>
            ))}
            {task.tags.length > 3 && <span style={styles.tag}>+{task.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: { display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 150ms ease', cursor: 'default' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8 },
  statusCircle: { width: 20, height: 20, borderRadius: '50%', border: '2px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms', flexShrink: 0 },
  actions: { display: 'flex', gap: 4, opacity: 0, transition: 'opacity 150ms' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, transition: 'all 150ms' },
  description: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  footer: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tags: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  tag: { fontSize: 11, color: 'var(--indigo)', background: 'var(--indigo-light)', padding: '2px 7px', borderRadius: 20, fontWeight: 500 },
};

// Show actions on hover via CSS injection
const hoverStyle = document.createElement('style');
hoverStyle.textContent = `.card:hover .btn-ghost, .card:hover .btn-danger { opacity: 1 !important; }`;
document.head.appendChild(hoverStyle);

export default TaskCard;
