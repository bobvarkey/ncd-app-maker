import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Activity, Heart, Syringe, Scale, ArrowRight, Zap, Brain, Sparkles, CheckCircle, ChevronRight } from "lucide-react";

// Floating orb animation
function FloatingOrbs() {
  return (
    <>
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7c5cfc]/8 blur-[120px] pointer-events-none animate-float-slow" style={{animationDuration: '20s'}} />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#06d6a0]/8 blur-[100px] pointer-events-none animate-float-reverse" style={{animationDuration: '25s'}} />
    </>
  );
}

// Features section data
const features = [
  {
    icon: Heart,
    title: "Diabetes Management",
    description: "FBG, HbA1c tracking with guideline-based treatment recommendations and insulin titration protocols.",
  },
  {
    icon: Activity,
    title: "Blood Pressure Control",
    description: "ESC/ESH 2024 classifications, JNC-style staging, and drug combination calculators.",
  },
  {
    icon: Syringe,
    title: "Lipid Profiles",
    description: "ASCVD risk scoring, LAI 2023 classification, and statin intensity mapping.",
  },
  {
    icon: Scale,
    title: "Obesity Metrics",
    description: "BMI categories, waist circumference risk, and GLP-1 eligibility screening.",
  },
];

// Steps data
const steps = [
  {
    num: "01",
    title: "Select Mode",
    description: "Choose Simple, Moderate, or Complex based on your clinical needs.",
  },
  {
    num: "02",
    title: "Enter Data",
    description: "Input vital signs, lab values, and patient demographics.",
  },
  {
    num: "03",
    title: "Get Recommendations",
    description: "Receive evidence-based treatment plans instantly.",
  },
];

// Pricing tiers
const tiers = [
  {
    name: "Simple",
    price: "Free",
    description: "Essential calculators for quick bedside reference",
    features: ["All 4 NCD calculators", "Basic BMI & BP classification", "Simple drug recommendations", "Mobile-responsive"],
    cta: "Get Started",
    highlight: false,
    icon: Sparkles,
  },
  {
    name: "Moderate",
    price: "$9",
    period: "/mo",
    description: "Risk stratification and drug interactions",
    features: ["Everything in Simple", "ASCVD 10-year risk score", "Drug interaction checker", "Insulin titration guide", "GLP-1 eligibility"],
    cta: "Start Free Trial",
    highlight: true,
    icon: Zap,
  },
  {
    name: "Complex",
    price: "$29",
    period: "/mo",
    description: "Full clinical decision support system",
    features: ["Everything in Moderate", "Prescription generator", "OCR lab upload", "LAI 2023 classification", "PREVENT risk score", "Priority support"],
    cta: "Start Free Trial",
    highlight: false,
    icon: Brain,
  },
];

// Stats row
const stats = [
  { value: "4", label: "NCD Conditions" },
  { value: "170+", label: "Drug References" },
  { value: "2026", label: "Latest Guidelines" },
];

