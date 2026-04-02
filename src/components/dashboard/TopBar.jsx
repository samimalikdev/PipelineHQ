import React from 'react';
import useAuthStore from '../../store/useAuthStore';

export default function TopBar({ onSearch }) {
  const user = useAuthStore((s) => s.user);
  const initials = (user?.user_metadata?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-surface-container-low/80 backdrop-blur-xl flex justify-between items-center px-8 z-40 border-b border-outline-variant/20">
      <h2 className="font-headline text-xl font-bold text-white tracking-tight">Dashboard</h2>
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            className="bg-surface-container-highest/60 border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-on-surface-variant"
            placeholder="Search candidates, roles, status..."
            type="text"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_6px_rgba(204,255,0,0.8)]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-xs font-bold font-headline">{initials}</span>
        </div>
      </div>
    </header>
  );
}
