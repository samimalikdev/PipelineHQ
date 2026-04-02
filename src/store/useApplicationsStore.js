import { create } from 'zustand';
import useAuthStore from './useAuthStore';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const useApplicationsStore = create((set) => ({
  applications: [],
  loading: false,

  fetchApplications: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/applications`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        set({ applications: data, loading: false });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      set({ loading: false });
    }
  },

  addApplication: async (app) => {
    
    const tempId = `temp-${Date.now()}`;
    const optimisticApp = { ...app, id: tempId, created_at: new Date().toISOString() };
    
    set((state) => ({ applications: [optimisticApp, ...state.applications] }));

    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(app),
      });
      const newApp = await res.json();
      if (res.ok) {
        
        set((state) => ({ 
          applications: state.applications.map((a) => a.id === tempId ? newApp : a) 
        }));
      } else {
        throw new Error(newApp.error || 'Failed to add application');
      }
    } catch (error) {
      console.error('Failed to add app:', error);
      
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== tempId)
      }));
    }
  },

  deleteApplication: async (id) => {
    
    const appToDelete = useApplicationsStore.getState().applications.find(a => a.id === id);
    if (!appToDelete) return;

    set((state) => ({ applications: state.applications.filter((a) => a.id !== id) }));

    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
         throw new Error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting app:', error);
      
      set((state) => ({ applications: [...state.applications, appToDelete] }));
    }
  },

  updateApplication: async (id, updates) => {
    
    const originalApp = useApplicationsStore.getState().applications.find(a => a.id === id);
    if (!originalApp) return;

    const optimisticUpdatedApp = { ...originalApp, ...updates };
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? optimisticUpdatedApp : a)),
    }));

    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const updatedApp = await res.json();
      if (res.ok) {
        
        set((state) => ({
          applications: state.applications.map((a) => (a.id === id ? updatedApp : a)),
        }));
      } else {
         throw new Error(updatedApp.error || 'Failed to update application');
      }
    } catch (error) {
      console.error('Error updating app:', error);
      
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? originalApp : a)),
      }));
    }
  },
}));

export default useApplicationsStore;
