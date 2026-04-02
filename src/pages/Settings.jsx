import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '../components/shared/Sidebar';
import useSettingsStore from '../store/useSettingsStore';
import useAuthStore from '../store/useAuthStore';
import useNavigationStore from '../store/useNavigationStore';

const TABS = [
  { icon: 'person',               label: 'Profile' },
  { icon: 'security',             label: 'Account & Security' },
  { icon: 'lock_person',          label: 'Data & Privacy' },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? 'bg-primary shadow-[0_0_10px_rgba(204,255,0,0.4)]' : 'bg-white/10'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        style={checked ? { backgroundColor: '#141a00' } : { backgroundColor: 'white' }}
      />
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-on-surface-variant/50 italic px-1 font-label">{hint}</p>}
    </div>
  );
}

function Spinner({ size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <span className={`inline-block ${s} border-2 border-primary/30 border-t-primary rounded-full animate-spin`} />
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-bottom-4 duration-300 ${isError ? 'bg-red-950/90 border-red-400/30 text-red-300' : 'bg-surface-container-highest border-primary/20 text-white'}`}>
      <span className={`material-symbols-outlined text-lg ${isError ? 'text-red-400' : 'text-primary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <span className="text-sm font-semibold font-label">{toast.message}</span>
    </div>
  );
}

function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-highest border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-400/20 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-2xl text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-white font-headline text-center mb-2">Delete Account?</h3>
        <p className="text-sm text-on-surface-variant font-label text-center mb-6">
          This will permanently delete your profile and all data. This action <strong className="text-white">cannot be undone</strong>.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-white/10 text-on-surface-variant text-sm font-bold rounded-xl hover:bg-white/5 transition-colors font-label">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-3 bg-error/20 text-error border border-error/30 text-sm font-bold rounded-xl hover:bg-error/30 transition-colors font-label flex items-center justify-center gap-2">
            {loading ? <Spinner /> : <><span className="material-symbols-outlined text-base">delete</span>Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { profile, saving, avatarUploading, updateProfile, uploadAvatar } = useSettingsStore();
  const avatarInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '',
    job_title: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        job_title: profile.job_title || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    await updateProfile(form);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
  };

  const avatarSrc = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=ccff00&color=141a00&size=200`;

  return (
    <div className="space-y-10">
      {}
      <div className="flex items-end gap-8 bg-surface-container-low p-8 rounded-2xl relative overflow-hidden border border-white/5">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          {avatarUploading ? (
            <div className="w-28 h-28 rounded-full border-4 border-surface-container-highest shadow-2xl bg-white/5 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <img
              alt="Profile"
              src={avatarSrc}
              className="w-28 h-28 rounded-full object-cover border-4 border-surface-container-highest shadow-2xl"
            />
          )}
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:shadow-[0_0_12px_rgba(204,255,0,0.4)] transition-all"
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="flex flex-col gap-3 pb-2">
          <h3 className="text-lg font-bold text-white font-headline">Profile Picture</h3>
          <div className="flex gap-3">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="px-5 py-2 bg-surface-container-highest text-white text-sm font-bold rounded-lg hover:bg-surface-bright transition-colors font-label"
            >
              Change photo
            </button>
          </div>
          <p className="text-xs text-on-surface-variant font-label">Recommended: 400×400px. JPG, PNG or GIF. Max 5 MB.</p>
        </div>
      </div>

      {}
      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Full Name">
            <input className="glass-input w-full rounded-xl p-4 text-sm text-white" value={form.full_name} onChange={set('full_name')} placeholder="Your full name" />
          </Field>
          <Field label="Job Title">
            <input className="glass-input w-full rounded-xl p-4 text-sm text-white" value={form.job_title} onChange={set('job_title')} placeholder="e.g. Senior Product Designer" />
          </Field>
        </div>
        <Field label="Email Address" hint="Email changes require verified authentication.">
          <div className="relative">
            <input className="glass-input w-full rounded-xl p-4 text-sm text-on-surface-variant cursor-not-allowed pr-12" readOnly value={profile?.email || ''} />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">lock</span>
          </div>
        </Field>
        <Field label="Location">
          <input className="glass-input w-full rounded-xl p-4 text-sm text-white" value={form.location} onChange={set('location')} placeholder="e.g. San Francisco, CA" />
        </Field>
        <Field label="Bio / About">
          <textarea className="glass-input w-full rounded-xl p-4 text-sm text-white leading-relaxed resize-none" rows={4} value={form.bio} onChange={set('bio')} placeholder="Brief professional bio..." />
        </Field>
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-on-surface-variant font-label max-w-xs">Changes sync to your public career profile.</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 bg-primary text-on-primary font-bold text-sm rounded-full hover:shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:scale-[1.02] active:scale-95 transition-all font-label disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <Spinner /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

    </div>
  );
}

function SecurityTab() {
  const { changePassword, passwordSaving, enrollMfa, verifyMfa, fetchMfaStatus, disableMfa } = useSettingsStore();
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [mfaState, setMfaState] = useState({ step: 'idle', loading: true, qrCode: '', secret: '', challengeId: '', code: '', factorId: null });

  useEffect(() => {
    const checkMfa = async () => {
      const res = await fetchMfaStatus();
      if (res.success && res.isEnabled) {
        setMfaState(p => ({ ...p, step: 'enabled', loading: false, factorId: res.factorId }));
      } else {
        setMfaState(p => ({ ...p, step: 'idle', loading: false }));
      }
    };
    checkMfa();
  }, [fetchMfaStatus]);

  const handleEnableMfa = async () => {
    setMfaState(p => ({ ...p, loading: true }));
    const res = await enrollMfa();
    if (res.success) {
      setMfaState(p => ({ ...p, step: 'enrolling', loading: false, qrCode: res.qrCode, secret: res.secret, challengeId: res.challengeId, factorId: res.factorId }));
    } else {
      setMfaState(p => ({ ...p, loading: false }));
    }
  };

  const handleDisableMfa = async () => {
    if (!mfaState.factorId) return;
    setMfaState(p => ({ ...p, loading: true }));
    const res = await disableMfa(mfaState.factorId);
    if (res.success) {
      setMfaState({ step: 'idle', loading: false, qrCode: '', secret: '', challengeId: '', code: '', factorId: null });
    } else {
      setMfaState(p => ({ ...p, loading: false }));
    }
  };

  const handleVerifyMfa = async () => {
    setMfaState(p => ({ ...p, loading: true }));
    const res = await verifyMfa(mfaState.factorId, mfaState.challengeId, mfaState.code);
    if (res.success) {
      setMfaState(p => ({ ...p, step: 'enabled', loading: false }));
    } else {
      setMfaState(p => ({ ...p, loading: false }));
    }
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!passwords.newPass) return setPwError('New password is required.');
    if (passwords.newPass.length < 6) return setPwError('Password must be at least 6 characters.');
    if (passwords.newPass !== passwords.confirm) return setPwError('Passwords do not match.');

    const result = await changePassword(passwords.newPass);
    if (result.success) {
      setPasswords({ current: '', newPass: '', confirm: '' });
    }
  };

  const pwFields = [
    { key: 'current', label: 'Current Password' },
    { key: 'newPass', label: 'New Password' },
    { key: 'confirm', label: 'Confirm New Password' },
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      {}
      <div className="space-y-4 bg-surface-container-low p-6 rounded-2xl border border-white/5">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-label">Change Password</h3>
        {pwFields.map((f) => (
          <Field key={f.key} label={f.label}>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="glass-input w-full rounded-xl p-4 pr-12 text-sm text-white"
                placeholder="••••••••"
                value={passwords[f.key]}
                onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
              />
              {f.key === 'newPass' && (
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              )}
            </div>
          </Field>
        ))}
        {pwError && (
          <p className="text-xs text-red-400 font-label flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {pwError}
          </p>
        )}
        <button
          onClick={handlePasswordChange}
          disabled={passwordSaving}
          className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all font-label disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {passwordSaving ? <Spinner /> : null}
          {passwordSaving ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      {}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-label">Two-Factor Auth</h3>
        
        {mfaState.step === 'idle' && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white font-label">Authenticator App</p>
              <p className="text-xs text-on-surface-variant font-label mt-0.5">Use an app like Google Authenticator.</p>
            </div>
            <button 
              onClick={handleEnableMfa} 
              disabled={mfaState.loading}
              className="px-5 py-2 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors font-label flex items-center gap-2"
            >
              {mfaState.loading ? <Spinner /> : 'Enable'}
            </button>
          </div>
        )}

        {mfaState.step === 'enrolling' && (
          <div className="bg-surface-container/50 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-6 animate-in fade-in duration-300">
            <div className="text-center">
              <p className="text-sm font-bold text-white font-headline">1. Scan QR Code</p>
              <p className="text-xs text-on-surface-variant font-label mt-1">Open your Authenticator app and scan this code.</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCodeSVG value={mfaState.qrCode} size={150} level="M" />
            </div>
            
            <div className="text-center w-full max-w-xs">
              <p className="text-sm font-bold text-white font-headline mb-3">2. Enter 6-digit Code</p>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={mfaState.code}
                onChange={(e) => setMfaState(p => ({ ...p, code: e.target.value.replace(/[^0-9]/g, '') }))}
                className="glass-input w-full rounded-xl p-3 text-center text-xl tracking-[0.5em] text-white font-mono placeholder:tracking-normal placeholder:opacity-30"
              />
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setMfaState({ step: 'idle', loading: false, qrCode: '', secret: '', challengeId: '', code: '' })}
                  className="flex-1 py-2.5 border border-white/10 text-on-surface-variant text-sm font-bold rounded-xl hover:bg-white/5 transition-colors font-label"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerifyMfa}
                  disabled={mfaState.code.length !== 6 || mfaState.loading}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all font-label disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {mfaState.loading ? <Spinner /> : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        )}

        {mfaState.step === 'enabled' && (
          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm font-bold">verified_user</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-label">Authenticator App is Active</p>
                <p className="text-[10px] text-primary/70 font-label mt-0.5">Your account is secured with 2FA.</p>
              </div>
            </div>
            <button 
              onClick={handleDisableMfa}
              disabled={mfaState.loading}
              className="px-4 py-2 border border-error/50 text-error hover:bg-error/10 text-[10px] font-bold rounded-lg transition-colors font-label flex items-center gap-2"
            >
              {mfaState.loading ? <Spinner /> : 'Disable'}
            </button>
          </div>
        )}
      </div>

      {}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-label mb-4">Active Sessions</h3>
        {[
          { device: 'Current Browser', location: 'Active now', time: 'Now', current: true, icon: 'computer' },
        ].map((s) => (
          <div key={s.device} className="flex items-center justify-between p-4 bg-surface-container/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">{s.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-label">{s.device}</p>
                <p className="text-xs text-on-surface-variant font-label">{s.location} · {s.time}</p>
              </div>
            </div>
            {s.current
              ? <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full font-label">Current</span>
              : <button className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors font-label">Revoke</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacyTab() {
  const { exportData, deleteAccount } = useSettingsStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteAccount();
    setDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {showDeleteModal && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} loading={deleting} />
      )}

      <div className="space-y-3">
        {}
        <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-2xl border border-white/5">
          <div>
            <p className="text-sm font-semibold text-white font-label">Export My Data</p>
            <p className="text-xs text-on-surface-variant font-label">JSON export of all applications and notes.</p>
          </div>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors font-label flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">download</span>Export
          </button>
        </div>

        {}
        <div className="flex items-center justify-between p-5 bg-red-950/20 rounded-2xl border border-red-400/10">
          <div>
            <p className="text-sm font-semibold text-white font-label">Delete Account</p>
            <p className="text-xs text-on-surface-variant font-label">Permanently delete all data. Cannot be undone.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-error/10 text-error border border-error/20 text-xs font-bold rounded-xl hover:bg-error/20 transition-colors font-label"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuthStore();
  const { setPage } = useNavigationStore();

  const handleLogout = () => {
    logout();
    setPage('landing');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-label text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
    >
      <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
        logout
      </span>
      Sign Out
    </button>
  );
}

const TAB_COMPONENTS = [ProfileTab, SecurityTab, PrivacyTab];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const { fetchProfile, loading, toast } = useSettingsStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const TabContent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none" />
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background/80 backdrop-blur-xl z-20">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-white">Settings</h2>

        </header>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-sm text-on-surface-variant font-label">Loading your profile...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto p-8 flex gap-10">
              <nav className="w-52 flex-shrink-0 flex flex-col gap-1 pt-1">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left font-label ${activeTab === i ? 'text-primary border-l-2 border-primary bg-primary/5 font-bold' : 'font-medium text-on-surface-variant hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === i ? "'FILL' 1" : "'FILL' 0" }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <LogoutButton />
                </div>
              </nav>
              <div className="flex-1 min-w-0 pb-16">
                <TabContent />
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
