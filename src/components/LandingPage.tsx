import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  BarChart3,
  Users,
  Building,
  DollarSign,
  HeartHandshake,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: (initialIdea?: string) => void;
  onLoginClick: () => void;
}

export default function LandingPage({ onGetStarted, onLoginClick }: LandingPageProps) {
  const [quickIdea, setQuickIdea] = useState("");
  const [activeTab, setActiveTab] = useState<"validate" | "model" | "pitch">("validate");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetStarted(quickIdea);
  };

  const featureCards = [
    {
      icon: Sparkles,
      title: "Instant AI Validation",
      desc: "Get an 80+ point multi-dimensional score evaluating demand, feasibility, competitiveness, and scalablity."
    },
    {
      icon: TrendingUp,
      title: "5-Year Revenue Forecast",
      desc: "Simulate cash flow, customer growth, operational cost parameters, and calculate precise break-even analysis."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Risk Assessment",
      desc: "Identify critical technical, financial, legal and market hurdles alongside contextual mitigation blueprints."
    },
    {
      icon: Cpu,
      title: "Competitor Market Maps",
      desc: "Generate spatial matrices of market positioning relative to active national and global business leaders."
    },
    {
      icon: BarChart3,
      title: "Interactive Pitch Decks",
      desc: "Build sliding venture capital presentation panels that outline problems, solutions, and funding demands."
    },
    {
      icon: Users,
      title: "Business Model Canvas",
      desc: "Examine a beautiful full-screen visual layout detailing value props, channels, customer slices, and key channels."
    }
  ];

  const workflowTabs = {
    validate: {
      title: "Ideate & Classify",
      text: "Feed VentureMind AI your initial raw elevator brief. State target demographics, problem space, and your core differentiator in any market.",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
    },
    model: {
      title: "Structured SWOT & Financials",
      text: "Instantly build visual SWOT grid, SWOT bullet factors, and interactive cash forecasts charting scalable profits during years 1 through 5.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    },
    pitch: {
      title: "Investor Presentation Ready",
      text: "Convert everything into editable pitch slides. Customize presentation funding models, allocate budgeting, and download reports.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-blue-100 flex flex-col">
      {/* Header Line */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-display font-bold text-[#111827]">
                VentureMind AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                SaaS v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-gray-600">
            <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">How it Works</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="px-3 py-1.5 text-xs font-semibold text-gray-650 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onGetStarted()}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:opacity-95 rounded-lg shadow-sm transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Validate Free</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50/30 via-[#F9FAFB] to-[#F9FAFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-semibold text-[#2563EB]">
                <span>⚡ Version 2.4 Active</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                <span>Next-Gen Gemini Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#111827] tracking-tight leading-none">
                Validate Startup Ideas <br />
                <span className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                  Before You Invest
                </span>{" "}
                Time & Money
              </h1>

              <p className="text-sm text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                An AI-powered innovation platform that transforms raw ideas into validated business opportunities.
                Get interactive market maps, swot models, financial predictions, risks, and editable pitch decks instantly.
              </p>

              {/* Instant Try Box */}
              <form onSubmit={handleQuickSubmit} className="max-w-xl mx-auto lg:mx-0">
                <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-3">
                    <Sparkles className="text-[#2563EB] w-4 h-4 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      className="w-full text-xs outline-none bg-transparent placeholder:text-gray-400 text-gray-800"
                      placeholder="My idea: An AI automated drone companion for managing crop soil..."
                      value={quickIdea}
                      onChange={(e) => setQuickIdea(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:w-auto w-full py-2 px-4 text-xs font-semibold rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:opacity-95 text-white transition-all flex items-center justify-center space-x-1.5 group shrink-0 cursor-pointer"
                  >
                    <span>Analyze Instantly</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-gray-400 font-normal">
                  No credit card required. Free validation report generated within seconds.
                </p>
              </form>
            </div>

            {/* Dashboard Mockup Representation */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-xl blur-lg opacity-15 animate-pulse" />
              <div className="relative bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                {/* Simulated window header */}
                <div className="bg-gray-50 px-4 h-10 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="text-[10px] text-gray-405 font-mono">venturemind-ai.io/dashboard</div>
                  <div className="w-10 h-3" />
                </div>

                {/* Simulated Dashboard content */}
                <div className="p-6 space-y-6">
                  {/* Top Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Fintech AgroDron Co.</h4>
                      <p className="text-xs text-slate-400 font-mono">AgriTech • USA East</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-550 border border-emerald-300 rounded text-xs font-bold text-emerald-600 bg-emerald-50">
                      89% Score
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Market Need Fit</span>
                        <span className="text-blue-600">92%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Success Probability</span>
                        <span className="text-purple-600">86%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "86%" }} />
                      </div>
                    </div>
                  </div>

                  {/* SWOT Mini box */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="font-bold text-blue-700 block mb-1">STRENGTHS</span>
                      <p className="text-slate-600 line-clamp-2 leading-snug">Low entry hardware overhead, immediate high-value margins.</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                      <span className="font-bold text-purple-700 block mb-1">OPPORTUNITIES</span>
                      <p className="text-slate-600 line-clamp-2 leading-snug">Organic regulation changes, emerging carbon incentive markets.</p>
                    </div>
                  </div>

                  {/* Graphic preview */}
                  <div className="pt-2">
                    <div className="text-xs text-slate-400 font-mono mb-2">5-YEAR REVENUE OUTLOOK</div>
                    <div className="h-24 flex items-end justify-between space-x-1 border-b border-l border-slate-100 pb-1 pl-1">
                      <div className="bg-blue-200 h-1/4 w-full rounded-t" />
                      <div className="bg-blue-300 h-2/5 w-full rounded-t" />
                      <div className="bg-blue-400 h-1/2 w-full rounded-t" />
                      <div className="bg-purple-500 h-3/4 w-full rounded-t" />
                      <div className="bg-gradient-to-t from-blue-600 to-purple-600 h-full w-full rounded-t" />
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-1">
                      <span>Yr 1</span>
                      <span>Yr 2</span>
                      <span>Yr 3</span>
                      <span>Yr 4</span>
                      <span>Yr 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">45k+</div>
              <div className="text-xs text-slate-400 mt-2 font-medium">Ideas Evaluated</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">94.3%</div>
              <div className="text-xs text-slate-400 mt-2 font-medium">Validation Accuracy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">$180M+</div>
              <div className="text-xs text-slate-400 mt-2 font-medium">Client Funding Raised</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">&lt; 3 mins</div>
              <div className="text-xs text-slate-400 mt-2 font-medium">Turnaround Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-base font-bold text-blue-600 uppercase tracking-widest">
              Comprehensive Platform
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Complete Business Intelligence Arsenal
            </h3>
            <p className="text-slate-600">
              Transform mere drafts into investor-ready structures with visual widgets mapping your potential competition, risks, models and pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-150 bg-white hover:shadow-md hover:border-[#2563EB]/45 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-[#2563EB] border border-gray-150 shadow-xs group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-transparent transition-all">
                  <f.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-display font-bold text-[#111827] mt-4 mb-2">{f.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Walkthrough tabs */}
      <section id="how-it-works" className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-[10px] font-bold text-purple-700 tracking-wider uppercase font-mono">Platform Walkthrough</h2>
            <h3 className="text-2xl font-display font-bold text-[#111827]">How VentureMind AI Validates Ideas</h3>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Visual selectors */}
            <div className="lg:col-span-4 space-y-3">
              {(Object.keys(workflowTabs) as Array<keyof typeof workflowTabs>).map((key) => {
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                      isActive
                        ? "bg-blue-50/50 border-blue-400 shadow-sm text-[#111827]"
                        : "bg-transparent border-transparent hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive ? "bg-[#2563EB] text-white" : "bg-gray-150 text-gray-700"
                      }`}
                    >
                      {key === "validate" ? "1" : key === "model" ? "2" : "3"}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs font-display">{workflowTabs[key].title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed font-normal">{workflowTabs[key].text}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Frame */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-gray-200 p-2 rounded-xl shadow-xs">
                <img
                  src={workflowTabs[activeTab].image}
                  alt={workflowTabs[activeTab].title}
                  className="w-full h-72 object-cover rounded-lg shadow-inner bg-gray-50"
                />
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-normal italic leading-relaxed">
                    "{workflowTabs[activeTab].text}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-md flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-[#111827] text-md">VentureMind AI</span>
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            &copy; 2026 VentureMind AI. All rights reserved. Powered securely by Gemini-3.5-Flash & Google Cloud Run.
          </p>
          <div className="flex space-x-4 text-[10px] font-semibold text-gray-500">
            <a href="#" className="hover:text-[#2563EB]">Privacy Policy</a>
            <a href="#" className="hover:text-[#2563EB]">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
