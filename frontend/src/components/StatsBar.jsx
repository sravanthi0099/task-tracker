import React from 'react';

const StatCard = ({ label, value, color, bg, icon }) => (
  <div style={{ background: bg, border: `1.5px solid ${color}30`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ fontSize: 22, background: `${color}20`, borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

const StatsBar = ({ stats, total }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
    <StatCard label="Total tasks" value={total} color="#6366f1" bg="#eef2ff" icon="📋" />
    <StatCard label="To do" value={stats.todo} color="#64748b" bg="#f8fafc" icon="⏳" />
    <StatCard label="In progress" value={stats['in-progress']} color="#3b82f6" bg="#eff6ff" icon="⚡" />
    <StatCard label="Completed" value={stats.completed} color="#10b981" bg="#f0fdf4" icon="✅" />
  </div>
);

export default StatsBar;
