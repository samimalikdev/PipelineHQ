import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import useNotesStore from '../store/useNotesStore';

const STATUS_COLORS = {
  'INTERVIEW':     'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  'TECHNICAL TEST':'bg-purple-400/10 text-purple-400 border-purple-400/20',
  'OFFER':         'bg-primary/10 text-primary border-primary/30',
  'APPLIED':       'bg-white/5 text-on-surface-variant border-white/10',
  'REJECTED':      'bg-red-400/10 text-red-400 border-red-400/20',
  'GHOSTED':       'bg-black/40 text-on-surface-variant/50 border-white/5',
};
const STATUSES = ['APPLIED', 'INTERVIEW', 'TECHNICAL TEST', 'OFFER', 'REJECTED', 'GHOSTED'];

function BulletListInput({ label, color = 'primary', items, onChange }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest mb-3 pl-1 font-label"
        style={{ color: color === 'primary' ? '#ccff00' : '#67e8f9' }}>
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-[14px] flex-shrink-0 ${color === 'primary' ? 'bg-primary' : 'bg-cyan-400'}`}></span>
            <input
              className="glass-input flex-1 rounded-xl px-4 py-3 text-sm text-white"
              placeholder="Add bullet point..."
              value={item}
              onChange={(e) => { const u = [...items]; u[i] = e.target.value; onChange(u); }}
            />
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="mt-2 p-1.5 rounded-lg hover:bg-red-400/10 hover:text-red-400 text-on-surface-variant/40 transition-colors">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ''])}
          className={`flex items-center gap-2 text-xs font-bold font-label mt-1 ml-4 transition-colors ${color === 'primary' ? 'text-primary/60 hover:text-primary' : 'text-cyan-400/60 hover:text-cyan-400'}`}>
          <span className="material-symbols-outlined text-[16px]">add</span>Add bullet
        </button>
      </div>
    </div>
  );
}

const BLANK_FORM = { company: '', role: '', location: '', status: 'INTERVIEW', intro: '', tip: '' };

function NoteDrawer({ open, onClose, editNote = null }) {
  const { addNote, updateNote, saving } = useNotesStore();
  const [form, setForm] = useState(BLANK_FORM);
  const [takeaways, setTakeaways] = useState(['']);
  const [questions, setQuestions] = useState(['']);

  useEffect(() => {
    if (editNote) {
      setForm({
        company:  editNote.company  || '',
        role:     editNote.role     || '',
        location: editNote.location || '',
        status:   editNote.status   || 'INTERVIEW',
        intro:    editNote.intro    || '',
        tip:      editNote.tip      || '',
      });
      setTakeaways(editNote.takeaways?.length ? editNote.takeaways : ['']);
      setQuestions(editNote.questions?.length ? editNote.questions : ['']);
    } else {
      setForm(BLANK_FORM);
      setTakeaways(['']);
      setQuestions(['']);
    }
  }, [editNote, open]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSave() {
    if (!form.company.trim() || !form.intro.trim()) return;
    const payload = {
      ...form,
      takeaways: takeaways.filter(t => t.trim()),
      questions: questions.filter(q => q.trim()),
    };
    if (editNote) {
      await updateNote(editNote.id, payload);
    } else {
      await addNote(payload);
    }
    onClose();
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`absolute right-0 top-0 h-full w-[560px] bg-surface-container-low shadow-2xl transition-transform duration-300 flex flex-col border-l border-white/5 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="p-8 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-white/[0.01]">
          <div>
            <h2 className="text-2xl font-headline font-bold text-white">{editNote ? 'Edit Note' : 'New Note'}</h2>
            <p className="text-[11px] text-on-surface-variant mt-1 font-label">Structured interview & candidate notes</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-7">
          <div>
            <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-2 pl-1 font-label">Candidate / Company Name *</label>
            <input className="glass-input w-full rounded-xl p-4 text-base font-bold text-white font-headline" placeholder="e.g. Marcus Sterling" value={form.company} onChange={set('company')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 pl-1 font-label">Role</label>
              <input className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white" placeholder="e.g. Product Designer" value={form.role} onChange={set('role')} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 pl-1 font-label">Location</label>
              <input className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white" placeholder="e.g. Remote" value={form.location} onChange={set('location')} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 pl-1 font-label">Interview Stage</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all font-label ${form.status === s ? STATUS_COLORS[s] : 'bg-white/5 border-white/10 text-on-surface-variant hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[10px] uppercase tracking-luxury font-bold text-on-surface-variant/30 font-label">Note Content</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 pl-1 font-label">Summary / Overview *</label>
            <textarea className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white leading-relaxed resize-none h-28 font-label"
              placeholder="Briefly describe the interview or interaction..."
              value={form.intro} onChange={set('intro')} />
            <div className="h-[2px] w-12 bg-primary mt-3 ml-1 rounded-full"></div>
          </div>

          <BulletListInput label="Key Takeaways" color="primary" items={takeaways} onChange={setTakeaways} />
          <BulletListInput label="Questions for Next Round" color="cyan" items={questions} onChange={setQuestions} />

          <div>
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 pl-1 font-label">Recruiter Tip (Optional)</label>
            <div className="border-l-4 border-cyan-400/50 bg-surface-container-highest/50 rounded-r-xl px-5 py-4">
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 font-label">RECRUITER TIP</p>
              <textarea className="w-full bg-transparent text-sm text-on-surface-variant italic font-label leading-relaxed resize-none outline-none h-16 placeholder-on-surface-variant/30"
                placeholder={`"A key insight about this candidate or company..."`}
                value={form.tip} onChange={set('tip')} />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex gap-4 flex-shrink-0 bg-white/[0.01]">
          <button onClick={handleSave} disabled={saving}
            className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-bold font-label text-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? (
              <><div className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin"></div>Saving...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">task_alt</span>{editNote ? 'Update Note' : 'Save Note'}</>
            )}
          </button>
          <button onClick={onClose} className="flex-1 px-6 py-4 rounded-xl font-bold font-label text-sm text-on-surface-variant hover:text-white border border-white/10 hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Notes() {
  const { notes, activeNoteId, setActiveNoteId, fetchNotes, deleteNote, loading } = useNotesStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    return (n.company || '').toLowerCase().includes(q)
      || (n.role || '').toLowerCase().includes(q)
      || (n.intro || '').toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function openAdd() { setEditNote(null); setDrawerOpen(true); }
  function openEdit(note) { setEditNote(note); setDrawerOpen(true); }

  async function handleDelete() {
    if (!activeNote) return;
    await deleteNote(activeNote.id);
    setConfirmDelete(false);
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none"></div>
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-background/80 backdrop-blur-xl z-20">
          <h2 className="font-headline text-xl font-bold text-white">Notes</h2>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input className="glass-input w-full h-9 pl-10 pr-4 rounded-full text-sm text-white placeholder-on-surface-variant/50"
                placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAdd} className="bg-primary text-on-primary h-9 px-4 rounded-full font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 transition-all font-label">
              <span className="material-symbols-outlined text-lg">add</span>Add Note
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {}
          <section className="w-[300px] flex-shrink-0 bg-surface-container-low border-r border-white/5 flex flex-col overflow-hidden">
            <div className="px-5 pt-5 pb-2">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest font-label">Notes ({filtered.length})</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-on-surface-variant">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-xs font-label">Loading notes...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">description</span>
                  <p className="text-sm font-label">{search ? 'No results' : 'No notes yet'}</p>
                  {!search && <button onClick={openAdd} className="mt-3 text-primary text-xs font-bold font-label hover:underline">+ Add your first note</button>}
                </div>
              ) : (
                <>
                  {paginated.map((note) => {
                    const isActive = note.id === activeNoteId;
                    return (
                      <div key={note.id} onClick={() => setActiveNoteId(note.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-surface-container-highest border-l-[3px] border-primary' : 'hover:bg-surface-container border border-transparent hover:border-white/5'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold text-sm font-headline truncate ${isActive ? 'text-white' : 'text-white/80'}`}>{note.company}</h3>
                          <span className="text-[10px] text-on-surface-variant flex-shrink-0 ml-2">{formatDate(note.updated_at || note.created_at)}</span>
                        </div>
                        <p className={`text-xs font-label mb-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{note.role || 'No role'}</p>
                        <p className="text-xs text-on-surface-variant/70 line-clamp-2 leading-relaxed font-label">{note.intro}</p>
                      </div>
                    );
                  })}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center px-2 mb-2 mt-4 text-xs font-label text-on-surface-variant font-bold">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="hover:text-white disabled:opacity-30 disabled:hover:text-on-surface-variant text-on-surface-variant transition-colors p-2">Prev</button>
                      <span className="bg-surface-container-highest px-3 py-1 rounded-full">{page} / {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="hover:text-white disabled:opacity-30 disabled:hover:text-on-surface-variant text-on-surface-variant transition-colors p-2">Next</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {}
          <section className="flex-1 bg-surface flex flex-col relative overflow-hidden">
            {!activeNote ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">description</span>
                  <p className="font-label mb-3">Select a note to view</p>
                  <button onClick={openAdd} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm font-label hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all">
                    + New Note
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="px-10 py-8 border-b border-white/5 flex-shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-headline font-extrabold tracking-tight text-white">{activeNote.company}</h2>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold border tracking-wider font-label ${STATUS_COLORS[activeNote.status] || STATUS_COLORS['APPLIED']}`}>{activeNote.status}</span>
                      </div>
                      <p className="text-base text-on-surface-variant font-label">
                        {activeNote.role}{activeNote.location && <span className="text-on-surface-variant/50"> • {activeNote.location}</span>}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-6">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label font-bold">Updated</p>
                      <p className="text-sm font-semibold text-white font-label">{formatDate(activeNote.updated_at || activeNote.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-8 pb-28 max-w-4xl w-full">
                  <p className="text-base leading-relaxed text-on-surface-variant mb-6 font-label">{activeNote.intro}</p>

                  {activeNote.takeaways?.length > 0 && (<>
                    <div className="h-px w-16 bg-primary mb-8"></div>
                    <h4 className="text-lg font-bold text-white mb-4 font-headline">Key Takeaways</h4>
                    <ul className="space-y-4 mb-10">
                      {activeNote.takeaways.map((t, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span className="text-on-surface-variant font-label text-sm leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </>)}

                  {activeNote.questions?.length > 0 && (<>
                    <h4 className="text-lg font-bold text-white mb-4 font-headline">Questions for Next Round</h4>
                    <ul className="space-y-4 mb-10">
                      {activeNote.questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                          <span className="text-on-surface-variant font-label text-sm leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </>)}

                  {activeNote.tip && (
                    <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-cyan-400">
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 font-label">Recruiter Tip</p>
                      <p className="text-on-surface-variant text-sm italic font-label leading-relaxed">"{activeNote.tip}"</p>
                    </div>
                  )}
                </div>

                <footer className="absolute bottom-0 left-0 right-0 p-5 bg-surface/90 backdrop-blur-md border-t border-white/5 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(activeNote)} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all flex items-center gap-2 font-label">
                      <span className="material-symbols-outlined text-[18px]">edit</span>Edit Note
                    </button>
                    <button onClick={() => setConfirmDelete(true)} className="text-on-surface-variant hover:text-red-400 transition-colors px-4 py-2.5 rounded-xl border border-white/10 hover:border-red-400/30 text-sm font-semibold flex items-center gap-2 font-label">
                      <span className="material-symbols-outlined text-[18px]">delete</span>Delete
                    </button>
                  </div>
                </footer>

                {}
                {confirmDelete && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="bg-surface-container-low border border-white/10 rounded-2xl p-8 w-80 text-center">
                      <span className="material-symbols-outlined text-4xl text-red-400 mb-4 block">delete_forever</span>
                      <h3 className="font-headline font-bold text-white text-lg mb-2">Delete Note?</h3>
                      <p className="text-on-surface-variant text-sm font-label mb-6">This action cannot be undone.</p>
                      <div className="flex gap-3">
                        <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:text-white text-sm font-bold font-label transition-colors">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold font-label transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <NoteDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} editNote={editNote} />
    </div>
  );
}
