import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '../components/shared/Sidebar';
import useApplicationsStore from '../store/useApplicationsStore';
import useAuthStore from '../store/useAuthStore';
import { getAvatarStyle } from '../data/initialApplications';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

const FILTERS = ['All', 'Applied', 'Interview', 'Technical Test', 'Offer', 'Rejected', 'Ghosted'];

const STATUS_STYLES = {
  'Interview':      'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  'Technical Test': 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  'Offer':          'bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(204,255,0,0.1)]',
  'Rejected':       'bg-red-400/10 text-red-400 border-red-400/20',
  'Applied':        'bg-white/5 text-on-surface-variant border-white/10',
  'Ghosted':        'bg-black/40 text-on-surface-variant/50 border-white/5',
};

const STATUS_ICONS = {
  'Applied':        'send',
  'Interview':      'record_voice_over',
  'Technical Test': 'code',
  'Offer':          'verified',
  'Rejected':       'cancel',
  'Ghosted':        'visibility_off',
};

function StatusDropdown({ appId, currentStatus }) {
  const updateApplication = useApplicationsStore((s) => s.updateApplication);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        (!menuRef.current || !menuRef.current.contains(e.target))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((o) => !o);
  }

  async function pick(status) {
    if (status === currentStatus) { setOpen(false); return; }
    setSaving(true);
    await updateApplication(appId, { status });
    setSaving(false);
    setOpen(false);
  }

  return (
    <>
      <button ref={btnRef} onClick={handleToggle}
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border font-label inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer select-none ${STATUS_STYLES[currentStatus] || STATUS_STYLES['Applied']}`}>
        {saving ? (
          <div className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin"></div>
        ) : (
          (currentStatus === 'Offer' || currentStatus === 'Interview') && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
        )}
        {currentStatus}
        <span className="material-symbols-outlined text-[12px] opacity-60">expand_more</span>
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          className="bg-surface-container-low border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[168px] animate-in fade-in slide-in-from-top-1 duration-150">
          {FILTERS.slice(1).map((s) => (
            <button key={s} onClick={() => pick(s)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold font-label uppercase tracking-wider transition-colors ${
                s === currentStatus ? 'bg-white/5 text-white' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}>
              <span className="material-symbols-outlined text-[14px]">{STATUS_ICONS[s]}</span>
              {s}
              {s === currentStatus && <span className="material-symbols-outlined text-[14px] ml-auto text-primary">check</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

const BLANK_FORM = {
  candidate: '', role: '', location: 'Remote', status: 'Applied',
  source: 'LinkedIn', salary: '', date: new Date().toISOString().substring(0, 10),
  resume: '', portfolio: '',
};

function getSourceIcon(source) {
  if (source?.includes('LinkedIn')) return 'link';
  if (source?.includes('Referral')) return 'group';
  if (source?.includes('Direct'))   return 'public';
  return 'work';
}

function formatDate(ds) {
  if (!ds) return '';
  return new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CandidateDrawer({ open, onClose, editApp = null }) {
  const { addApplication, updateApplication } = useApplicationsStore();
  const [saving, setSaving] = useState(false);
  const [resumeMode, setResumeMode] = useState('link');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);

  useEffect(() => {
    if (editApp) {
      setForm({
        candidate: editApp.candidate || '',
        role:      editApp.role      || '',
        location:  editApp.location  || 'Remote',
        status:    editApp.status    || 'Applied',
        source:    editApp.source    || 'LinkedIn',
        salary:    editApp.salary    || '',
        date:      editApp.date ? new Date(editApp.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        resume:    editApp.resume    || '',
        portfolio: editApp.portfolio || '',
      });
      setResumeFileName('');
      setResumeFile(null);
      setResumeMode('link');
    } else {
      setForm(BLANK_FORM);
      setResumeFileName('');
      setResumeFile(null);
      setResumeMode('link');
    }
  }, [editApp, open]);

  function handleResumeFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setResumeFile(file);
    setForm((p) => ({ ...p, resume: 'pending-upload' }));
  }

  async function handleSave() {
    if (!form.candidate.trim() || !form.role.trim()) return;
    setSaving(true);
    let finalForm = { ...form };

    if (resumeMode === 'upload' && resumeFile) {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      try {
        const token = useAuthStore.getState().token;
        const res = await fetch(`${API_URL}/upload-resume`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          finalForm.resume = data.url;
        } else {
          console.error('Failed to upload resume:', data);
          finalForm.resume = ''; 
        }
      } catch (err) {
        console.error('Failed to upload resume:', err);
        finalForm.resume = '';
      }
    }

    if (editApp) {
      await updateApplication(editApp.id, finalForm);
    } else {
      await addApplication(finalForm);
    }
    setSaving(false);
    onClose();
  }

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex justify-end transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`w-[480px] h-full flex flex-col glass-card border-y-0 border-r-0 border-l border-white/10 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-2xl font-headline font-bold text-white tracking-tight">{editApp ? 'Edit Candidate' : 'Add Candidate'}</h3>
            <p className="text-xs text-on-surface-variant mt-1 font-label">Track your incoming talent pipeline</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-colors text-on-surface-variant hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-5">
          {[{ label: 'Candidate Name', id: 'candidate', placeholder: 'e.g. Sarah Jenkins' }, { label: 'Role Applied For', id: 'role', placeholder: 'e.g. Lead Product Designer' }].map((f) => (
            <div key={f.id}>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">{f.label} *</label>
              <input className="glass-input w-full rounded-xl p-4 text-sm text-white" placeholder={f.placeholder} value={form[f.id]} onChange={set(f.id)} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Location</label>
              <select className="glass-input w-full rounded-xl p-4 text-sm appearance-none cursor-pointer" value={form.location} onChange={set('location')}>
                {['Remote', 'Hybrid', 'Onsite'].map((o) => <option key={o} className="bg-surface">{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Status</label>
              <select className="glass-input w-full rounded-xl p-4 text-sm appearance-none cursor-pointer" value={form.status} onChange={set('status')}>
                {FILTERS.slice(1).map((o) => <option key={o} className="bg-surface">{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Source</label>
              <select className="glass-input w-full rounded-xl p-4 text-sm appearance-none cursor-pointer" value={form.source} onChange={set('source')}>
                {['LinkedIn', 'Direct Website', 'Referral', 'Job Board'].map((o) => <option key={o} className="bg-surface">{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Salary Estimate</label>
              <input className="glass-input w-full rounded-xl p-4 text-sm text-white" placeholder="e.g. Rs 140k" value={form.salary} onChange={set('salary')} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Sourced Date</label>
            <input type="date" className="glass-input w-full rounded-xl p-4 text-sm [color-scheme:dark] text-white" value={form.date} onChange={set('date')} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[10px] uppercase tracking-luxury font-bold text-on-surface-variant/50">Optional Links</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 pl-1 font-label">Portfolio / Website URL</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">language</span>
              <input type="url" className="glass-input w-full rounded-xl pl-10 pr-4 py-4 text-sm text-white" placeholder="https://portfolio.com" value={form.portfolio} onChange={set('portfolio')} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between pl-1 mb-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant font-label">Resume / CV</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 gap-0.5">
                {['link', 'upload'].map((mode) => (
                  <button key={mode} type="button"
                    onClick={() => { setResumeMode(mode); setForm(p => ({ ...p, resume: '' })); setResumeFileName(''); setResumeFile(null); }}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${resumeMode === mode ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-white'}`}>
                    {mode === 'link' ? '🔗 Paste Link' : '📁 Upload File'}
                  </button>
                ))}
              </div>
            </div>
            {resumeMode === 'link' ? (
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">picture_as_pdf</span>
                <input type="url" className="glass-input w-full rounded-xl pl-10 pr-4 py-4 text-sm text-white" placeholder="https://drive.google.com/your-cv" value={form.resume} onChange={set('resume')} />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 hover:border-primary/40 rounded-xl cursor-pointer bg-white/[0.02] hover:bg-primary/[0.03] transition-all group">
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeFile} />
                {resumeFileName ? (
                  <div className="flex items-center gap-2 px-4">
                    <span className="material-symbols-outlined text-primary text-2xl">task</span>
                    <div>
                      <p className="text-xs font-bold text-primary font-label truncate max-w-[280px]">{resumeFileName}</p>
                      <p className="text-[10px] text-on-surface-variant font-label">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-on-surface-variant group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">upload_file</span>
                    <p className="text-xs font-label font-bold">Click to upload PDF or DOC</p>
                  </div>
                )}
              </label>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-white/10 bg-white/[0.02] flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-sm font-bold border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors text-on-surface-variant font-label">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.candidate.trim() || !form.role.trim()}
            className="flex-[2] py-4 text-sm font-bold bg-primary text-on-primary rounded-xl hover:shadow-[0_0_25px_rgba(204,255,0,0.3)] transition-all active:scale-95 font-label disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {saving ? (
              <><div className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin"></div>Saving...</>
            ) : (
              <>{editApp ? 'Update Candidate' : 'Save Candidate'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  const { applications, fetchApplications, deleteApplication, loading } = useApplicationsStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  useEffect(() => { setPage(1); }, [activeFilter, search]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...applications]
      .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
      .filter((a) => {
        const matchFilter = activeFilter === 'All' || a.status === activeFilter;
        return matchFilter && ((a.candidate || '').toLowerCase().includes(q) || (a.role || '').toLowerCase().includes(q));
      });
  }, [applications, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE), [filtered, page]);

  function openAdd() { setEditApp(null); setDrawerOpen(true); }
  function openEdit(app) { setEditApp(app); setDrawerOpen(true); }
  async function handleDelete() {
    if (!confirmDeleteId) return;
    await deleteApplication(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="fixed inset-0 noise-overlay z-0 pointer-events-none opacity-[0.025]"></div>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0 bg-background/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ethereal-glow -z-10 pointer-events-none"></div>

        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background/50 backdrop-blur-xl z-20">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-white">Talent Pipeline</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input className="glass-input w-64 h-10 pl-10 pr-4 rounded-full text-sm text-white placeholder-on-surface-variant/70"
                placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <button onClick={openAdd} className="bg-primary text-on-primary h-10 px-5 rounded-full font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-label">
                <span className="material-symbols-outlined text-lg">person_add</span>New Candidate
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="flex flex-col h-full gap-6">

            {}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
              {FILTERS.map((f) => {
                const count = f === 'All' ? applications.length : applications.filter((a) => a.status === f).length;
                const isActive = activeFilter === f;
                return (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className={`px-5 py-2 rounded-full text-sm font-label font-medium whitespace-nowrap transition-all ${isActive ? 'bg-primary/10 border border-primary/50 text-primary shadow-[0_0_15px_rgba(204,255,0,0.1)] font-bold' : 'bg-white/5 border border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 backdrop-blur-md'}`}>
                    {f} <span className={isActive ? 'opacity-100' : 'opacity-50'}>({count})</span>
                  </button>
                );
              })}
            </div>

            {}
            <div className="glass-card rounded-3xl overflow-hidden flex flex-col shadow-2xl flex-1">
              {loading ? (
                <div className="flex-1 flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-on-surface-variant font-label text-sm">Loading candidates...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-on-surface-variant/70 font-label">
                        <th className="py-4 pl-6 w-12"><input type="checkbox" className="rounded bg-white/5 border-white/20 text-primary focus:ring-primary cursor-pointer" /></th>
                        <th className="py-4 px-4 font-semibold">Candidate Name</th>
                        <th className="py-4 px-4 font-semibold">Role Applied For</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 font-semibold">Source</th>
                        <th className="py-4 px-4 font-semibold">Salary</th>
                        <th className="py-4 px-4 font-semibold">Location</th>
                        <th className="py-4 px-4 font-semibold">Sourced Date</th>
                        <th className="py-4 pr-6 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filtered.length === 0 ? (
                        <tr><td colSpan={9} className="py-20 text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-5xl mb-4 opacity-30 block font-light">inbox</span>
                          <p className="text-lg font-label mb-3">{search || activeFilter !== 'All' ? 'No candidates match your filter.' : 'No candidates yet.'}</p>
                          {!search && activeFilter === 'All' && (
                            <button onClick={openAdd} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm font-label hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all">
                              + Add First Candidate
                            </button>
                          )}
                        </td></tr>
                      ) : paginated.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.025] transition-colors group border-b border-white/5 last:border-0">
                          <td className="py-4 pl-6"><input type="checkbox" className="rounded bg-white/5 border-white/20 text-primary focus:ring-primary cursor-pointer" /></td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getAvatarStyle(app.candidate).bg} ${getAvatarStyle(app.candidate).border}`}>
                                <span className={`font-headline font-extrabold text-base ${getAvatarStyle(app.candidate).text}`}>{app.candidate ? app.candidate[0] : 'U'}</span>
                              </div>
                              <span className="font-bold text-sm text-white font-headline">{app.candidate}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-label font-medium text-white/80 group-hover:text-primary transition-colors">{app.role}</td>
                          <td className="py-4 px-4">
                            <StatusDropdown appId={app.id} currentStatus={app.status} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label">
                              <span className="material-symbols-outlined text-[16px]">{getSourceIcon(app.source)}</span>
                              {app.source}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-mono text-primary/80">{app.salary || '—'}</td>
                          <td className="py-4 px-4 text-sm text-on-surface-variant font-label">{app.location || '—'}</td>
                          <td className="py-4 px-4 text-sm text-on-surface-variant font-label">{formatDate(app.date || app.created_at)}</td>
                          <td className="py-4 pr-6 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {app.portfolio && (
                                <button onClick={() => window.open(app.portfolio, '_blank')} title="View Portfolio"
                                  className="p-1.5 hover:bg-cyan-400/10 hover:text-cyan-400 rounded-lg text-on-surface-variant transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">language</span>
                                </button>
                              )}
                              {app.resume && (
                                <button onClick={() => window.open(app.resume, '_blank')} title="View Resume"
                                  className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg text-on-surface-variant transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                                </button>
                              )}
                              <button onClick={() => openEdit(app)} title="Edit"
                                className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg text-on-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button onClick={() => setConfirmDeleteId(app.id)} title="Delete"
                                className="p-1.5 hover:bg-red-400/10 hover:text-red-400 rounded-lg text-on-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {}
              <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 mt-auto">
                <span className="text-xs text-on-surface-variant font-label">
                  Showing <span className="text-white font-bold">{filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}</span>–<span className="text-white font-bold">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="text-white font-bold">{filtered.length}</span> candidates
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    if (totalPages > 7) {
                      if (i === 0 || i === totalPages - 1 || (i >= page - 2 && i <= page)) {
                        
                      } else if (i === page - 3 || i === page + 1) {
                        return <span key={i} className="text-on-surface-variant/50 px-1">...</span>;
                      } else {
                        return null;
                      }
                    }
                    return (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${page === i + 1 ? 'bg-primary/20 text-primary border border-primary/30' : 'text-on-surface-variant hover:bg-white/10 hover:text-white'}`}>
                        {i + 1}
                      </button>
                    )
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="bg-surface-container-low border border-white/10 rounded-2xl p-8 w-80 text-center">
            <span className="material-symbols-outlined text-4xl text-red-400 mb-4 block">delete_forever</span>
            <h3 className="font-headline font-bold text-white text-lg mb-2">Delete Candidate?</h3>
            <p className="text-on-surface-variant text-sm font-label mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:text-white text-sm font-bold font-label transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold font-label transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      <CandidateDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} editApp={editApp} />
    </div>
  );
}
