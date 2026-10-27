import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function EnrollmentTable({ moduleId, onClose }) {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments', moduleId],
    queryFn: () => api.get(`/admin/training/${moduleId}/enrollments`).then(res => res.data),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-xl p-6">
        <button onClick={onClose} className="text-slate-400 mb-4">&larr; Close</button>
        {isLoading ? (
          <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-left border-b border-white/10">
              <tr><th className="py-2">Student</th><th>Email</th><th>Progress</th></tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id} className="border-b border-white/5">
                  <td className="py-2">{e.full_name}</td>
                  <td>{e.email}</td>
                  <td>{e.progress_pct ?? 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}