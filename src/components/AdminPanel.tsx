import { useState } from "react";
import {
  Users,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  BarChart,
  Activity,
  UserCheck,
  ShieldAlert
} from "lucide-react";
import { ResponsiveContainer, BarChart as ChartBar, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AdminPanelProps {
  onSeedTemplate?: () => void;
}

export default function AdminPanel({ onSeedTemplate }: AdminPanelProps) {
  const [stats, setStats] = useState({
    usersCount: 384,
    totalValidations: 1259,
    avgHealth: 84.6,
    activeVMS: 4,
  });

  const [simulatedLogs, setSimulatedLogs] = useState<Array<{ id: string; user: string; action: string; time: string }>>([
    { id: "l1", user: "dev@venturemind-ai.io", action: "Validated AgroDron concept (Score: 89%)", time: "Just now" },
    { id: "l2", user: "investor_conrad@gl.com", action: "Exported slide deck PDF", time: "4 mins ago" },
    { id: "l3", user: "nadia_medscribe@gmail.com", action: "Created MedScribe community thread", time: "11 mins ago" },
    { id: "l4", user: "vitalik_ledger@eth.org", action: "Modified financial canvas sliders", time: "22 mins ago" }
  ]);

  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState("Optimal / Fully Autonomous");

  // Chart data
  const trafficData = [
    { day: "Mon", validations: 22 },
    { day: "Tue", validations: 34 },
    { day: "Wed", validations: 41 },
    { day: "Thu", validations: 38 },
    { day: "Fri", validations: 45 },
    { day: "Sat", validations: 18 },
    { day: "Sun", validations: 29 }
  ];

  const handleRunSimulator = () => {
    setLoading(true);
    setTimeout(() => {
      // Add fake activity log
      const usersList = ["elon@tesla.com", "steve@apple.com", "sarah@agrotech.io", "conrad@ycombinator.com"];
      const actionList = ["Dispatched Advisory prompt", "Generated SWOT Grid", "Updated financial customer scale factor", "Deleted sandbox draft"];
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
      const randomAction = actionList[Math.floor(Math.random() * actionList.length)];

      const freshLog = {
        id: `l_${Date.now()}`,
        user: randomUser,
        action: randomAction,
        time: "Just now"
      };

      setSimulatedLogs(prev => [freshLog, ...prev.slice(0, 5)]);
      setStats(prev => ({
        ...prev,
        totalValidations: prev.totalValidations + 1,
        usersCount: prev.usersCount + (Math.random() > 0.5 ? 1 : 0)
      }));
      setLoading(false);
    }, 600);
  };

  const handleSeedAction = () => {
    if (onSeedTemplate) {
      onSeedTemplate();
    }
    alert("Seeded database with prime startup models including MedScribe, SolarGrid Drone and Escrow Ledger!");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-450 uppercase tracking-widest font-mono">
            ADMINISTRATOR INTELLIGENCE CONSOLE
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center">
            <ShieldAlert className="w-5 h-5 text-indigo-600 mr-2" />
            <span>VentureMind Admin Central</span>
          </h2>
          <p className="text-xs text-slate-505 text-slate-500 font-normal leading-relaxed mt-1">
            Examine platform analytics, simulate traffic behaviors and moderate user collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedAction}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 font-normal transition-all"
          >
            Seed Prime Models
          </button>
          <button
            onClick={handleRunSimulator}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Simulate Live Client Traffic</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Total Platform Users", value: stats.usersCount, sub: "+12% this week", color: "text-blue-600 bg-blue-50" },
          { icon: Database, label: "Database Health Status", value: dbStatus, sub: "Firestore database synced", color: "text-emerald-600 bg-emerald-50", isString: true },
          { icon: Activity, label: "Average Startup Health", value: `${stats.avgHealth}%`, sub: "Above global VC baseline", color: "text-indigo-600 bg-indigo-50" },
          { icon: BarChart, label: "Cumulative Analyses", value: stats.totalValidations, sub: "+39 today", color: "text-purple-600 bg-purple-50" }
        ].map((item, i) => (
          <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start space-x-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                {item.label}
              </span>
              <span className={`font-extrabold text-slate-800 mt-1 block ${typeof item.value === "string" ? "text-sm" : "text-xl"}`}>
                {item.value}
              </span>
              <span className="text-[10px] text-slate-450 block font-normal leading-none mt-1">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graph & Logs */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Validations Traffic Chart */}
        <div className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Weekly Validation Traffic Analysis</h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing cumulative validated concepts generated by daily users.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ChartBar data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" fontSize={11} stroke="#94A3B8" />
                <YAxis fontSize={11} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="validations" name="Completed Validations" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </ChartBar>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Simulation Audit Logs */}
        <div className="lg:col-span-5 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Real-time Platform Activity Monitor</h3>
            <p className="text-xs text-slate-500 mt-1">
              Reflecting live transactions happening in sandbox container environments.
            </p>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {simulatedLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 font-mono">
                  <span className="text-indigo-650 text-indigo-600">{log.user}</span>
                  <span>{log.time}</span>
                </div>
                <p className="text-slate-700 leading-normal font-medium mt-0.5">
                  {log.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
