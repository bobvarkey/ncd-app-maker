import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Material Symbol Icon component
function Icon({ name, filled = false }: { name: string; filled?: boolean }) {
  return (
    <span 
      className="material-symbols-outlined" 
      style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
    >
      {name}
    </span>
  );
}

// Animated ECG Waveform
function ECGWave() {
  return (
    <div className="ecg-wave h-8 flex items-center overflow-hidden">
      <style>{`
        @keyframes ecg-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-40px); }
        }
        .ecg-wave div {
          animation: ecg-scroll 1s linear infinite;
        }
      `}</style>
      <div className="flex gap-0.5">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 bg-pink-500/60" style={{
            height: i === 2 || i === 7 || i === 12 || i === 17 ? '100%' : 
                   i === 3 || i === 6 || i === 8 || i === 11 || i === 13 || i === 16 ? '60%' :
                   i === 4 || i === 5 || i === 9 || i === 10 || i === 14 || i === 15 ? '30%' : '50%',
            animationDelay: `${i * 0.05}s`
          }} />
        ))}
      </div>
    </div>
  );
}

// Floating particles
function ParticleField() {
  return (
    <div className="particles absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          25% { transform: translate(20px, -30px) rotate(90deg); opacity: 0.6; }
          50% { transform: translate(0, -60px) rotate(180deg); opacity: 0.3; }
          75% { transform: translate(-20px, -30px) rotate(270deg); opacity: 0.6; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-30px, -40px) scale(1.5); opacity: 0.2; }
        }
        .particle-1 { animation: float-1 8s ease-in-out infinite; }
        .particle-2 { animation: float-2 6s ease-in-out infinite; }
      `}</style>
      <div className="particle-1 absolute top-20 left-1/4 w-3 h-3 rounded-full bg-pink-500" />
      <div className="particle-2 absolute top-40 right-1/3 w-2 h-2 rounded-full bg-blue-500" />
      <div className="particle-1 absolute bottom-32 left-1/3 w-2 h-2 rounded-full bg-cyan-400" />
      <div className="particle-2 absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-rose-500" />
    </div>
  );
}

// Heart rate animation
function HeartPulse() {
  return (
    <div className="heart-pulse flex items-center gap-1">
      <style>{`
        @keyframes pulse-beat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.2); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
          60% { transform: scale(1); }
        }
        .pulse-anim { animation: pulse-beat 1.5s ease-in-out infinite; }
      `}</style>
      <Icon name="favorite" className="pulse-anim text-rose-500" />
    </div>
  );
}

// Navigation
function Navbar() {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-600/95 via-rose-600/95 to-blue-600/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <nav className="flex justify-between items-center w-full px-6 lg:px-12 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
            <Icon name="favorite" filled className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>NCD Rx</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
          <button onClick={() => navigate("/home")} className="hover:text-white transition-colors">Home</button>
          <button onClick={() => navigate("#features")} className="hover:text-white transition-colors">Conditions</button>
          <button onClick={() => navigate("#methodology")} className="hover:text-white transition-colors">About</button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate("/home")}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}

// Hero Section
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background grids */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(236,72,153,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-600/10 to-blue-600/10 rounded-full blur-3xl" />
      
      <ParticleField />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ECGWave />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-blue-400 bg-clip-text text-transparent">
            Comprehensive
          </span>
          <br />
          <span className="text-white">NCD Management</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
          All-in-one clinical decision support for Diabetes, Hypertension, Dyslipidemia, Obesity, COPD/Asthma & Kidney Disease. 
          Powered by latest guidelines.
        </p>

        {/* Condition Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { name: 'Diabetes', icon: 'water_drop', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
            { name: 'Hypertension', icon: 'favorite', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
            { name: 'Lipids', icon: 'pie_chart', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
            { name: 'Obesity', icon: 'scale', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
            { name: 'COPD/Asthma', icon: 'air', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
            { name: 'Kidney', icon: 'kid', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' }
          ].map((cond, i) => (
            <span 
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${cond.color} flex items-center gap-1.5`}
            >
              <Icon name={cond.icon} className="text-base" />
              {cond.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate("/home")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
          >
            Launch App
          </button>
          <button 
            onClick={() => navigate("#features")}
            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-lg border border-white/20 transition-all"
          >
            Explore Conditions
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          {[
            { val: '6', label: 'NCD Conditions' },
            { val: '50+', label: 'Calculators' },
            { val: '2026', label: 'Guideline Year' },
            { val: '100K+', label: 'Clinicians' }
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                {stat.val}
                {i === 1 && <HeartPulse />}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const navigate = useNavigate();
  const features = [
    { 
      title: 'Diabetes', 
      desc: 'HbA1c risk, insulin titration, Sliding Scale, GLP-1 eligibility',
      icon: 'water_drop',
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30'
    },
    { 
      title: 'Hypertension', 
      desc: 'ESC 2024 classification, drug interaction checker, renal dose adjustment',
      icon: 'favorite',
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30'
    },
    { 
      title: 'Lipids', 
      desc: 'LAI 2023, PREVENT risk, statin calculator, APOB guidance',
      icon: 'pie_chart',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    },
    { 
      title: 'Obesity', 
      desc: 'BMI calculator, ADA 2025 guidelines, metabolic surgery',
      icon: 'scale',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    },
    { 
      title: 'COPD/Asthma', 
      desc: 'GINA 2026 GOLD, exacerbation risk, inhaler guide',
      icon: 'air',
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30'
    },
    { 
      title: 'Kidney', 
      desc: 'CKD-EPI eGFR, renal dose adjustment, albuminuria staging',
      icon: 'kid',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30'
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            All 6 <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">NCD Conditions</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Comprehensive management tools for every non-communicable disease — built with latest clinical guidelines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <button
              key={i}
              onClick={() => navigate("/home")}
              className={`p-6 rounded-2xl text-left border ${feat.bg} ${feat.border} transition-all hover:scale-105 hover:shadow-xl group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon name={feat.icon} className="text-white text-xl" filled />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-white/60">{feat.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Methodology Section
function Methodology() {
  const methods = [
    { title: 'Evidence-Based', desc: 'Built on latest ADA, ESC, AHA guidelines (2025-2026)', icon: 'menu_book' },
    { title: 'Clinician-Designed', desc: 'Created by practicing physicians for real-world use', icon: 'clinical_notes' },
    { title: 'Offline Capable', desc: 'Works without internet after initial load', icon: 'wifi_off' },
    { title: 'Privacy First', desc: 'No patient data stored — locally processed only', icon: 'lock' },
  ];

  return (
    <section id="methodology" className="py-20 px-6 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Space Grotesk' }}>
          Built for <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Modern Practice</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((m, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-blue-500/20 flex items-center justify-center text-pink-400 mb-3">
                <Icon name={m.icon} />
              </div>
              <h4 className="font-semibold text-white">{m.title}</h4>
              <p className="text-sm text-white/50 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-950 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
            <Icon name="favorite" filled className="text-white text-sm" />
          </div>
          <span className="font-bold text-white">NCD Rx</span>
        </div>
        <p className="text-sm text-white/40">© 2026 NCD Rx — Clinician-designed for precision.</p>
      </div>
    </footer>
  );
}

// Main export
export default function ModeSelector() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <Methodology />
      </main>
      <Footer />

      {/* Global Styles */}
      <style>{`
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
}