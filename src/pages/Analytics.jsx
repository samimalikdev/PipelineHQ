import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/shared/Sidebar';
import useApplicationsStore from '../store/useApplicationsStore';

const TIME_FILTERS = ['Last 7 days', '30 days', '3 months', 'All time'];

function filterByTime(apps, filter) {
  const now = new Date();
  const ms = {
    'Last 7 days': 7,
    '30 days': 30,
    '3 months': 90,
    'All time': Infinity,
  }[filter] ?? Infinity;
  if (ms === Infinity) return apps;
  const cutoff = new Date(now - ms * 86400000);
  return apps.filter(a => new Date(a.created_at || a.date) >= cutoff);
}

function pct(num, denom) {
  if (!denom) return 0;
  return Math.round((num / denom) * 100);
}

function SummaryCards({ apps }) {
  const total      = apps.length;
  const interviews = apps.filter(a => ['Interview','Technical Test'].includes(a.status)).length;
  const offers     = apps.filter(a => a.status === 'Offer').length;
  const fillRate   = pct(interviews, total);
  const offerRate  = pct(offers, total);

  const cards = [
    {
      icon: 'group',
      label: 'Total Candidates',
      value: total.toString(),
      badge: `${total} total`,
      badgeClass: 'text-primary',
      trend: 'trending_up',
      barColor: 'from-primary',
    },
    {
      icon: 'handshake',
      label: 'Offer Rate',
      value: `${offerRate}%`,
      badge: `${offers} offers`,
      badgeClass: 'text-cyan-400',
      trend: offers > 0 ? 'trending_up' : 'trending_flat',
      barColor: 'from-cyan-400',
    },
    {
      icon: 'conveyor_belt',
      label: 'Interview Rate',
      value: `${fillRate}%`,
      badge: `${interviews} in pipeline`,
      badgeClass: 'text-primary',
      trend: interviews > 0 ? 'trending_up' : 'trending_flat',
      barColor: 'from-primary',
    },
    {
      icon: 'cancel',
      label: 'Rejection Rate',
      value: `${pct(apps.filter(a => a.status === 'Rejected').length, total)}%`,
      badge: `${apps.filter(a => a.status === 'Rejected').length} rejected`,
      badgeClass: 'text-red-400',
      trend: 'trending_down',
      barColor: 'from-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map(c => (
        <div key={c.label} className="bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined text-xl">{c.icon}</span></div>
            <span className={`text-xs font-bold flex items-center gap-1 ${c.badgeClass}`}>{c.badge} <span className="material-symbols-outlined text-sm">{c.trend}</span></span>
          </div>
          <p className="text-on-surface-variant text-xs font-label font-medium mb-1">{c.label}</p>
          <p className="text-3xl font-extrabold font-headline tracking-tighter text-white">{c.value}</p>
          <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${c.barColor} to-transparent opacity-50`}></div>
        </div>
      ))}
    </div>
  );
}

function ActivityChart({ apps, activeTime }) {
  const { labels, points, subtitle } = useMemo(() => {
    const now = new Date();

    if (activeTime === 'All time') {
      
      const monthMap = {};
      apps.forEach(a => {
        const d = new Date(a.created_at || a.date);
        if (isNaN(d)) return;
        const key = d.getFullYear() * 100 + d.getMonth(); 
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      const keys = Object.keys(monthMap).sort().slice(-12);
      return {
        labels: keys.map(k => {
          const y = Math.floor(k / 100), m = k % 100;
          return new Date(y, m).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }),
        points: keys.map(k => monthMap[k] || 0),
        subtitle: 'Candidates added per month (last 12 months)',
      };
    }

    const days = activeTime === 'Last 7 days' ? 7 : activeTime === '30 days' ? 30 : 90;
    const counts = Array(days).fill(0);
    apps.forEach(a => {
      const d = new Date(a.created_at || a.date);
      const diff = Math.floor((now - d) / 86400000);
      if (diff >= 0 && diff < days) counts[days - 1 - diff]++;
    });

    let lbls;
    if (days === 7) {
      lbls = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      });
    } else if (days === 30) {
      lbls = ['Day 1', 'Day 10', 'Day 20', 'Day 30'];
    } else {
      lbls = ['Month 1', 'Month 2', 'Month 3'];
    }

    return { labels: lbls, points: counts, subtitle: `Candidates added over last ${days} days` };
  }, [apps, activeTime]);

  const max = Math.max(...points, 1);
  const h = 100;
  const w = 400;
  const step = w / Math.max(points.length - 1, 1);
  const toY = v => h - (v / max) * h * 0.85 - 5;
  const pathD = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step},${toY(v)}`).join(' ');
  const areaD = pathD + ` L${(points.length - 1) * step},${h} L0,${h} Z`;

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h4 className="text-lg font-bold font-headline text-white">Pipeline Activity</h4>
          <p className="text-sm text-on-surface-variant font-label mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label">
          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(204,255,0,0.6)]"></span> Candidates
        </div>
      </div>
      <div className="h-56 relative">
        <svg className="w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ccff00', stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: '#ccff00', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[25, 50, 75].map(y => <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
          <path d={areaD} fill="url(#lineGrad)" />
          <path d={pathD} fill="none" stroke="#ccff00" strokeWidth="2" strokeLinejoin="round" />
          {points.length <= 30 && points.filter((_, i) => points.length <= 12 || i % Math.ceil(points.length / 8) === 0 || i === points.length - 1).map((v, idx) => {
            const origIdx = points.findIndex((_, fi) => fi === (points.length <= 12 ? idx : idx * Math.ceil(points.length / 8)));
            const cx = (points.length <= 12 ? idx : idx * Math.ceil(points.length / 8)) * step;
            return <circle key={idx} cx={cx} cy={toY(v)} r="3" fill="#ccff00" />;
          })}
        </svg>
        <div className="absolute -bottom-5 left-0 w-full flex justify-between text-[10px] text-on-surface-variant font-label font-bold uppercase tracking-wider">
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

function StatusFunnel({ apps }) {
  const total = apps.length || 1;
  const statuses = [
    { label: 'SOURCED',        key: null,              color: 'bg-primary',    textColor: 'text-on-primary' },
    { label: 'INTERVIEW',      key: 'Interview',       color: 'bg-primary/60', textColor: 'text-white' },
    { label: 'TECHNICAL TEST', key: 'Technical Test',  color: 'bg-primary/40', textColor: 'text-white' },
    { label: 'OFFER',          key: 'Offer',           color: 'bg-cyan-400',   textColor: 'text-black' },
  ];

  const stages = statuses.map(s => {
    const count = s.key ? apps.filter(a => a.status === s.key).length : apps.length;
    return { ...s, count, pct: pct(count, total) || (s.key === null ? 100 : 0) };
  });

  const indents = ['0%', '5%', '12.5%', '17.5%'];

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <h4 className="text-lg font-bold font-headline text-white mb-8">Status Funnel</h4>
      <div className="space-y-4">
        {stages.map((s, i) => (
          <div key={s.label} style={{ marginLeft: indents[i], width: `calc(100% - 2 * ${indents[i]})` }}>
            <div className="flex justify-between text-xs font-bold font-label mb-1">
              <span className="text-white">{s.label}</span><span className="text-primary">{s.pct}%</span>
            </div>
            <div className="w-full h-8 bg-surface-container-highest rounded-lg overflow-hidden">
              <div className={`h-full ${s.color} flex items-center px-3 text-[10px] font-bold ${s.textColor} font-label`} style={{ width: `${Math.max(s.pct, 5)}%` }}>{s.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourceDonut({ apps }) {
  const total = apps.length || 1;

  const sourceMap = {
    'LinkedIn':       { color: '#ccff00', dotColor: '#ccff00' },
    'Referral':       { color: '#67e8f9', dotColor: '#67e8f9' },
    'Direct Website': { color: '#c084fc', dotColor: '#c084fc' },
    'Job Board':      { color: '#5a6044', dotColor: '#5a6044' },
  };

  const counts = {};
  apps.forEach(a => {
    const key = a.source || 'Other';
    counts[key] = (counts[key] || 0) + 1;
  });

  const items = Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    pct: pct(count, total),
    dotColor: sourceMap[label]?.dotColor || '#888',
    color: sourceMap[label]?.color || '#888',
  })).sort((a, b) => b.count - a.count);

  let offset = 0;
  const arcs = items.map(item => {
    const arc = { ...item, offset };
    offset += item.pct;
    return arc;
  });

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <h4 className="text-lg font-bold font-headline text-white mb-8">Source Breakdown</h4>
      <div className="flex items-center gap-10">
        <div className="relative w-44 h-44 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1c2010" strokeWidth="3" />
            {arcs.map(arc => (
              <circle key={arc.label} cx="18" cy="18" r="15.915" fill="transparent"
                stroke={arc.color}
                strokeDasharray={`${arc.pct} ${100 - arc.pct}`}
                strokeDashoffset={-arc.offset}
                strokeWidth="3"
                style={arc.color === '#ccff00' ? { filter: 'drop-shadow(0 0 4px rgba(204,255,0,0.5))' } : {}}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold font-headline text-white">{apps.length}</span>
            <span className="text-[9px] font-bold text-on-surface-variant font-label uppercase tracking-wider">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          {items.length === 0 ? (
            <p className="text-on-surface-variant text-sm font-label">No data yet</p>
          ) : items.map(i => (
            <div key={i.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.dotColor }}></span>
                <span className="text-sm text-white font-label">{i.label}</span>
              </div>
              <span className="text-sm font-bold font-label text-white">{i.pct}% <span className="text-on-surface-variant font-normal">({i.count})</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WinRate({ apps }) {
  const sources = ['LinkedIn', 'Direct Website', 'Referral', 'Job Board'];

  const bars = sources.map(src => {
    const srcApps = apps.filter(a => a.source === src);
    const hired = srcApps.filter(a => a.status === 'Offer').length;
    const hiredPct = pct(hired, srcApps.length || 1);
    return { label: src.toUpperCase(), hired: hiredPct, sourced: 100 - hiredPct, total: srcApps.length };
  }).filter(b => b.total > 0);

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <h4 className="text-lg font-bold font-headline text-white mb-8">Offer Rate by Source</h4>
      {bars.length === 0 ? (
        <p className="text-on-surface-variant text-sm font-label">No sourced candidates yet.</p>
      ) : (
        <div className="space-y-8">
          {bars.map(b => (
            <div key={b.label} className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-label">
                <span className="text-on-surface-variant">{b.label}</span>
                <span className="text-primary">{b.hired}% Offer</span>
              </div>
              <div className="flex gap-1 h-3">
                <div className="rounded-full h-full bg-primary shadow-[0_0_8px_rgba(204,255,0,0.4)]" style={{ width: `${b.hired}%` }}></div>
                <div className="rounded-full h-full bg-surface-container-highest" style={{ width: `${b.sourced}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center gap-6">
        {[{ color: 'bg-primary', label: 'OFFER' }, { color: 'bg-surface-container-highest', label: 'OTHER' }].map(l => (
          <div key={l.label} className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant font-label">
            <span className={`w-2 h-2 ${l.color} rounded-full`}></span> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopRoles({ apps }) {
  const roleCounts = {};
  apps.forEach(a => {
    if (a.role) roleCounts[a.role] = (roleCounts[a.role] || 0) + 1;
  });

  const roles = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => {
      const statusMap = { Active: 'bg-primary/10 text-primary border-primary/20', Sourcing: 'bg-white/5 text-on-surface-variant border-white/10', Closing: 'bg-cyan-400/15 text-cyan-400 border-cyan-400/20' };
      return { letter: name[0].toUpperCase(), name, apps: `${count} Candidate${count !== 1 ? 's' : ''}`, statusLabel: 'Active', statusClass: statusMap['Active'] };
    });

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <h4 className="text-lg font-bold font-headline text-white mb-6">Top Roles</h4>
      {roles.length === 0 ? (
        <p className="text-on-surface-variant text-sm font-label">No role data yet.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {roles.map(c => (
            <div key={c.name} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-highest rounded-xl flex items-center justify-center font-extrabold text-on-surface-variant font-headline border border-white/5">{c.letter}</div>
                <div>
                  <p className="font-bold text-white font-label">{c.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-white font-label mb-1">{c.apps}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border font-label ${c.statusClass}`}>{c.statusLabel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MonthlyTable({ apps }) {
  const monthlyData = useMemo(() => {
    const map = {};
    apps.forEach(a => {
      const d = new Date(a.created_at || a.date);
      if (isNaN(d)) return;
      const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!map[key]) map[key] = { sourced: 0, interviews: 0, offers: 0, ts: d.getTime() };
      map[key].sourced++;
      if (['Interview','Technical Test'].includes(a.status)) map[key].interviews++;
      if (a.status === 'Offer') map[key].offers++;
    });
    return Object.entries(map)
      .sort((a, b) => b[1].ts - a[1].ts)
      .map(([month, d]) => ({ month, ...d }));
  }, [apps]);

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20">
      <h4 className="text-lg font-bold font-headline text-white mb-6">Monthly Trend</h4>
      {monthlyData.length === 0 ? (
        <p className="text-on-surface-variant text-sm font-label">No data yet.</p>
      ) : (
        <table className="w-full text-left">
          <thead><tr className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest border-b border-white/5 font-label">
            <th className="pb-4">Month</th><th className="pb-4">Sourced</th><th className="pb-4">Interviews</th><th className="pb-4">Offers</th>
          </tr></thead>
          <tbody className="text-sm font-label">
            {monthlyData.map(r => (
              <tr key={r.month} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="py-4 font-bold text-white">{r.month}</td>
                <td className="py-4 text-on-surface-variant">{r.sourced}</td>
                <td className="py-4 font-medium text-white">{r.interviews}</td>
                <td className="py-4 font-medium text-primary">{r.offers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Insights({ apps }) {
  const total = apps.length;

  const sources = ['LinkedIn', 'Referral', 'Direct Website', 'Job Board'];
  const sourceStats = sources.map(src => {
    const srcApps = apps.filter(a => a.source === src);
    const offers = srcApps.filter(a => a.status === 'Offer').length;
    return { src, offers, total: srcApps.length, rate: pct(offers, srcApps.length || 1) };
  }).filter(s => s.total > 0).sort((a, b) => b.rate - a.rate);

  const topChannel = sourceStats[0];
  const ghosted = apps.filter(a => a.status === 'Ghosted').length;
  const offerRate = pct(apps.filter(a => a.status === 'Offer').length, total);

  const items = [
    {
      icon: 'lightbulb',
      border: 'border-primary',
      iconCls: 'bg-primary/10 text-primary',
      title: 'Top Sourcing Channel',
      text: topChannel
        ? <><span className="text-primary font-bold">{topChannel.src}</span> has a {topChannel.rate}% offer rate — your best-performing channel with {topChannel.total} candidates.</>
        : 'Add candidates with sources to see your top channel.',
    },
    {
      icon: 'verified',
      border: 'border-cyan-400',
      iconCls: 'bg-cyan-400/10 text-cyan-400',
      title: 'Offer Conversion',
      text: total > 0
        ? <><span className="text-cyan-400 font-bold">{offerRate}% offer rate</span> across {total} candidates in your pipeline.</>
        : 'Start adding candidates to track your offer rate.',
    },
    {
      icon: 'warning',
      border: ghosted > 0 ? 'border-error' : 'border-primary',
      iconCls: ghosted > 0 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary',
      title: 'Ghosting Alert',
      text: ghosted > 0
        ? <><span className="text-error font-bold">{ghosted} candidate{ghosted !== 1 ? 's' : ''} ghosted</span> — consider a follow-up to re-engage them.</>
        : <><span className="text-primary font-bold">No ghosting!</span> All candidates are actively engaged in your pipeline.</>,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map(i => (
        <div key={i.title} className={`bg-surface-container-highest/30 backdrop-blur-md p-6 rounded-2xl border-l-4 ${i.border} flex items-start gap-4 border border-white/5`}>
          <div className={`p-2 rounded-lg flex-shrink-0 ${i.iconCls}`}><span className="material-symbols-outlined text-xl">{i.icon}</span></div>
          <div>
            <h5 className="font-bold text-sm text-white mb-1 font-label">{i.title}</h5>
            <p className="text-xs text-on-surface-variant font-label leading-relaxed">{i.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [activeTime, setActiveTime] = useState('All time');
  const { applications, fetchApplications, loading } = useApplicationsStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const apps = useMemo(() => filterByTime(applications, activeTime), [applications, activeTime]);

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none"></div>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-white">Analytics</h2>
            <nav className="hidden lg:flex items-center gap-6">
              {TIME_FILTERS.map(f => (
                <button key={f} onClick={() => setActiveTime(f)}
                  className={`text-sm font-label font-medium transition-all pb-1 ${activeTime === f ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}>{f}</button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label">
            {loading ? (
              <span className="animate-pulse text-primary">Loading...</span>
            ) : (
              <span className="text-primary font-bold">{apps.length} candidates</span>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-on-surface-variant font-label text-sm">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <>
              <SummaryCards apps={apps} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8"><ActivityChart apps={apps} activeTime={activeTime} /><StatusFunnel apps={apps} /></div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8"><SourceDonut apps={apps} /><WinRate apps={apps} /></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><TopRoles apps={apps} /><MonthlyTable apps={apps} /></div>
              <Insights apps={apps} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
