import { create } from 'zustand';
import useAuthStore from './useAuthStore';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const useSettingsStore = create((set, get) => ({
  profile: null,
  loading: false,
  saving: false,
  avatarUploading: false,
  passwordSaving: false,
  error: null,
  toast: null, 

  _showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ profile: data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  updateProfile: async (fields) => {
    set({ saving: true });
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ profile: data, saving: false });
      get()._showToast('Profile saved successfully!');
      return { success: true };
    } catch (err) {
      set({ saving: false });
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },

  uploadAvatar: async (file) => {
    set({ avatarUploading: true });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_URL}/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set((state) => ({
        avatarUploading: false,
        profile: { ...state.profile, avatar_url: data.avatar_url },
      }));
      get()._showToast('Avatar updated!');
      return { success: true };
    } catch (err) {
      set({ avatarUploading: false });
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },

  changePassword: async (newPassword) => {
    set({ passwordSaving: true });
    try {
      const res = await fetch(`${API_URL}/profile/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ passwordSaving: false });
      get()._showToast('Password updated successfully!');
      return { success: true };
    } catch (err) {
      set({ passwordSaving: false });
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },

  fetchMfaStatus: async () => {
    try {
      const res = await fetch(`${API_URL}/profile/mfa`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch MFA status');
      
      const allFactors = data?.totp || data?.all || (Array.isArray(data) ? data : []);
      const verifiedFactor = allFactors.find(f => f.status === 'verified');
      return { success: true, isEnabled: !!verifiedFactor, factorId: verifiedFactor?.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  disableMfa: async (factorId) => {
    try {
      const res = await fetch(`${API_URL}/profile/mfa/${factorId}`, { method: 'DELETE', headers: getHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to disable MFA');
      }
      get()._showToast('Two-Factor Authentication disabled');
      return { success: true };
    } catch (err) {
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },

  enrollMfa: async () => {
    try {
      const res = await fetch(`${API_URL}/profile/mfa/enroll`, { method: 'POST', headers: getHeaders() });
      const enrollData = await res.json();
      if (!res.ok) throw new Error(enrollData.error);
      
      const res2 = await fetch(`${API_URL}/profile/mfa/challenge`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ factorId: enrollData.id })
      });
      const challengeData = await res2.json();
      if (!res2.ok) throw new Error(challengeData.error);

      return {
        success: true,
        factorId: enrollData.id,
        qrCode: enrollData.totp.uri,
        secret: enrollData.totp.secret,
        challengeId: challengeData.id
      };
    } catch (err) {
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },

  verifyMfa: async (factorId, challengeId, code) => {
    try {
      const res = await fetch(`${API_URL}/profile/mfa/verify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ factorId, challengeId, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      get()._showToast('Two-Factor Authentication enabled successfully!');
      
      return { success: true };
    } catch (err) {
      get()._showToast('Invalid MFA Code', 'error');
      return { success: false, error: err.message };
    }
  },

  exportData: async () => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/profile/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipelinehq-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      get()._showToast('Data exported successfully!');
    } catch (err) {
      get()._showToast(err.message, 'error');
    }
  },

  deleteAccount: async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      useAuthStore.getState().logout();
      return { success: true };
    } catch (err) {
      get()._showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  },
}));

export default useSettingsStore;
