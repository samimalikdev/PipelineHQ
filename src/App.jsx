import React from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import Analytics from './pages/Analytics.jsx';
import Notes from './pages/Notes.jsx';
import Settings from './pages/Settings.jsx';
import Auth from './pages/Auth.jsx';
import useNavigationStore from './store/useNavigationStore.js';
import useAuthStore from './store/useAuthStore.js';
import useApplicationsStore from './store/useApplicationsStore.js';

function Header({ onGetStarted }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-2xl border-b border-white/5 transition-all">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 py-5">
        <div className="text-2xl font-bold tracking-tighter text-white font-headline flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
          PipelineHQ<span className="text-primary w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_rgba(204,255,0,0.8)]"></span>
        </div>

        <nav className="hidden md:flex items-center gap-10 font-headline text-[11px] font-bold tracking-luxury uppercase">
          {[
            { label: 'Home',     id: 'section-home' },
            { label: 'About',    id: 'section-about' },
            { label: 'Features', id: 'section-features' },
            { label: 'Project',  id: 'section-project' },
            { label: 'Contact',  id: 'section-contact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-on-surface-variant hover:text-white transition-colors relative group first-of-type:text-primary"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
          ))}
        </nav>

        <button onClick={onGetStarted} className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-7 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-luxury hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 shadow-[0_0_0_rgba(204,255,0,0)] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]">
          Sign In
        </button>
      </div>
    </header>
  );
}