export default function ModeSelector() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    
    // Intersection Observer for scroll reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b1a] text-white font-['Inter'] overflow-x-hidden">
      <FloatingOrbs />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0b1a]/80 border-b border-[#1a1b2e]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#06d6a0] flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">NCD Toolkit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <button 
            onClick={() => navigate("/simple")}
            className="hidden md:block px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] text-white hover:opacity-90 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className={`reveal flex items-center justify-center gap-2 mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#7c5cfc]/15 text-[#7c5cfc] border border-[#7c5cfc]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-pulse" />
              Powered by Latest Guidelines
            </span>
          </div>

          {/* Headline */}
          <h1 className={`reveal text-4xl md:text-6xl font-bold text-center mb-6 leading-tight transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Clinical Decision Support
            <br />
            <span className="bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] bg-clip-text text-transparent">
              for Modern Medicine
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`reveal text-center text-gray-400 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Three tiers of evidence-based decision support for diabetes, hypertension, lipids, and obesity. 
            From quick bedside calculators to full clinical decision systems.
          </p>

          {/* CTAs */}
          <div className={`reveal flex items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button 
              onClick={() => navigate("/simple")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] text-white font-semibold text-sm hover:scale-105 transition-transform"
            >
              Start Free
            </button>
            <button 
              onClick={() => navigate("/moderate")}
              className="px-6 py-3 rounded-lg border border-[#1a1b2e] text-white font-semibold text-sm hover:border-[#7c5cfc] hover:bg-[#7c5cfc]/10 transition-all"
            >
              See Features
            </button>
          </div>

          {/* Mockup / Preview */}
          <div className={`reveal max-w-4xl mx-auto rounded-xl border border-[#1a1b2e] bg-[#0d0e1a]/80 overflow-hidden shadow-2xl transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1a1b2e]">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Fake UI cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-[#1a1b2e]/50 border border-[#1a1b2e] p-4 hover:border-[#7c5cfc]/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#7c5cfc]/20 mb-3 flex items-center justify-center">
                    {[Heart, Activity, Scale][i-1].prototype && <Heart className="w-4 h-4 text-[#7c5cfc]" />}
                  </div>
                  <div className="h-2 w-16 bg-[#1a1b2e] rounded mb-2" />
                  <div className="h-2 w-12 bg-[#1a1b2e] rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={`reveal grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12 text-center transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c5cfc]/15 text-[#7c5cfc] border border-[#7c5cfc]/30 mb-4">
              Features
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Comprehensive tools for managing the four major non-communicable diseases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i}
                  className="group p-5 rounded-xl border border-[#1a1b2e] bg-[#0d0e1a]/50 hover:border-[#7c5cfc]/50 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7c5cfc]/20 to-[#06d6a0]/20 flex items-center justify-center mb-4 group-hover:from-[#7c5cfc]/30 group-hover:to-[#06d6a0]/30 transition-all">
                    <Icon className="w-5 h-5 text-[#7c5cfc]" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-[#0d0e1a]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c5cfc]/15 text-[#7c5cfc] border border-[#7c5cfc]/30 mb-4">
              How It Works
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Get Started in Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center p-6 rounded-xl border border-[#1a1b2e] bg-[#0d0e1a]/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#06d6a0] flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-xs text-gray-400">{step.description}</p>
                
                {/* Arrow between steps (desktop only) */}
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#7c5cfc]/15 text-[#7c5cfc] border border-[#7c5cfc]/30 mb-4">
              Pricing
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-sm">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={i}
                  className={`relative p-6 rounded-xl border ${tier.highlight ? 'border-[#7c5cfc] bg-[#7c5cfc]/5 scale-105' : 'border-[#1a1b2e] bg-[#0d0e1a]/50'} hover:border-[#7c5cfc]/50 transition-all`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] text-white">
                      Popular
                    </span>
                  )}
                  
                  <Icon className={`w-8 h-8 mb-4 ${tier.highlight ? 'text-[#7c5cfc]' : 'text-gray-400'}`} />
                  
                  <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-gray-400 text-sm">{tier.period}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{tier.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-[#06d6a0]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => navigate(tier.name.toLowerCase() === "simple" ? "/simple" : tier.name.toLowerCase() === "moderate" ? "/moderate" : "/home")}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${tier.highlight ? 'bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] text-white hover:opacity-90' : 'border border-[#1a1b2e] hover:border-[#7c5cfc]'}`}
                  >
                    {tier.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waitlist / CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-2xl border border-[#1a1b2e] bg-[#0d0e1a]/50 relative overflow-hidden">
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c5cfc]/10 to-[#06d6a0]/10" />
            
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Join thousands of clinicians already using NCD Toolkit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#0a0b1a] border border-[#1a1b2e] text-white text-sm focus:border-[#7c5cfc] focus:outline-none transition-colors"
                />
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#06d6a0] text-white font-semibold text-sm hover:opacity-90 transition-all whitespace-nowrap">
                  Get Early Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#1a1b2e]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 NCD Toolkit. Built with precision.
          </p>
          
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Embedded CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 25s ease-in-out infinite; }
        
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}