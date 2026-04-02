import { create } from 'zustand';
import useAuthStore from './useAuthStore';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const useNotesStore = create((set, get) => ({
  notes: [],
  activeNoteId: null,
  loading: false,
  saving: false,

  setActiveNoteId: (id) => set({ activeNoteId: id }),

  fetchNotes: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/notes`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        set({ notes: data, loading: false, activeNoteId: data[0]?.id ?? null });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      set({ loading: false });
    }
  },

  addNote: async (note) => {
    set({ saving: true });
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(note),
      });
      const newNote = await res.json();
      if (res.ok) {
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
          saving: false,
        }));
      } else {
        throw new Error(newNote.error);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
      set({ saving: false });
    }
  },

  updateNote: async (id, updates) => {
    set({ saving: true });
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      if (res.ok) {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? updated : n)),
          saving: false,
        }));
      } else {
        throw new Error(updated.error);
      }
    } catch (err) {
      console.error('Failed to update note:', err);
      set({ saving: false });
    }
  },

  deleteNote: async (id) => {
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        set((state) => {
          const remaining = state.notes.filter((n) => n.id !== id);
          return {
            notes: remaining,
            activeNoteId:
              state.activeNoteId === id
                ? (remaining[0]?.id ?? null)
                : state.activeNoteId,
          };
        });
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  },
}));

export default useNotesStore;