function Hero({ onGetStarted }) {
  return (
    <section id="section-home" className="relative px-6 md:px-10 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] ethereal-glow -z-10 animate-pulse-glow"></div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
        <div className="lg:col-span-7 space-y-10 md:space-y-12 relative z-10">

          <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-headline font-bold tracking-tighter leading-[0.95] md:leading-[0.88] text-white/90 animate-fade-up opacity-0 delay-100">
            Hire Smarter.<br />
            <span className="text-gradient drop-shadow-2xl">Effortless</span><br />
            Pipeline.
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed font-light tracking-wide animate-fade-up opacity-0 delay-200">
            The next-generation hiring platform for world-class engineering teams. Synchronize your talent pipeline with automated, intelligent workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-6 animate-fade-up opacity-0 delay-300">
            <button onClick={onGetStarted} className="bg-primary text-on-primary px-10 md:px-12 py-5 md:py-6 rounded-2xl font-bold text-lg btn-glow group">
              Get Started <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="flex items-center justify-center gap-3 border border-white/10 bg-white/[0.02] px-10 md:px-12 py-5 md:py-6 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all group backdrop-blur-sm text-white shadow-lg">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 group-hover:text-white transition-all">play_circle</span>
              Watch demo
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative mt-10 lg:mt-0 animate-fade-up opacity-0 delay-400">
          <img className="rounded-[2rem] md:rounded-[2.2rem] w-full h-auto grayscale-[0.1] contrast-[1.1] hover:grayscale-0 transition-all duration-700 object-cover" alt="Modern hiring dashboard mockup" src="/analytics_dashboard.png" />

        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="section-about" className="py-16 md:py-24 relative border-y border-white/5 bg-gradient-to-b from-surface/50 to-background/50 backdrop-blur-sm">
      <div className="w-full px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 text-center md:text-left">
          <div className="space-y-3 group cursor-default">
            <div className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter group-hover:text-primary transition-colors duration-500">189<span className="text-primary/70 group-hover:text-primary transition-colors">K+</span></div>
            <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-luxury font-bold">Global Active Users</div>
          </div>
          <div className="space-y-3 group cursor-default">
            <div className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter group-hover:text-primary transition-colors duration-500">23<span className="text-primary/70 group-hover:text-primary transition-colors">+</span></div>
            <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-luxury font-bold">Design Awards</div>
          </div>
          <div className="space-y-3 group cursor-default">
            <div className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter group-hover:text-primary transition-colors duration-500">25</div>
            <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-luxury font-bold">Years Experience</div>
          </div>
          <div className="space-y-3 group cursor-default">
            <div className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter group-hover:text-primary transition-colors duration-500">99<span className="text-primary/70 group-hover:text-primary transition-colors">.9</span></div>
            <div className="text-[10px] font-label text-on-surface-variant uppercase tracking-luxury font-bold">Platform Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoGrid() {
  return (
    <section id="section-features" className="py-16 md:py-24 px-6 md:px-10 relative">
      <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] ethereal-glow -z-10 opacity-40"></div>

      <div className="w-full flex flex-col items-center text-center">
        <div className="mb-10 md:mb-16 space-y-6 md:space-y-8">
          <h2 className="text-[10px] font-label font-black text-primary uppercase tracking-luxury flex items-center justify-center gap-4 w-full">
            <span className="w-8 h-[1px] bg-primary"></span> Ecosystem Overview <span className="w-8 h-[1px] bg-primary md:hidden"></span>
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-[6rem] font-headline font-bold leading-[1.1] md:leading-[0.95] tracking-tighter max-w-4xl text-white">
            Engineered for elite <br /><span className="text-white/40 italic font-light">high-growth</span> teams.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

          {}
          <div className="md:col-span-8 glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 max-w-lg space-y-6 md:space-y-8">
              <h4 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-white">Physical Interface</h4>
              <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-light">
                Experience a recruitment interface that feels tangible. Fluid drag-and-drop flows designed for deep work and absolute focus.
              </p>
              <button className="text-primary font-bold inline-flex items-center gap-4 group/btn uppercase text-[10px] tracking-luxury pt-4 md:pt-6 hover:text-white transition-colors">
                Explore the flow <span className="material-symbols-outlined font-light group-hover/btn:translate-x-3 transition-transform">arrow_right_alt</span>
              </button>
            </div>
            <div className="absolute right-0 bottom-0 w-[60%] md:w-[50%] translate-x-12 translate-y-12 opacity-40 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:opacity-100 transition-all duration-1000 ease-out drop-shadow-2xl">
              <img className="rounded-tl-[3rem] md:rounded-tl-[4rem] border-l border-t border-white/20" alt="Abstract 3D design asset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuku_i5Jkx6ywDvlk6jZDYmovUQM8nlcFuipWqD9PHSqCaCjngFAztWYnGHOZ_AskTtY-szE_rwCy47QcUZtXbJWKL4e9CNEsrDgWXbyqE6XlKVuwaxSqXCOUfcFYx8s5FzpG2LtNDs67X-GuAQiL3bdLsPOUIlnB66IdgPSed4yQtI9kPeIZblP_K3DPmEmkJCaeBZtetV_RGLKkUsZpg4CT5FtGj91JdvLK09A4QlEZ6oG3LwOOvm5XRENQSPP2Iu_9U6q98wvg" />
            </div>
          </div>

          {}
          <div className="md:col-span-4 glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3.5rem]"></div>
            <div className="space-y-8 md:space-y-10 relative z-10">
              <span className="material-symbols-outlined text-5xl md:text-6xl text-primary font-light drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]">verified_user</span>
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-white">Security</h4>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-light">
                  Vanguard SOC2 infrastructure with end-to-end encryption for every candidate.
                </p>
              </div>
            </div>
            <div className="mt-12 md:mt-16 h-[2px] w-full bg-white/5 overflow-hidden rounded-full relative z-10">
              <div className="h-full bg-primary w-1/4 group-hover:w-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(204,255,0,0.8)]"></div>
            </div>
          </div>

          {}
          <div className="md:col-span-4 glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 group flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors duration-700"></div>
            <span className="material-symbols-outlined text-5xl md:text-6xl text-primary mb-8 md:mb-12 font-light relative z-10 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]">electric_bolt</span>
            <h4 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-white mb-4 md:mb-6 relative z-10">Velocity</h4>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-light relative z-10">
              Native integrations with Slack, Jira, and GitHub. Sync your data in real-time.
            </p>
          </div>

          {}
          <div className="md:col-span-8 glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 md:gap-16 items-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex-1 space-y-6 md:space-y-8 relative z-10">
              <h4 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-white">Auto-Pipeline</h4>
              <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-light">
                Our neural algorithms prioritize candidates based on technical DNA and team culture.
              </p>
            </div>

            <div className="flex-1 w-full h-64 rounded-[2rem] md:rounded-[2.5rem] bg-black/60 border border-white/5 p-8 md:p-10 flex flex-col justify-center gap-5 md:gap-6 shadow-inner relative z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] rounded-[2.5rem] opacity-50"></div>

              <div className="relative z-10 h-12 md:h-14 w-full bg-white/5 backdrop-blur-md rounded-2xl flex items-center px-6 gap-5 hover:translate-x-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/20 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(204,255,0,0.8)]"></div>
                <div className="h-2 w-32 bg-white/20 rounded-full"></div>
                <div className="ml-auto w-6 h-2 bg-white/10 rounded-full"></div>
              </div>
              <div className="relative z-10 h-12 md:h-14 w-11/12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center px-6 gap-5 hover:translate-x-6 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/20 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="h-2 w-24 bg-white/20 rounded-full"></div>
              </div>
              <div className="relative z-10 h-12 md:h-14 w-full bg-white/5 backdrop-blur-md rounded-2xl flex items-center px-6 gap-5 hover:translate-x-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/20 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(204,255,0,0.8)]"></div>
                <div className="h-2 w-40 bg-white/20 rounded-full"></div>
                <div className="ml-auto w-8 h-2 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section id="section-project" className="py-32 px-10 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="glass-card rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px]"></div>
          <div className="flex justify-center mb-10">
            <span className="material-symbols-outlined text-5xl text-primary opacity-50" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          </div>
          <p className="text-2xl md:text-4xl font-headline font-bold tracking-tight leading-tight mb-12 italic">
            "PipelineHQ redefined our engineering culture, in truth really confidence strategies with listing and operational flows ver. 45%"
          </p>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-surface-bright border border-primary/20 mb-4 overflow-hidden">
              <img className="w-full h-full object-cover" data-alt="Portrait of a professional executive with a sharp, modern look and minimalist aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWegffJMmbis8FSCExMUAgnAAaWXrgQYVpN3Swk2TnqyY8Gt09Wu9VhsT7HZnsUxIYS0QRS2PZCC7rPvBK_vUBVR-Jr5CvWOkG4awm3yGkPMffk3weknC0NIpaxC2LuD2NeTz1PilVmeop1bUOnkQiU94nQutPJw3tPmigvRJF_xuPeotij1ba-ujVaruRl7VrIUS4QbsgGfHsvd4DPafMqjXKtzhEEp-GHejNm1rn4p6jTm63dSadWm02JjF3fL9N9d7HHJJxwdU"/>
            </div>
            <span className="font-headline font-bold text-lg">PipelineHQ Engineering Culture</span>
            <span className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Strategic Operations</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ onGetStarted }) {
  return (
    <section id="section-contact" className="py-16 md:py-24 px-6 md:px-10">
      <div className="w-full rounded-[3rem] md:rounded-[4rem] bg-[#0c0e08] border border-white/10 p-10 md:p-20 relative overflow-hidden glass-card group flex flex-col items-center text-center">
        <div className="absolute inset-0 opacity-50 pointer-events-none transition-opacity duration-700 group-hover:opacity-70" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsla(73, 100%, 50%, 0.15) 0%, transparent 60%)" }}></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="relative z-10 space-y-8 md:space-y-10 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-white tracking-tighter leading-[1] md:leading-[0.9]">
            Build your <span className="text-gradient">legacy.</span>
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Join 2,000+ elite teams scaling with PipelineHQ. Your first 14 days are completely free.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-6 md:pt-8 w-full max-w-lg">
            <button onClick={onGetStarted} className="w-full sm:w-auto bg-primary text-on-primary px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg btn-glow flex items-center justify-center gap-3">
              Get Started Now <span className="material-symbols-outlined text-xl font-light">arrow_forward</span>
            </button>
            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-3xl border border-white/10 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 hover:border-white/30 transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#060704] py-10 md:py-14 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="w-full px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

        <div className="flex flex-col items-center md:items-start gap-6 md:gap-8">
          <div className="text-3xl font-bold tracking-tighter text-white font-headline flex items-center gap-1">
            PipelineHQ<span className="text-primary w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(204,255,0,0.8)]"></span>
          </div>
          <div className="font-body text-[10px] md:text-[11px] text-on-surface-variant/60 uppercase tracking-luxury font-bold">© 2026 PipelineHQ. Created by Sami Malik.</div>
        </div>

      </div>
    </footer>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <>
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none"></div>
      <div className="fixed inset-0 noise-overlay z-[6]"></div>
      <Header onGetStarted={onGetStarted} />
      <main>
        <Hero onGetStarted={onGetStarted} />
        <Stats />
        <BentoGrid />
        <Testimonial />
        <CTA onGetStarted={onGetStarted} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { page, setPage } = useNavigationStore();
  const { initialize, user, loading } = useAuthStore();
  const fetchApplications = useApplicationsStore(state => state.fetchApplications);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

  React.useEffect(() => {
    if (!loading && user && (page === 'landing' || page === 'auth')) {
      setPage('dashboard');
    }
  }, [loading, user, page, setPage]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;

  const isProtectedPage = ['dashboard', 'applications', 'analytics', 'notes', 'settings'].includes(page);
  
  if (isProtectedPage && !user) {
    setPage('auth');
    return null;
  }

  if (page === 'dashboard') return <Dashboard />;
  if (page === 'applications') return <Applications />;
  if (page === 'analytics') return <Analytics />;
  if (page === 'notes') return <Notes />;
  if (page === 'settings') return <Settings />;
  if (page === 'auth') return <Auth />;

  return <LandingPage onGetStarted={() => setPage('auth')} />;
}
