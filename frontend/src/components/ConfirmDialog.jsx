import React from 'react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="modal fade-in" style={{ maxWidth: 380 }}>
      <div style={{ padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑</div>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading} style={{ background: 'var(--danger)', color: 'white' }}>
            {loading ? <span className="spinner" /> : null}
            Delete task
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
