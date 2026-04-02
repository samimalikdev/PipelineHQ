import React, { useState } from 'react';
import useNavigationStore from '../store/useNavigationStore';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const { setPage } = useNavigationStore();
  const { login, register, loading, verifyLoginMfa, mfaChallenge, clearMfaChallenge } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError('');
  };
  
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    let res;
    if (isLogin) {
      res = await login(formData.email, formData.password);
    } else {
      res = await register(formData.email, formData.password, formData.name);
    }

    if (res.success) {
      if (res.mfaRequired) {
        
        setMfaCode('');
        setError('');
      } else {
        setPage('dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    setError('');
    
    const res = await verifyLoginMfa(mfaCode);
    
    if (res.success) {
      setPage('dashboard');
    } else {
      setError(res.error || 'Invalid code. Please try again.');
    }
  };

  const handleOAuth = async (provider) => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setError(`Failed to authenticate with ${provider}: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-background overflow-hidden">
      {}
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="absolute inset-0 noise-overlay z-[1]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ethereal-glow opacity-30 pointer-events-none z-[1]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-[1]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-[1]"></div>
      
      {}
      <button 
        onClick={() => setPage('landing')} 
        className="absolute top-8 left-8 z-[20] flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors uppercase tracking-luxury text-[10px] font-bold"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Return Home
      </button>

      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-surface/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden mx-auto">
        
        {}
        <div className="hidden md:flex flex-col justify-between p-12 md:p-16 border-r border-white/5 relative overflow-hidden bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-2xl font-bold tracking-tighter text-white font-headline flex items-center gap-1 mb-8">
              PipelineHQ<span className="text-primary w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_rgba(204,255,0,0.8)]"></span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-headline font-light tracking-tight text-white leading-[1.1]">
              <span className="font-bold text-gradient">Smarter teams</span> use smarter pipelines.
            </h2>
          </div>
          <div className="relative z-10">
            <div className="flex -space-x-3 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#090a07] bg-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-white/50">person</span>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#090a07] bg-primary/10 backdrop-blur-md overflow-hidden flex items-center justify-center text-[10px] font-bold text-primary">
                +2k
              </div>
            </div>
            <p className="text-sm font-light text-on-surface-variant leading-relaxed">
              Join elite engineering teams deploying talent faster with neural curation and automated logic.
            </p>
          </div>
        </div>

        {}
        <div className="p-8 md:p-16 relative">
          <div className="w-full max-w-sm mx-auto">
            {mfaChallenge ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_person</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-headline font-bold text-white mb-2 tracking-tight">Two-Step Verification</h2>
                <p className="text-on-surface-variant font-label text-sm mb-8 leading-relaxed">
                  Enter the 6-digit code from your authenticator app to continue.
                </p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4 animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyMfa} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-label font-bold tracking-luxury text-on-surface-variant ml-2">Authenticator Code</label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="000000"
                      className="w-full glass-input rounded-2xl px-5 py-4 text-center text-3xl tracking-[0.5em] text-white font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading || mfaCode.length !== 6}
                    className="relative w-full overflow-hidden bg-primary text-on-primary font-bold py-4 rounded-2xl mt-8 btn-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify Code
                        <span className="material-symbols-outlined text-lg">verified_user</span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { clearMfaChallenge(); setMfaCode(''); setError(''); }}
                    className="w-full py-4 text-sm font-label font-bold text-on-surface-variant hover:text-white transition-colors mt-2"
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-8 duration-500">
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h1>
                  <p className="text-on-surface-variant font-light text-sm">
                    {isLogin ? 'Enter your details to access your dashboard.' : 'Start your 14-day free trial. No credit card required.'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4 animate-fade-in">
                      {error}
                    </div>
                  )}
                  
                  {!isLogin && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[10px] uppercase font-label font-bold tracking-luxury text-on-surface-variant ml-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Marcus Sterling"
                        className="w-full glass-input rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-label font-bold tracking-luxury text-on-surface-variant ml-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      className="w-full glass-input rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] uppercase font-label font-bold tracking-luxury text-on-surface-variant">Password</label>
                      {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:text-white transition-colors">Forgot password?</button>}
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full glass-input rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                      value={formData.password}
                      onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="relative w-full overflow-hidden bg-primary text-on-primary font-bold py-4 rounded-2xl mt-8 btn-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading && (
                      <div className="absolute bottom-0 left-0 h-1 bg-white/40 w-full overflow-hidden">
                        <div className="h-full bg-white animate-[progress_1s_ease-in-out_infinite_alternate] w-1/2 rounded-full"></div>
                      </div>
                    )}
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </span>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'} 
                        <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="my-8 flex items-center justify-center gap-4">
                  <div className="h-px bg-white/5 flex-1"></div>
                  <span className="text-[10px] uppercase tracking-luxury text-on-surface-variant font-bold">or continue with</span>
                  <div className="h-px bg-white/5 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-colors text-sm font-medium text-white shadow-lg">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 grayscale opacity-70" />
                    Google
                  </button>
                  <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-colors text-sm font-medium text-white shadow-lg">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-5 h-5 invert opacity-70" />
                    GitHub
                  </button>
                </div>

                <p className="text-center text-sm text-on-surface-variant mt-10 font-light">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={toggleMode} className="text-white font-bold hover:text-primary transition-colors inline-block ml-1">
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
