import React from 'react';
import useNavigationStore from '../../store/useNavigationStore';

export default function Charts({ total, statuses, sources }) {
  const setPage = useNavigationStore((s) => s.setPage);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 border border-outline-variant/20">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-headline font-bold text-lg text-white">Status Breakdown</h4>
          <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
        </div>
        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40 rounded-full border-[14px] border-surface-container-highest flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[14px] border-primary border-t-transparent border-l-transparent rotate-45 opacity-90 shadow-[0_0_20px_rgba(204,255,0,0.2)]"></div>
            <div className="text-center">
              <span className="text-2xl font-extrabold font-headline text-white">{total || 0}</span>
              <p className="text-[9px] uppercase tracking-wider text-on-surface-variant font-label">Total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full">
            {statuses.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                <span className="text-xs text-on-surface-variant font-label">{s.label}</span>
                <span className="text-xs font-bold ml-auto text-white font-label">{String(s.value).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 border border-outline-variant/20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="font-headline font-bold text-lg text-white">Source Win-Rate</h4>
            <p className="text-xs text-on-surface-variant mt-1 font-label">Interview conversion by platform</p>
          </div>
          <button onClick={() => setPage('analytics')} className="px-4 py-1.5 rounded-full bg-surface-container-highest text-xs font-bold font-label text-on-surface-variant border border-outline-variant/30 hover:bg-white/5 transition-colors">Quarterly</button>
        </div>
        <div className="space-y-6">
          {sources.map((s) => (
            <div key={s.label} className="space-y-2 relative">
              {s.top && (
                <div className="absolute -top-5 right-0 text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-label tracking-wider">TOP</div>
              )}
              <div className="flex justify-between text-xs font-bold font-label text-white">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-base">{s.icon}</span>
                  {s.label}
                </span>
                <span className="text-primary">{s.pct}%</span>
              </div>
              <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full" style={{ width: `${s.pct}%`, boxShadow: s.top ? '0 0 12px rgba(204,255,0,0.4)' : 'none' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
