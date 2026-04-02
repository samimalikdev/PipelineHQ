import React from 'react';

export default function StatsCards({ total, thisWeek, interviews, offers }) {
  const cards = [
    { icon: 'list_alt',    label: 'Total Candidates',     value: total,      badge: '+12%',   badgeClass: 'text-primary',   iconBg: 'bg-primary/10 text-primary',    highlight: false },
    { icon: 'event',       label: 'Added This Week',      value: thisWeek,   badge: '+5',     badgeClass: 'text-cyan-400',  iconBg: 'bg-cyan-400/10 text-cyan-400',  highlight: false },
    { icon: 'video_call',  label: 'Upcoming Interviews',  value: interviews, badge: 'Active', badgeClass: 'text-purple-400', iconBg: 'bg-purple-400/10 text-purple-400', highlight: true },
    { icon: 'celebration', label: 'Total Offers',         value: offers,     badge: 'WIN',    badgeClass: 'text-green-400', iconBg: 'bg-green-400/10 text-green-400', highlight: false },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((c) => (
        <div key={c.label} className={`bg-surface-container-highest rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border ${c.highlight ? 'border-primary/30' : 'border-outline-variant/20'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.iconBg}`}>
              <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
            </div>
            <span className={`text-[10px] font-bold tracking-[0.1em] ${c.badgeClass}`}>{c.badge}</span>
          </div>
          <p className="text-on-surface-variant text-xs font-label font-medium mb-1">{c.label}</p>
          <h3 className={`text-3xl font-extrabold font-headline ${c.highlight ? 'text-primary' : 'text-white'}`}>{String(c.value).padStart(2, '0')}</h3>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px]">{c.icon}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
