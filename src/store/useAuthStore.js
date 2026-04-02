import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  mfaChallenge: null, 

  initialize: () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      
      set({ token: storedToken, user: JSON.parse(storedUser), loading: false });
    } else {
      set({ user: null, token: null, loading: false });
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(session.user));
        set({ user: session.user, token: session.access_token, loading: false });
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { user, session } = data;

      let factors = [];
      if (Array.isArray(user.factors)) {
        factors = user.factors;
      } else if (user.factors?.totp) {
        factors = user.factors.totp;
      }
      
      console.log('[MFA DEBUG] user.factors raw:', user.factors);
      console.log('[MFA DEBUG] normalized factors:', factors);
      
      const verifiedFactor = factors.find(f => f.status === 'verified' && f.factor_type === 'totp');
      console.log('[MFA DEBUG] verifiedFactor:', verifiedFactor);

      if (verifiedFactor) {
        set({ loading: false, mfaChallenge: { factorId: verifiedFactor.id, tempToken: session.access_token } });
        return { success: true, mfaRequired: true };
      }

      localStorage.setItem('token', session.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: session.access_token, loading: false, mfaChallenge: null });
      return { success: true, mfaRequired: false };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  verifyLoginMfa: async (code) => {
    set({ loading: true });
    try {
      
      const { mfaChallenge } = useAuthStore.getState();
      const { factorId, tempToken } = mfaChallenge;

      const challengeRes = await fetch(`${API_URL}/profile/mfa/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ factorId })
      });
      const challengeData = await challengeRes.json();
      if (!challengeRes.ok) throw new Error(challengeData.error || 'Failed to challenge factor');

      const verifyRes = await fetch(`${API_URL}/profile/mfa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ factorId, challengeId: challengeData.id, code })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Invalid code');

      const newSession = verifyData.access_token || tempToken;
      const updatedUser = verifyData.user || {};
      
      localStorage.setItem('token', newSession);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, token: newSession, loading: false, mfaChallenge: null });
      
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, error: err.message };
    }
  },

  register: async (email, password, name) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { user, session } = data;
      if (session) {
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token: session.access_token, loading: false });
        return { success: true };
      } else if (user && user.identities && user.identities.length === 0) {
        
        set({ loading: false });
        return { success: false, error: 'Email already registered. Try signing in instead.' };
      } else {
        
        set({ loading: false });
        return { success: false, error: 'Account created! Please verify your email to log in.' };
      }
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, mfaChallenge: null });
  },

  clearMfaChallenge: () => set({ mfaChallenge: null }),
}));

export default useAuthStore;
