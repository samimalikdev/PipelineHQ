import React, { useEffect } from 'react';
import useNavigationStore from '../../store/useNavigationStore';
import useAuthStore from '../../store/useAuthStore';
import useSettingsStore from '../../store/useSettingsStore';

const NAV_ITEMS = [
  { icon: 'dashboard',   label: 'Dashboard',    key: 'dashboard' },
  { icon: 'group',       label: 'Candidates',   key: 'applications' },
  { icon: 'analytics',   label: 'Analytics',    key: 'analytics' },
  { icon: 'description', label: 'Notes',        key: 'notes' },
  { icon: 'settings',    label: 'Settings',     key: 'settings' },
];

export default function Sidebar() {
  const { page, setPage } = useNavigationStore();
  
  const user = useAuthStore((state) => state.user);
  const profile = useSettingsStore((state) => state.profile);
  const fetchProfile = useSettingsStore((state) => state.fetchProfile);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=11";
  const userPlan = profile?.plan || 'Pro Plan';

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/5 bg-background/60 backdrop-blur-2xl z-50 h-screen fixed left-0 top-0">
      {}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <button
          onClick={() => setPage('landing')}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all">
            <span className="material-symbols-outlined text-primary text-base">radar</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-headline">
            PipelineHQ<span className="text-primary">.</span>
          </span>
        </button>
      </div>

      {}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] px-2 mb-3">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left font-label font-medium text-sm ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(204,255,0,0.05)]'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {}
      <div className="p-4 border-t border-white/5">
        <div className="glass-card rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all">
          <img
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/10 bg-white/5"
            src={avatarUrl}
            onError={(e) => { e.target.src = "https://i.pravatar.cc/150?img=11"; }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-white font-headline block truncate">
              {userName}
            </span>
            <span className="text-[11px] text-on-surface-variant font-label block truncate">
              {userPlan}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
