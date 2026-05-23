import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Activity, Heart, Syringe, Scale, ArrowRight, Users, BookOpen, Shield, Zap, Star, CheckCircle } from "lucide-react";

// Floating orbs animation
function FloatingOrbs() {
  return (
    <>
      <div className="fixed top-20 left-0 w-[600px] h-[600px] rounded-full bg-[#e91e63]/5 blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-[#7c5cfc]/5 blur-[100px] pointer-events-none animate-float-reverse" />
    </>
  );
}

// Navigation
function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#e4bdc2]/30">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e91e63] to-[#7c5cfc] flex items-center justify-center shadow-lg shadow-[#e91e63]/20">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-lg text-[#191a2a]">NCD Toolkit</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5b3f43]">
          <a href="#features" className="hover:text-[#e91e63] transition-colors">Features</a>
          <a href="#modes" className="hover:text-[#e91e63] transition-colors">Modes</a>
          <a href="#testimonials" className="hover:text-[#e91e63] transition-colors">Testimonials</a>
        </div>

        <button 
          onClick={() => navigate("/simple")}
          className="hidden md:block px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#e91e63] text-white hover:shadow-lg hover:shadow-[#e91e63]/30 hover:scale-[1.02] transition-all"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

// Hero Section
function Hero() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4">
      <FloatingOrbs />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className={`transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#fff1f5] text-[#e91e63] border border-[#e4bdc2]">
            <span className="w-2 h-2 rounded-full bg-[#e91e63] animate-pulse" />
            Powered by 2026 Clinical Guidelines
          </span>
        </div>

        {/* Headline */}
        <h1 className={`mt-8 text-4xl md:text-6xl font-['Space_Grotesk'] font-bold text-[#191a2a] leading-tight transition-all duration-700 delay-100 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          Clinical Decision Support
          <br />
          <span className="text-transparent bg-gradient-to-r from-[#e91e63] to-[#7c5cfc] bg-clip-text">
            Made Simple
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-6 text-lg text-[#5b3f43] max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          Three tiers of evidence-based decision support for diabetes, hypertension, dyslipidemia, and obesity. 
          From quick bedside calculators to full clinical workflow integration.
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 transition-all duration-700 delay-300 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <button 
            onClick={() => navigate("/simple")}
            className="px-8 py-3.5 rounded-lg bg-[#e91e63] text-white font-semibold text-sm hover:shadow-xl hover:shadow-[#e91e63]/30 hover:scale-[1.02] transition-all"
          >
            Start Free
          </button>
          <button 
            onClick={() => navigate("/home")}
            className="px-8 py-3.5 rounded-lg bg-white text-[#191a2a] font-semibold text-sm border border-[#e4bdc2] hover:border-[#e91e63] hover:text-[#e91e63] transition-all"
          >
            View Documentation
          </button>
        </div>

        {/* Stats Row */}
        <div className={`grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16 transition-all duration-700 delay-500 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {[
            { value: "4", label: "NCD Conditions" },
            { value: "170+", label: "Drug References" },
            { value: "2026", label: "Latest Guidelines" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-[#e91e63]">{stat.value}</div>
              <div className="text-sm text-[#5b3f43] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Feature Card
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`group p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(10,11,26,0.05)] hover:shadow-xl hover:shadow-[#e91e63]/10 transition-all duration-500 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e91e63]/10 to-[#7c5cfc]/10 flex items-center justify-center mb-5 group-hover:from-[#e91e63]/20 group-hover:to-[#7c5cfc]/20 transition-all">
        <Icon className="w-7 h-7 text-[#e91e63]" />
      </div>
      <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[#191a2a] mb-2">{title}</h3>
      <p className="text-[#5b3f43] leading-relaxed">{description}</p>
    </div>
  );
}

// Features Section
function Features() {
  const features = [
    { icon: Heart, title: "Diabetes Management", description: "FBG, HbA1c tracking with guideline-based treatment recommendations and insulin titration protocols." },
    { icon: Activity, title: "Blood Pressure Control", description: "ESC/ESH 2024 classifications, JNC-style staging, and drug combination calculators." },
    { icon: Syringe, title: "Lipid Profiles", description: "ASCVD risk scoring, LAI 2023 classification, and statin intensity mapping." },
    { icon: Scale, title: "Obesity Metrics", description: "BMI categories, waist circumference risk, and GLP-1 eligibility screening." },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-[#f5f2ff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#fff1f5] text-[#e91e63] border border-[#e4bdc2]">
            Features
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-[#191a2a]">
            Everything You Need
          </h2>
          <p className="mt-3 text-[#5b3f43] max-w-xl mx-auto">
            Comprehensive tools for managing the four major non-communicable diseases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} delay={200 + i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Mode Card
function ModeCard({ title, description, features, price, highlight, icon: Icon, route, delay }: { 
  title: string; 
  description: string; 
  features: string[]; 
  price: string; 
  highlight?: boolean; 
  icon: any; 
  route: string;
  delay: number;
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`relative p-8 rounded-3xl transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${highlight ? 'bg-gradient-to-b from-[#fff1f5] to-white border-2 border-[#e91e63]/30 shadow-xl shadow-[#e91e63]/10 scale-105' : 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(10,11,26,0.05)]'}`}>
      {highlight && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#e91e63] to-[#7c5cfc] text-white">
          Most Popular
        </span>
      )}
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${highlight ? 'bg-[#e91e63]' : 'bg-gradient-to-br from-[#e91e63]/10 to-[#7c5cfc]/10'}`}>
        <Icon className={`w-7 h-7 ${highlight ? 'text-white' : 'text-[#e91e63]'}`} />
      </div>
      
      <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-[#191a2a] mb-2">{title}</h3>
      <p className="text-[#5b3f43] text-sm mb-6">{description}</p>
      
      <div className="mb-6">
        <span className="text-4xl font-['Space_Grotesk'] font-bold text-[#191a2a]">{price}</span>
        {price !== "Free" && <span className="text-[#5b3f43] text-sm">/month</span>}
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feat, j) => (
          <li key={j} className="flex items-center gap-3 text-sm text-[#191a2a]">
            <CheckCircle className="w-4 h-4 text-[#06d6a0]" />
            {feat}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => navigate(route)}
        className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all ${highlight ? 'bg-[#e91e63] text-white hover:shadow-lg hover:shadow-[#e91e63]/30' : 'bg-white text-[#191a2a] border border-[#e4bdc2] hover:border-[#e91e63] hover:text-[#e91e63]'}`}
      >
        Get Started
      </button>
    </div>
  );
}

// Modes/Pricing Section
function Modes() {
  const modes = [
    {
      title: "Simple",
      description: "Essential calculators",
      price: "Free",
      features: ["All 4 NCD calculators", "Basic BMI & BP classification", "Simple drug recommendations", "Mobile-responsive"],
      icon: Zap,
      route: "/simple",
    },
    {
      title: "Moderate",
      description: "Advanced decision support",
      price: "$9",
      features: ["Everything in Simple", "ASCVD 10-year risk score", "Drug interaction checker", "Insulin titration guide", "GLP-1 eligibility"],
      icon: Shield,
      route: "/moderate",
      highlight: true,
    },
    {
      title: "Complex",
      description: "Full clinical suite",
      price: "$29",
      features: ["Everything in Moderate", "Prescription generator", "OCR lab upload", "LAI 2023 classification", "PREVENT risk score", "Priority support"],
      icon: BookOpen,
      route: "/home",
    },
  ];

  return (
    <section id="modes" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#fff1f5] text-[#e91e63] border border-[#e4bdc2]">
            Modes & Pricing
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-[#191a2a]">
            Choose Your Tier
          </h2>
          <p className="mt-3 text-[#5b3f43]">Start free, upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {modes.map((mode, i) => (
            <ModeCard key={i} {...mode} delay={300 + i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonial
function Testimonial({ quote, author, role, delay }: { quote: string; author: string; role: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#e91e63] text-[#e91e63]" />
        ))}
      </div>
      <p className="text-[#191a2a] italic mb-4">"{quote}"</p>
      <div>
        <div className="font-semibold text-[#191a2a]">{author}</div>
        <div className="text-sm text-[#5b3f43]">{role}</div>
      </div>
    </div>
  );
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    { quote: "Incredibly useful for quick bedside calculations. My residents love it.", author: "Dr. Sarah Chen", role: "Endocrinologist, Boston Medical" },
    { quote: "The drug interaction checker saved me twice this week alone. Essential tool.", author: "Dr. Michael Roberts", role: "General Practitioner, UK NHS" },
    { quote: "Finally, a clinical app that looks good and works well. My patients love the simple mode.", author: "Dr. Priya Sharma", role: "Family Physician, Mumbai" },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-[#f5f2ff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[#fff1f5] text-[#e91e63] border border-[#e4bdc2]">
            Testimonials
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-['Space_Grotesk'] font-bold text-[#191a2a]">
            Loved by Clinicians
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Testimonial key={i} {...t} delay={400 + i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Documentation", "Changelog"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Disclaimers", "HIPAA"],
    Support: ["FAQ", "Help Center", "API Docs", "Status"],
  };

  return (
    <footer className="py-16 px-4 border-t border-[#e4bdc2]/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-['Space_Grotesk'] font-bold text-[#191a2a] mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#5b3f43] hover:text-[#e91e63] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#e4bdc2]/30">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e91e63] to-[#7c5cfc] flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-['Space_Grotesk'] font-bold text-[#191a2a]">NCD Toolkit</span>
          </div>
          <p className="text-sm text-[#5b3f43]">
            © 2026 NCD Toolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Component
export default function ModeSelector() {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#191a2a] font-['Inter']">
      <Navbar />
      <Hero />
      <Features />
      <Modes />
      <Testimonials />
      <Footer />

      {/* Embedded CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 15px); }
        }
        
        .animate-float { animation: float 18s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 22s ease-in-out infinite; }
        
        ::selection {
          background: #e91e63;
          color: white;
        }
      `}</style>
    </div>
  );
}