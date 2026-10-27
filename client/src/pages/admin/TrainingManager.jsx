import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import CourseForm from '../../components/admin/CourseForm';
import EnrollmentTable from '../../components/admin/EnrollmentTable';

async function fetchModules() {
  const res = await api.get('/admin/training');
  return res.data;
}

export default function TrainingManager() {
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState(null);
  const qc = useQueryClient();

  const { data: modules = [], isLoading } = useQuery({ queryKey: ['modules'], queryFn: fetchModules });

  const createModule = useMutation({
    mutationFn: body => api.post('/admin/training', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modules'] }); setShowForm(false); },
  });

  if (isLoading) return <div className="h-40 bg-white/5 rounded-xl animate-pulse" />;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Training Modules</h1>
        <button onClick={() => setShowForm(true)} className="bg-cyan-600 hover:bg-cyan-500 rounded-lg px-4 py-2 text-sm">
          + New Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map(m => (
          <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold mb-1">{m.title}</h3>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{m.description}</p>
            <button onClick={() => setViewing(m.id)} className="text-sm text-cyan-400 hover:underline">
              View enrollments
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <CourseForm onClose={() => setShowForm(false)} onSave={body => createModule.mutate(body)} />
      )}
      {viewing && (
        <EnrollmentTable moduleId={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}