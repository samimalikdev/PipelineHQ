import React, { useState, useMemo } from 'react';
import Sidebar from '../components/shared/Sidebar';
import useDashboardMetrics from '../hooks/useDashboardMetrics';
import TopBar from '../components/dashboard/TopBar';
import StatsCards from '../components/dashboard/StatsCards';
import Charts from '../components/dashboard/Charts';
import RecentApplicationsTable from '../components/dashboard/RecentApplicationsTable';
import useNavigationStore from '../store/useNavigationStore';

export default function Dashboard() {
  const { total, interviews, offers, thisWeek, statuses, sources, recentApplications } = useDashboardMetrics();
  const setPage = useNavigationStore((s) => s.setPage);
  const [search, setSearch] = useState('');

  const filteredApplications = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return recentApplications;
    return recentApplications.filter((a) =>
      (a.candidate || '').toLowerCase().includes(q) ||
      (a.role || '').toLowerCase().includes(q) ||
      (a.status || '').toLowerCase().includes(q) ||
      (a.source || '').toLowerCase().includes(q)
    );
  }, [search, recentApplications]);

  return (
    <div className="bg-surface min-h-screen">
      <Sidebar />
      <TopBar onSearch={setSearch} />
      <main className="ml-64 pt-20 px-8 pb-12 min-h-screen">
        <StatsCards total={total} thisWeek={thisWeek} interviews={interviews} offers={offers} />
        <Charts total={total} statuses={statuses} sources={sources} />
        <RecentApplicationsTable applications={filteredApplications} searchQuery={search} />
      </main>
      <button onClick={() => setPage('applications')} className="fixed bottom-10 right-10 w-14 h-14 bg-primary rounded-full shadow-[0_8px_30px_rgba(204,255,0,0.3)] flex items-center justify-center text-on-primary hover:scale-110 active:scale-95 transition-all duration-200 z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
