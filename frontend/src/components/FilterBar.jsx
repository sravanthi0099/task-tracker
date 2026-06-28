import React from 'react';

const FilterBar = ({ filters, onChange }) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div style={styles.bar}>
      <div style={styles.search}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          className="form-input"
          style={styles.searchInput}
          type="text"
          placeholder="Search tasks…"
          value={filters.search || ''}
          onChange={set('search')}
        />
      </div>

      <div style={styles.selects}>
        <select className="form-select" style={styles.select} value={filters.status || 'all'} onChange={set('status')}>
          <option value="all">All status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select className="form-select" style={styles.select} value={filters.priority || 'all'} onChange={set('priority')}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select className="form-select" style={styles.select} value={filters.sortBy || 'createdAt'} onChange={set('sortBy')}>
          <option value="createdAt">Newest first</option>
          <option value="dueDate">Due date</option>
          <option value="title">Title A-Z</option>
          <option value="priority">Priority</option>
          <option value="updatedAt">Last updated</option>
        </select>

        <select className="form-select" style={styles.select} value={filters.sortOrder || 'desc'} onChange={set('sortOrder')}>
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  bar: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  search: { position: 'relative', flex: '1 1 220px', minWidth: 180 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
  searchInput: { paddingLeft: 36 },
  selects: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  select: { width: 'auto', minWidth: 120 },
};

export default FilterBar;
