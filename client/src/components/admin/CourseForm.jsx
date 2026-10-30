import { useState } from 'react';

export default function CourseForm({ onClose, onSave, saving }) {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [links,       setLinks]       = useState('');

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div className="admin-modal-title">New Training Module</div>
          <button className="admin-drawer-close" onClick={onClose}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Title</label>
          <input
            className="admin-input"
            placeholder="e.g. Introduction to ERP Systems"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Description</label>
          <textarea
            className="admin-textarea"
            placeholder="Brief overview of what students will learn…"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Lesson Links <span style={{ color: 'var(--a-muted)', textTransform: 'none', letterSpacing: 0 }}>(one per line)</span></label>
          <textarea
            className="admin-textarea"
            placeholder={`https://youtu.be/lesson1\nhttps://youtu.be/lesson2`}
            value={links}
            onChange={e => setLinks(e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="admin-btn admin-btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={!title.trim() || saving}
            onClick={() => onSave({
              title: title.trim(),
              description: description.trim(),
              lesson_links: links.split('\n').map(l => l.trim()).filter(Boolean),
            })}
          >
            {saving ? 'Creating…' : 'Create Module'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}