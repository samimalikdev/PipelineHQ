import React from 'react';
import useNavigationStore from '../../store/useNavigationStore';

export default function RecentApplicationsTable({ applications, searchQuery = '' }) {
  const setPage = useNavigationStore((s) => s.setPage);

  return (
    <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/20">
      <div className="p-6 flex justify-between items-center border-b border-outline-variant/20">
        <div>
          <h4 className="font-headline font-bold text-lg text-white">Recent Candidates</h4>
          <p className="text-xs text-on-surface-variant font-label">
            {searchQuery ? (
              <><span className="text-primary">{applications.length}</span> result{applications.length !== 1 ? 's' : ''} for "<span className="text-white">{searchQuery}</span>"</>
            ) : (
              'Manage your incoming talent pipeline'
            )}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setPage('applications')} className="bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-5 py-2 rounded-lg transition-all flex items-center gap-2 font-label shadow-[0_0_12px_rgba(204,255,0,0.2)]">
            <span className="material-symbols-outlined text-base">add</span> New Entry
          </button>
          <button onClick={() => setPage('applications')} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors font-label">View All</button>
        </div>
      </div>
      {applications.length === 0 ? (
        <div className="p-10 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-3 block opacity-30">{searchQuery ? 'search_off' : 'inbox'}</span>
          <p className="text-sm font-label">
            {searchQuery
              ? `No candidates match "${searchQuery}"`
              : 'No candidates yet. Start adding to your pipeline!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-highest/40">
              <tr>
                {['Candidate Name', 'Role Applied For', 'Status', 'Source', 'Sourced Date', ''].map((h) => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant font-label ${h === '' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-surface-container-high/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-xs border border-outline-variant/20 text-white`}>{app.candidate ? app.candidate[0] : 'U'}</div>
                      <span className="text-sm font-semibold text-white font-label">{app.candidate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-label font-medium text-on-surface-variant">{app.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border font-label ${app.statusClass}`}>{app.status}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant font-label">{app.source}</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant font-label">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setPage('applications')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => setPage('applications')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">visibility</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
