import { useMemo } from 'react';
import useApplicationsStore from '../store/useApplicationsStore';

const STATUS_COLORS = {
  'Applied': 'bg-primary/15 text-primary border-primary/30',
  'Interview': 'bg-cyan-400/15 text-cyan-400 border-cyan-400/30',
  'Technical Test': 'bg-purple-400/15 text-purple-400 border-purple-400/30',
  'Offer': 'bg-green-400/15 text-green-400 border-green-400/30',
  'Rejected': 'bg-red-400/15 text-red-400 border-red-400/30',
  'Ghosted': 'bg-white/20 text-white/80 border-white/30',
};

export default function useDashboardMetrics() {
  const applications = useApplicationsStore((s) => s.applications);

  const metrics = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(a => a.status === 'Interview').length;
    const offers = applications.filter(a => a.status === 'Offer').length;
    const thisWeek = applications.filter(a => {
      const d = new Date(a.date);
      const now = new Date();
      return (now - d) / (1000 * 60 * 60 * 24) <= 7;
    }).length;

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const statuses = [
      { color: 'bg-primary',    label: 'Applied',   value: statusCounts['Applied'] || 0 },
      { color: 'bg-cyan-400',   label: 'Interview', value: statusCounts['Interview'] || 0 },
      { color: 'bg-purple-400', label: 'Technical', value: statusCounts['Technical Test'] || 0 },
      { color: 'bg-green-400',  label: 'Offer',     value: statusCounts['Offer'] || 0 },
      { color: 'bg-red-400',    label: 'Rejected',  value: statusCounts['Rejected'] || 0 },
      { color: 'bg-white/20',   label: 'Ghosted',   value: statusCounts['Ghosted'] || 0 },
    ].filter(s => s.value > 0); 
    
    const finalStatuses = statuses.length > 0 ? statuses : [
      { color: 'bg-primary',    label: 'Applied',   value: 0 },
    ];

    const sourcesMock = [
      { label: 'LinkedIn', icon: 'link', pct: 42 },
      { label: 'Referral', icon: 'group', pct: 68, top: true },
      { label: 'Direct Application', icon: 'near_me', pct: 24 },
      { label: 'Other (Indeed, YC)', icon: 'more_horiz', pct: 15 },
    ];

    const sorted = [...applications].sort(
      (a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at)
    );
    const recentApplications = sorted.slice(0, 5).map(app => ({
      ...app,
      statusClass: STATUS_COLORS[app.status] || 'bg-white/20 text-white border-white/30'
    }));

    return {
      total,
      interviews,
      offers,
      thisWeek,
      statuses: finalStatuses,
      sources: sourcesMock,
      recentApplications
    };
  }, [applications]);

  return metrics;
}
