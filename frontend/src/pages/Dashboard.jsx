import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import FilterBar from '../components/FilterBar';
import StatsBar from '../components/StatsBar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, stats, total, loading, fetchTasks, createTask, updateTask, deleteTask, updateStatus } = useTasks();
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '', sortBy: 'createdAt', sortOrder: 'desc' });
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', task }
  const [confirmDelete, setConfirmDelete] = useState(null); // null | taskId
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchTimer = useRef(null);

  const load = useCallback((f = filters) => {
    const params = {};
    if (f.status !== 'all') params.status = f.status;
    if (f.priority !== 'all') params.priority = f.priority;
    if (f.search) params.search = f.search;
    if (f.sortBy) params.sortBy = f.sortBy;
    if (f.sortOrder) params.sortOrder = f.sortOrder;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(newFilters), 300);
  };

  const handleCreate = async (data) => {
    const task = await createTask(data);
    load();
    return task;
  };

  const handleUpdate = async (data) => {
    await updateTask(modal.task._id, data);
    load();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(confirmDelete);
      setConfirmDelete(null);
      load();
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    load();
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>✦</div>
          <span style={styles.brandName}>TaskFlow</span>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navItem}>
            <span>📋</span> All Tasks
          </div>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout} style={{ color: 'var(--text-3)', width: '100%', justifyContent: 'center', marginTop: 4 }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>My Tasks</h1>
            <p style={styles.pageSub}>Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setModal({ mode: 'create' })}>
            + New task
          </button>
        </header>

        <StatsBar stats={stats} total={total} />

        <div style={styles.filterSection}>
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>

        {loading ? (
          <div style={styles.loadingWrap}>
            <div className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
            <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Loading tasks…</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'No matching tasks'
                : 'No tasks yet'}
            </div>
            <p className="empty-state-desc">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Click "New task" to create your first task.'}
            </p>
            {!filters.search && filters.status === 'all' && filters.priority === 'all' && (
              <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })} style={{ marginTop: 8 }}>
                + Create first task
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => setModal({ mode: 'edit', task: t })}
                onDelete={(id) => setConfirmDelete(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {modal && (
        <TaskModal
          task={modal.mode === 'edit' ? modal.task : null}
          onSave={modal.mode === 'create' ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete task?"
          message="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  sidebar: {
    width: 240, background: 'var(--surface)', borderRight: '1.5px solid var(--border)',
    display: 'flex', flexDirection: 'column', padding: '24px 16px',
    position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 },
  logo: { fontSize: 18, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  brandName: { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--text)' },
  nav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--indigo-light)', color: 'var(--indigo)', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  sidebarFooter: { borderTop: '1px solid var(--border)', paddingTop: 16 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 8px' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  userName: { fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 },
  userEmail: { fontSize: 11, color: 'var(--text-3)', lineHeight: 1.3 },
  main: { flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, overflow: 'auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
  pageTitle: { fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 },
  pageSub: { fontSize: 14, color: 'var(--text-2)', marginTop: 4 },
  filterSection: { background: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)' },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '64px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
};

// Responsive sidebar
const responsiveStyle = document.createElement('style');
responsiveStyle.textContent = `
  @media (max-width: 768px) {
    aside { display: none !important; }
    main { padding: 16px !important; }
  }
`;
document.head.appendChild(responsiveStyle);

export default Dashboard;
