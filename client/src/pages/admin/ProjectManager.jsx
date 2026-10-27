import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import ProjectDrawer from '../../components/admin/ProjectDrawer';

const STAGES = ['Discovery & Requirements', 'System Architecture', 'Full-Stack Development', 'UAT & Testing', 'Deployment'];

async function fetchProjects() {
  const res = await api.get('/admin/projects');
  return res.data;
}

export default function ProjectManager() {
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  const updateProject = useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/admin/projects/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setEditing(null); },
  });

  if (isLoading) return <SkeletonGrid />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{p.client_name}</h3>
              <span className="text-xs text-cyan-300">{p.stage}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-3">
              <div
                className="bg-cyan-500 h-1.5 rounded-full"
                style={{ width: `${((STAGES.indexOf(p.stage) + 1) / STAGES.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mb-3">Engineer: {p.lead_engineer || 'Unassigned'}</p>
            <button onClick={() => setEditing(p)} className="text-sm text-cyan-400 hover:underline">
              Update
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectDrawer
          project={editing}
          stages={STAGES}
          onClose={() => setEditing(null)}
          onSave={body => updateProject.mutate({ id: editing.id, ...body })}
        />
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}