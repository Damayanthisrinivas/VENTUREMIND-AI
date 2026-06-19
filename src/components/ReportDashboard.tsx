import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Download,
  Printer,
  Edit2,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Lightbulb,
  Building2,
  Users,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MapPin,
  Play,
  Heart,
  Briefcase,
  HelpCircle,
  Layout,
  BookOpen,
  PieChart as PieIcon,
  ShieldCheck,
  Check,
  Percent,
  TrendingUp as IconTrending,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { StartupIdea, ValidationReport, Competitor, SlideContent } from "../types";

interface ReportDashboardProps {
  idea: StartupIdea;
  report: ValidationReport;
  onUpdateReport?: (newReport: ValidationReport) => void;
}

export default function ReportDashboard({ idea, report, onUpdateReport }: ReportDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "swot" | "competitors" | "canvas" | "financials" | "risks" | "pitch" | "recommendations"
  >("overview");

  // Pitch slide states
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [deckTheme, setDeckTheme] = useState<"dark" | "blue" | "emerald" | "warm">("dark");
  const [editingSlide, setEditingSlide] = useState<keyof typeof report.pitchDeck | null>(null);
  const [editedSlideTitle, setEditedSlideTitle] = useState("");
  const [editedSlideDetails, setEditedSlideDetails] = useState("");
  const [editedSlideBullets, setEditedSlideBullets] = useState<string[]>([]);

  // Local state update helper
  const triggerReportUpdate = (updatedReport: ValidationReport) => {
    if (onUpdateReport) {
      onUpdateReport(updatedReport);
    }
  };

  // Trigger browser PDF printing
  const handlePrint = () => {
    window.print();
  };

  // SWOT sectors
  const swotSectors = [
    { title: "STRENGTHS", data: report.swot.strengths, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", bulletColor: "bg-emerald-500" },
    { title: "WEAKNESSES", data: report.swot.weaknesses, bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", bulletColor: "bg-rose-500" },
    { title: "OPPORTUNITIES", data: report.swot.opportunities, bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", bulletColor: "bg-[#2563EB]" },
    { title: "THREATS", data: report.swot.threats, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", bulletColor: "bg-amber-500" }
  ];

  // Pitch Deck structured slides
  const slideKeys: Array<keyof typeof report.pitchDeck> = [
    "problem",
    "solution",
    "marketOpportunity",
    "businessModel",
    "competition",
    "revenueStrategy",
    "teamComposition",
    "financialModel",
    "fundingRequirements"
  ];

  const activeSlideKey = slideKeys[currentSlideIndex];
  const slideContent = report.pitchDeck[activeSlideKey];

  const handleEditSlideStart = () => {
    const activeSlide = slideContent as any;
    setEditingSlide(activeSlideKey);
    setEditedSlideTitle(activeSlide.title || "");
    setEditedSlideDetails(activeSlide.details || "");
    setEditedSlideBullets([...(activeSlide.bullets || activeSlide.allocation || [])]);
  };

  const handleSaveSlideChanges = () => {
    if (!editingSlide) return;
    const nextPitchDeck = { ...report.pitchDeck };
    if (editingSlide === "fundingRequirements") {
      nextPitchDeck.fundingRequirements = {
        ...nextPitchDeck.fundingRequirements,
        title: editedSlideTitle,
        allocation: editedSlideBullets
      };
    } else {
      (nextPitchDeck[editingSlide] as SlideContent) = {
        ...nextPitchDeck[editingSlide],
        title: editedSlideTitle,
        details: editedSlideDetails,
        bullets: editedSlideBullets
      };
    }

    const updated = {
      ...report,
      pitchDeck: nextPitchDeck
    };
    triggerReportUpdate(updated);
    setEditingSlide(null);
  };

  // Convert current report to JSON and download
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${idea.name}_Validation_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Title Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-white border border-gray-200 rounded-xl gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#2563EB] tracking-wider bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
            {idea.industry} IDEAS VALIDATOR
          </span>
          <h2 className="text-2xl font-display font-bold text-[#111827] tracking-tight mt-2">
            {idea.name} Co.
          </h2>
          <p className="text-gray-500 text-xs mt-1 max-w-xl font-normal leading-relaxed">
            "{idea.idea}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#111827] text-white hover:bg-gray-800 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto pb-1 gap-1 scrollbar-hide border-b border-gray-200">
        {(
          [
            { id: "overview", label: "Dashboard Overview", icon: Layout },
            { id: "swot", label: "SWOT Grid", icon: BookOpen },
            { id: "competitors", label: "Competitive Map", icon: Search },
            { id: "canvas", label: "Canvas Model", icon: Layers },
            { id: "financials", label: "Financial Forecasts", icon: DollarSign },
            { id: "risks", label: "Risk Mitigation", icon: ShieldCheck },
            { id: "pitch", label: "Pitch Slides", icon: Play },
            { id: "recommendations", label: "Acquisition Hacks", icon: Lightbulb }
          ] as const
        ).map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "border-[#2563EB] text-[#2563EB] font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Dashboard Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Scoring Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Startup Health Score
              </span>
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#2563EB"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * report.healthScore) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-xl font-extrabold text-blue-600">{report.healthScore}%</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Determined through problem feasibility and competitor defenses.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Market opportunity
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{report.marketOpportunityScore}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                <span>Exponential potential sector</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Venture Risk Assessment
                </span>
                <span
                  className={`text-lg font-extrabold mt-2 px-3 py-1 border rounded bg-slate-50 inline-block ${
                    report.riskLevel === "Low"
                      ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                      : report.riskLevel === "Medium"
                      ? "text-amber-600 border-amber-200 bg-amber-50"
                      : "text-rose-600 border-rose-200 bg-rose-50"
                  }`}
                >
                  {report.riskLevel} Risk Profile
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-normal">
                  Requires 5 mitigation paths as specified in safety matrix.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Avg. Validation Status
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{report.validationScore}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2" />
                <span>Investor standards approved</span>
              </div>
            </div>
          </div>

          {/* Sub Score Breakdown Progress bars */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <Sparkles className="w-4.5 h-4.5 mr-2 text-blue-600" />
                <span>AI Strategic Parameter Evaluation</span>
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Market Need / Demand Check", val: report.scores.marketNeed, color: "bg-blue-600" },
                  { label: "Problem-Solution Alignment", val: report.scores.problemSolutionFit, color: "bg-purple-600" },
                  { label: "Core Solution Innovation", val: report.scores.innovation, color: "bg-emerald-600" },
                  { label: "Business Model Scalability", val: report.scores.scalability, color: "bg-amber-600" },
                  { label: "Competitive Defense & Moat", val: report.scores.competitiveAdvantage, color: "bg-rose-600" },
                  { label: "Overall Venture Success Probability", val: report.scores.successProbability, color: "bg-blue-600" }
                ].map((s, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>{s.label}</span>
                      <span>{s.val}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.val}%`, backgroundColor: s.color === "bg-blue-600" ? "#2563EB" : s.color === "bg-purple-600" ? "#7C3AED" : s.color === "bg-emerald-600" ? "#10B981" : s.color === "bg-amber-600" ? "#F59E0B" : "#EF4444" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-tr from-blue-900 to-indigo-950 text-white rounded-2xl shadow-md border border-blue-950">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block font-mono">
                  Trending Market Insights
                </span>
                <h4 className="text-lg font-bold mt-2 text-white">
                  {report.marketTrends.trendingStatus}
                </h4>
                <div className="mt-4 space-y-2.5 text-xs text-blue-100/90 font-normal">
                  <p>
                    <span className="font-bold text-blue-400">Capital availability:</span> {report.marketTrends.capitalAvailability}
                  </p>
                  <p>
                    <span className="font-bold text-blue-400">Emerging regulatory forces:</span> {report.marketTrends.regulatoryForecast}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Core Tactical Improvement Areas
                </span>
                <ul className="mt-4 space-y-3">
                  {report.recommendations.improvements.slice(0, 3).map((imp, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 shrink-0 translate-y-0.5" />
                      <span className="font-medium leading-relaxed">{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SWOT Analysis Grid Tab */}
      {activeTab === "swot" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">SWOT Matrix Strategic Model</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Examine the core structural dynamics governing the potential success or failure of {idea.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {swotSectors.map((sector, sIdx) => (
              <div
                key={sIdx}
                className={`p-6 border rounded-2xl ${sector.bg} ${sector.border} shadow-sm space-y-4`}
              >
                <h4 className={`text-base font-extrabold ${sector.text} tracking-wider`}>
                  {sector.title}
                </h4>
                <ul className="space-y-3">
                  {sector.data.map((bullet, checkIdx) => (
                    <li key={checkIdx} className="flex items-start text-xs text-slate-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${sector.bulletColor} mr-2 shrink-0 translate-y-2`} />
                      <span className="font-medium leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === "competitors" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Custom Market Positioning Map */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Competitive Spatial Positioning Map</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualizing how your model positions relative to established market participants on custom price and technical capabilities axes.
              </p>
            </div>

            {/* Simulated Coordinate Plane Graph */}
            <div className="relative w-full h-80 bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden flex items-center justify-center">
              {/* Axes lines */}
              <div className="absolute w-full h-[1px] bg-slate-300" />
              <div className="absolute h-full w-[1px] bg-slate-300" />

              {/* Quadrant text coordinates */}
              <span className="absolute top-2 right-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                High Technology / Innovation
              </span>
              <span className="absolute bottom-2 left-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Lower Technology
              </span>
              <span className="absolute top-[48%] right-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Premium Pricing
              </span>
              <span className="absolute top-[48%] left-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Cost Leader
              </span>

              {/* Placement plots */}
              {report.competitors.marketMapping.map((item, idx) => {
                // Mapping -100..100 to 5%..95% limits
                const leftPos = `${50 + item.x * 0.4}%`;
                const topPos = `${50 - item.y * 0.4}%`;
                const isSubject = item.type === "subject";

                return (
                  <div
                    key={idx}
                    className="absolute"
                    style={{ left: leftPos, top: topPos }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 group">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          isSubject
                            ? "bg-blue-600 border-white shadow-lg scale-125 animate-pulse"
                            : "bg-purple-600 border-white shadow"
                        }`}
                      />
                      <span
                        className={`absolute left-5 top-0 text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded shadow border leading-none ${
                          isSubject
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Lists Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2" />
                <span>Direct Competitors Analyzed</span>
              </h3>

              <div className="space-y-4 font-normal">
                {report.competitors.direct.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800">{comp.name}</span>
                      <span className="text-[10px] font-mono bg-slate-200/60 px-2 py-0.5 rounded text-slate-5
                      ">
                        {comp.pricing}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{comp.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-200/50">
                      <div>
                        <span className="font-bold text-emerald-600 uppercase">STRENGTH</span>
                        <p className="text-slate-600 leading-tight mt-0.5">{comp.strength}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-600 uppercase">WEAKNESS</span>
                        <p className="text-slate-600 leading-tight mt-0.5">{comp.weakness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-2" />
                <span>Indirect Competitors Analyzed</span>
              </h3>

              <div className="space-y-4 font-normal">
                {report.competitors.indirect.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800">{comp.name}</span>
                      <span className="text-[10px] font-mono bg-slate-200/60 px-2 py-0.5 rounded text-slate-500">
                        {comp.pricing}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{comp.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-200/50">
                      <div>
                        <span className="font-bold text-emerald-600 uppercase">STRENGTH</span>
                        <p className="text-slate-600 leading-tight mt-0.5">{comp.strength}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-600 uppercase">WEAKNESS</span>
                        <p className="text-slate-600 leading-tight mt-0.5">{comp.weakness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Model Canvas Generator Tab */}
      {activeTab === "canvas" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Business Model Canvas Diagram</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                A structured visual modeling framework mapped precisely against industry standards.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print/Export Canvas Canvas</span>
            </button>
          </div>

          {/* Grid Canvas Section (Aesthetic 5-Column setup) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm p-2 text-slate-800">
            {/* Column 1: KP */}
            <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  1. KEY PARTNERS
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.keyPartners.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2: KA & KR */}
            <div className="space-y-4 flex flex-col">
              <div className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  2. KEY ACTIVITIES
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.keyActivities.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  3. KEY RESOURCES
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.keyResources.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: VALUE PROPS */}
            <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block font-mono">
                  4. VALUE PROPOSITIONS
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.valuePropositions.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 4: CR & CH */}
            <div className="space-y-4 flex flex-col">
              <div className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  5. CUSTOMER RELATIONSHIPS
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.customerRelationships.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  6. CHANNELS
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.channels.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 5: CS */}
            <div className="bg-white p-4 space-y-4 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
                  7. CUSTOMER SEGMENTS
                </span>
                <ul className="mt-3 space-y-2 text-xs font-normal">
                  {report.businessModelCanvas.customerSegments.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 shrink-0 translate-y-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Lower Grid: Costs & Revenues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block font-mono">
                8. COST STRUCTURE
              </span>
              <ul className="mt-3 space-y-2 text-xs font-normal">
                {report.businessModelCanvas.costStructure.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-600">
                    <span className="w-1.5 h-0.5 bg-rose-400 mr-2 shrink-0 translate-y-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block font-mono">
                9. REVENUE STREAMS
              </span>
              <ul className="mt-3 space-y-2 text-xs font-normal">
                {report.businessModelCanvas.revenueStreams.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs leading-relaxed text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0 translate-y-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Financial Predictions Tab */}
      {activeTab === "financials" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Est. Initial Monthly Revenue
                </span>
                <span className="text-2xl font-black text-slate-900 mt-2 block">
                  ${report.revenueForecast.estimatedMonthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Months to Break-Even
                </span>
                <span className="text-2xl font-black text-slate-900 mt-2 block font-mono">
                  ~ {report.revenueForecast.breakEvenMonths} Months
                </span>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Predictive ROI Percentage
                </span>
                <span className="text-2xl font-black text-slate-900 mt-2 block font-mono text-emerald-650">
                  {report.revenueForecast.roiPercentage}%
                </span>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Area charts of Revenue and Profits */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">5-Year Growth and Cash Projections</h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing scale thresholds comparing estimated cumulative revenue vs. calculated profit lines.
              </p>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.revenueForecast.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="year" fontSize={11} stroke="#94A3B8" />
                  <YAxis fontSize={11} stroke="#94A3B8" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="profit" name="Gross profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProf)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessments Tab */}
      {activeTab === "risks" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Multi-Dimensional Venture Risk Assessments</h3>
            <p className="text-xs text-slate-500 mt-1">
              Analyzing core risk vectors alongside pre-calculated industrial mitigation structures.
            </p>
          </div>

          <div className="space-y-4">
            {report.risks.map((risk, idx) => (
              <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm grid md:grid-cols-12 gap-6 items-center">
                {/* Risk Title & Score */}
                <div className="md:col-span-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">
                    {risk.type} Risk
                  </span>
                  <h4 className="text-base font-extrabold text-slate-800">{risk.type} Evaluation</h4>
                  <span
                    className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded border leading-none ${
                      risk.severity === "Low"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : risk.severity === "Moderate"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-rose-50 text-rose-600 border-rose-200"
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                </div>

                {/* Score slider mockup */}
                <div className="md:col-span-3 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-550 mb-1">
                    <span>Incidence Ratio</span>
                    <span className="font-mono">{risk.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${risk.score}%` }} />
                  </div>
                </div>

                {/* Mitigation strategies */}
                <div className="md:col-span-6 space-y-2 text-xs font-normal">
                  <p className="text-slate-500">
                    <span className="font-bold text-slate-700 block">DESCRIPTION</span>
                    {risk.description}
                  </p>
                  <p className="text-blue-700 bg-blue-50/50 border border-blue-100/55 p-2 rounded-lg leading-relaxed mt-1">
                    <span className="font-bold text-blue-700 tracking-wide block uppercase text-[8px] mb-0.5 font-mono">Suggested Mitigation Blueprint</span>
                    {risk.mitigation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investor Pitch Slides Tab */}
      {activeTab === "pitch" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Deck Options Bar */}
          <div className="bg-white p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-slate-450 tracking-wide uppercase font-mono">
                PITCH DECK BUILDER / VIEWER
              </span>
              <h3 className="text-sm font-bold text-slate-700">Slide {currentSlideIndex + 1} of {slideKeys.length} • {activeSlideKey.toUpperCase()}</h3>
            </div>

            {/* Themes selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold block mr-1.5 uppercase font-mono">🎨 Layout:</span>
              {[
                { id: "dark", label: "Dark Onyx", bg: "bg-slate-900 border-slate-700" },
                { id: "blue", label: "Midnight Blue", bg: "bg-blue-900 border-blue-700" },
                { id: "emerald", label: "Forest Emerald", bg: "bg-emerald-900 border-emerald-700" },
                { id: "warm", label: "Warm Earth", bg: "bg-amber-950 border-amber-900" }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setDeckTheme(theme.id as any)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                    deckTheme === theme.id
                      ? "bg-slate-900 text-white border-blue-500 shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Slide Screen */}
          <div
            className={`w-full min-h-[380px] rounded-xl p-6 sm:p-10 text-white flex flex-col justify-between relative transition-all shadow-md border-t border-white/10 ${
              deckTheme === "dark"
                ? "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-950"
                : deckTheme === "blue"
                ? "bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950"
                : deckTheme === "emerald"
                ? "bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950"
                : "bg-gradient-to-tr from-amber-950 via-neutral-900 to-stone-900"
            }`}
          >
            {/* Slide Header logo block */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center font-bold text-[10px]">VM</div>
                <span className="text-xs font-bold tracking-widest uppercase font-mono">{idea.name}</span>
              </div>
              <span className="text-[10px] font-mono font-medium tracking-wide text-white/40 uppercase">Venture Pitch Deck</span>
            </div>

            {/* Slide Principal Content */}
            <div className="my-8 space-y-4">
              {editingSlide === activeSlideKey ? (
                // Editable mode inputs
                <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <label className="block text-[10px] text-zinc-300 font-bold uppercase mb-1">Slide Title</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 text-white outline-none border border-zinc-700 rounded p-1 text-sm font-bold"
                      value={editedSlideTitle}
                      onChange={(e) => setEditedSlideTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-300 font-bold uppercase mb-1">Concept Summary</label>
                    <textarea
                      className="w-full bg-slate-800 text-white outline-none border border-zinc-700/80 rounded p-1 text-xs"
                      rows={3}
                      value={editedSlideDetails}
                      onChange={(e) => setEditedSlideDetails(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-300 font-bold uppercase mb-1">Bullet Factors (Comma separated)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 text-white outline-none border border-zinc-700 rounded p-1 text-xs"
                      value={editedSlideBullets.join(", ")}
                      onChange={(e) => setEditedSlideBullets(e.target.value.split(", "))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setEditingSlide(null)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-semibold"
                    >
                      Bail
                    </button>
                    <button
                      onClick={handleSaveSlideChanges}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-[10px] font-semibold"
                    >
                      Hold Save
                    </button>
                  </div>
                </div>
              ) : (
                // Read-only sliding display
                <div className="space-y-4 animate-slideIn">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{(slideContent as any).title}</h2>
                  {(slideContent as any).details && (
                    <p className="text-sm text-zinc-350 bg-white/5 p-3 rounded-xl leading-relaxed italic border border-white/5 font-normal">
                      "{(slideContent as any).details}"
                    </p>
                  )}

                  {/* Bullet features */}
                  <ul className="grid sm:grid-cols-2 gap-3.5 pt-2">
                    {(((slideContent as any).bullets || (slideContent as any).allocation || []) as string[]).map((bullet, checkIdx) => (
                      <li key={checkIdx} className="flex items-start text-xs text-zinc-200">
                        <Check className="w-4 h-4 text-blue-400 mr-2.5 shrink-0 translate-y-0.5" />
                        <span className="leading-relaxed font-normal">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Custom fields check */}
                  {activeSlideKey === "marketOpportunity" && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-zinc-400 block uppercase">TAM</span>
                        <span className="text-base font-bold text-white">{(slideContent as any).tam || "$12B"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-400 block uppercase">SAM</span>
                        <span className="text-base font-bold text-blue-400">{(slideContent as any).sam || "$1.4B"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-400 block uppercase">SOM</span>
                        <span className="text-base font-bold text-emerald-400">{(slideContent as any).som || "$200M"}</span>
                      </div>
                    </div>
                  )}

                  {activeSlideKey === "fundingRequirements" && (
                    <div className="pt-4 border-t border-white/10 text-center font-mono flex justify-between items-center bg-white/5 p-4 rounded-xl">
                      <span className="text-xs font-bold text-zinc-400">FUNDING TARGET DEMAND</span>
                      <span className="text-xl font-extrabold text-blue-400">
                        {(report.pitchDeck.fundingRequirements as any).amount || "$1,250,500 Seed"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Slide Footer and Controllers */}
            <div className="flex justify-between items-center border-t border-white/10 pt-4 text-xs font-semibold text-zinc-400">
              <button
                onClick={handleEditSlideStart}
                disabled={editingSlide !== null}
                className="flex items-center space-x-1 hover:text-white transition-colors text-[11px]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Slide Text</span>
              </button>

              <div className="flex items-center space-x-3 text-white">
                <button
                  onClick={() => setCurrentSlideIndex(v => Math.max(0, v - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-1 px-2.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-zinc-400 text-[11px] font-bold">
                  {currentSlideIndex + 1} / {slideKeys.length}
                </span>
                <button
                  onClick={() => setCurrentSlideIndex(v => Math.min(slideKeys.length - 1, v + 1))}
                  disabled={currentSlideIndex === slideKeys.length - 1}
                  className="p-1 px-2.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Strategy Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Title */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">AI Venture Growth & Expansion Playbook</h3>
            <p className="text-xs text-slate-500 mt-1">
              Contextual strategy recommendations designed securely by the Gemini business modeling cluster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monetization */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                <span>Monetization Strategies</span>
              </h4>
              <ul className="space-y-3 font-normal">
                {report.recommendations.monetization.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 translate-y-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acquisition */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center">
                <IconTrending className="w-5 h-5 mr-2 text-purple-600" />
                <span>Scalable Growth & Acquisition Hacks</span>
              </h4>
              <ul className="space-y-3 font-normal">
                {report.recommendations.customerAcquisition.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 translate-y-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Viral Growth hacks */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-600" />
                <span>Growth Engineering Hacks</span>
              </h4>
              <ul className="space-y-3 font-normal">
                {report.recommendations.growthHacks.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 translate-y-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Funding Sources */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-amber-600" />
                <span>Recommended Funding Sources</span>
              </h4>
              <ul className="space-y-3 font-normal">
                {report.recommendations.fundingSources.map((item, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 translate-y-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
