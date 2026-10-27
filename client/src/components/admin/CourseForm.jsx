// client/src/components/admin/CourseForm.jsx
import { useState } from 'react';

export default function CourseForm({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">New Training Module</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-3" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
          rows={3} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-3" />
        <textarea placeholder="Lesson links (one per line)" value={links} onChange={e => setLinks(e.target.value)}
          rows={3} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-white/10 rounded-lg py-2">Cancel</button>
          <button
            onClick={() => onSave({ title, description, lesson_links: links.split('\n').filter(Boolean) })}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg py-2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}