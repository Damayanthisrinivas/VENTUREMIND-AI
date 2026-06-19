import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layout,
  BookOpen,
  Search,
  Layers,
  DollarSign,
  ShieldCheck,
  Play,
  Lightbulb,
  MessageSquare,
  Users,
  Building,
  History,
  Settings,
  LogOut,
  User,
  PlusCircle,
  TrendingUp,
  Award,
  Bell,
  Sidebar,
  Menu,
  X,
  Loader2,
  Trash2,
  ChevronRight,
  Database,
  ArrowRight,
  Monitor
} from "lucide-react";

import { StartupIdea, ValidationReport } from "./types";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";

// Component imports
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import ReportDashboard from "./components/ReportDashboard";
import HelpChat from "./components/HelpChat";
import CommunityForum from "./components/CommunityForum";
import AdminPanel from "./components/AdminPanel";

// Seeded sample ideas to avoid empty states on initial boot
const PRELOADED_IDEAS: StartupIdea[] = [
  {
    id: "seed_idea_1",
    name: "AgroDron Soil-Moisture",
    idea: "Automated crop soil-moisture measuring drone hives in high-heat thermal zones.",
    industry: "AgriTech",
    targetCustomers: "Industrial farming operators, agricultural land owners",
    problemStatement: "Unexpected droughts ruining crops due to lack of real-time soil analysis.",
    solution: "A network of solar-charged drones scanning field moisture and reporting directly to smart irrigation lines.",
    region: "USA West"
  },
  {
    id: "seed_idea_2",
    name: "BlockChain Ledger Escrow",
    idea: "Smart contract-driven real estate trust escrow accounting platform.",
    industry: "FinTech",
    targetCustomers: "Real estate brokers, commercial escrows, bank processors",
    problemStatement: "Escrow settlements take up to 45 days with massive auditing fee overheads.",
    solution: "An automated real estate transaction escrow trust network integrating direct financial legers via smart contracts.",
    region: "APAC Central"
  }
];

// Preloaded corresponding reports
const PRELOADED_REPORTS: Record<string, ValidationReport> = {
  seed_idea_1: {
    id: "seed_rep_1",
    ideaId: "seed_idea_1",
    validationScore: 84,
    marketOpportunityScore: 91,
    riskLevel: "Medium",
    revenuePotential: "High",
    growthTrends: "Upward",
    healthScore: 88,
    scores: {
      marketNeed: 92,
      problemSolutionFit: 86,
      innovation: 89,
      scalability: 82,
      competitiveAdvantage: 85,
      successProbability: 84
    },
    swot: {
      strengths: [
        "Unmatched real-time granularity mapping moisture levels",
        "Low core hardware operational requirements through solar stations",
        "Immediate high-value protection prevents crop wastage",
        "Unique direct API links into modern smart irrigation systems"
      ],
      weaknesses: [
        "High initial client acquisition fees and implementation barriers",
        "Dynamic high dry wind states impact multirotor flight periods",
        "Hardware failures demand localized hardware repair technicians",
        "Strict domestic spatial drone flight zoning guidelines"
      ],
      opportunities: [
        "Rapid market rollout globally in severe dry drought belts",
        "Carbon footprint incentive program rewards automated irrigation",
        "Potential metadata sale agreements with state hydrology sectors",
        "Autonomous expansion leveraging emerging lightweight chemical soil metrics"
      ],
      threats: [
        "Established large agriculture brands releasing tracking pods",
        "Satellite thermal monitoring resolution improving rapidly",
        "Increasing global lithium-battery supply limitations",
        "Regional privacy legal constraints of field observation cameras"
      ]
    },
    competitors: {
      direct: [
        {
          name: "AgriTrack Pods",
          description: "Statically grounded soil probes that report moisture metrics daily.",
          pricing: "$450 / pod yearly",
          strength: "Heavy durability against extreme winter weather.",
          weakness: "Zero mobility, requiring 200+ units to cover moderate fields."
        },
        {
          name: "DroneSoil Inc.",
          description: "Traditional piloted drone inspection imagery analysis company.",
          pricing: "$2500 / pilot day scan",
          strength: "Extremely high flight range and quality metrics.",
          weakness: "Requires fully manual local human operator visits."
        }
      ],
      indirect: [
        {
          name: "Hydrotropics Satellite Map",
          description: "Hourly thermal heat spectrum analyses taken from low-orbit.",
          pricing: "Enterprise subscription models",
          strength: "Comprehensive landscape view without localized machines.",
          weakness: "Extreme fog/cloud atmospheric blockages prevent visual reads."
        }
      ],
      advantages: [
        "Fully autonomous solar docking eliminates operational pilots.",
        "Hyper local spatial probes provide 10x higher granularity than orbit metrics.",
        "Provides plug-and-play API relays right into industrial valves."
      ],
      marketMapping: [
        { name: "AgriTrack Pods", x: -45, y: -20, type: "competitor" },
        { name: "DroneSoil Inc.", x: 60, y: 35, type: "competitor" },
        { name: "VentureMind (Your Concept)", x: 20, y: 75, type: "subject" }
      ]
    },
    businessModelCanvas: {
      keyPartners: ["Local smart-valve hardware providers", "Agricultural cooperative associations", "Lithium-solar pack micro distributors"],
      keyActivities: ["Custom airspace software refinement", "Proactive drone cellular support layers", "Enterprise farm marketing"],
      keyResources: ["Localized multirotor guidance IP", "Remote cloud hydrology analytics", "Local field support networks"],
      valuePropositions: ["Up to 34% crop waste mitigation from dryness", "Fully autonomous hands-off soil health observation", "Automated custom valve scheduling integration"],
      customerRelationships: ["Direct localized onboarding consulting", "Enterprise SLA support structures", "Yearly field health checks"],
      customerSegments: ["Large industrial crop operators", "Family crop owners with 500+ acres", "Hydrology research groups"],
      channels: ["Farming machinery dealerships", "Rural agricultural software lists", "AgriTech conferences"],
      costStructure: ["Advanced drone component assembly", "SaaS cloud server processing", "Enterprise sales commissions"],
      revenueStreams: ["Yearly physical hive lease plans", "SaaS analytics monitoring subscriptions", "Premium custom integration fees"]
    },
    revenueForecast: {
      estimatedMonthlyRevenue: 12500,
      breakEvenMonths: 14,
      roiPercentage: 320,
      chartData: [
        { year: "Year 1", revenue: 150000, profit: 45000, customers: 12, cost: 105000 },
        { year: "Year 2", revenue: 380000, profit: 180000, customers: 30, cost: 200000 },
        { year: "Year 3", revenue: 890000, profit: 512000, customers: 70, cost: 378000 },
        { year: "Year 4", revenue: 1950000, profit: 1210000, customers: 150, cost: 740000 },
        { year: "Year 5", revenue: 4200000, profit: 2950000, customers: 310, cost: 1250000 }
      ]
    },
    risks: [
      {
        type: "Technical",
        score: 65,
        severity: "Moderate",
        description: "Multirotor dynamic flight stability declines significantly under 45kn winds.",
        mitigation: "Deploy heavy carbon-constructed heavy framing and weather-aware local routing."
      },
      {
        type: "Financial",
        score: 42,
        severity: "Moderate",
        description: "Farm cash flows are seasonal, impacting summer onboarding budget limits.",
        mitigation: "Structured custom payment models spreading SaaS overheads over the full fiscal calendar."
      },
      {
        type: "Market",
        score: 35,
        severity: "Low",
        description: "Slow traditional technology adoption rates by historic agrarian farmers.",
        mitigation: "Launch interactive low-cost local co-op land pilot trials proving definite water saving factors."
      },
      {
        type: "Operational",
        score: 55,
        severity: "Moderate",
        description: "Hardware micro-accidents on drone propellers during storms demands physical parts replacement.",
        mitigation: "Bundle simple replacement prop components inside the solar docking hives on initial ship-out."
      },
      {
        type: "Legal & Regulatory",
        score: 75,
        severity: "High",
        description: "Government drone zoning mandates could restrict constant unpiloted airspace use.",
        mitigation: "Adhere to specific low-level FAA crop flight exemptions and hold integrated transponder tags."
      }
    ],
    pitchDeck: {
      problem: {
        title: "Agrarian Yield Dryness Epidemic",
        details: "Farmers lose millions to drought because grounded sensors are static and low-resolution satellite thermal scans cannot see crop rot early enough.",
        bullets: ["Millions of tons of seasonal crops destroyed", "Inaccurate water deployment wastes reservoirs", "Water overheads are rising up to 45% yearly"]
      },
      solution: {
        title: "Autonomous AgroDron Moat",
        details: "A fully automatic, solar-docked drone squad that monitors soils centimeter by centimeter and guides smart valves.",
        bullets: ["Eliminates human observation pilot overheads", "Syncs directly to digital hydrology lines", "Saves an average of 34% baseline irrigation water"]
      },
      marketOpportunity: {
        title: "Global Agrarian Airspace TAM",
        details: "Scaling throughout major drought segments in USA, Southern Europe, and APAC agricultural clusters.",
        bullets: ["Rapidly growing AgriTech drone sectors", "Carbon asset credit programs incentivizing automated sensors", "Addressable regional farm acreage is 80M+"],
        tam: "$15.4 Billion",
        sam: "$2.9 Billion",
        som: "$350 Million"
      },
      businessModel: {
        title: "Hardware Leasing Meets SaaS Monitor",
        details: "Providing custom weather-durable solar hives containing 3 fully automated drones alongside predictive analytics.",
        bullets: ["$12,500 system lease yearly per hive module", "$499/mo premium analytical mapping client access", "32% gross margins on custom hardware constructs"]
      },
      competition: {
        title: "Probs & Manual Drone Operators Excluded",
        details: "Traditional probes require tedious deployment wiring. Manual drone pilots are expensive. AgroDron automated.",
        bullets: ["Autonomous solar charging solves pilots", "10x higher data precision compared to satellite orbits", "Fully active real-time API relay into smart valves"]
      },
      revenueStrategy: {
        title: "Regional Land Co-operative Expansion",
        details: "Leverage agrarian co-ops representing 400+ farms per region to quickly acquire warm enterprise leads.",
        bullets: ["Referral credit models for active users", "Direct field agent training demonstrations", "Incentivized organic soil study releases"]
      },
      teamComposition: {
        title: "Drone Engineers & Farm Sales Founders",
        details: "Target team composition designed to build spatial sensors and navigate agrarian cooperatives.",
        bullets: ["Hydrologist expert and mapping lead", "Multirotor hardware fabrication specialist", "Regional enterprise farming sales lead"]
      },
      financialModel: {
        title: "Breakeven Within 14 Months",
        details: "Conservative outlook projecting strong growth from agrarian cooperative bulk licensing deals.",
        bullets: ["Predicting $380,000 gross revenues in Yo2", "Target profit margins of 68% over SaaS layers", "Scaling to 310 active farm modules within 5 years"],
        breakEven: "Projected within 14 fiscal operational months."
      },
      fundingRequirements: {
        title: "Targeting $1,250,500 Seed Financing",
        amount: "$1,250,500 Seed Investment",
        allocation: ["55% - Drone sensors fabrication & drone assemblies", "25% - Cloud core data pipelines & smart valve APIs", "20% - Local agrarian co-operative sales campaign"]
      }
    },
    recommendations: {
      improvements: [
        "Include soil-nitrogen chemical trackers inside the payload.",
        "Secure early smart-valve hardware supply contracts to save 15% fabrication overheads.",
        "Incorporate an emergency thermal locator in case of storms."
      ],
      monetization: [
        "Create carbon credit offsets directly inside the dashboard",
        "Charge premium field diagnostics reports to consulting agronomists",
        "Offer custom API micro-licenses to smart sensor partners"
      ],
      customerAcquisition: [
        "Host live water reduction live tests during state agrarian expos.",
        "Offer 30-day trial scopes to major regional farm coordinates.",
        "Partner directly with agricultural university extension loops."
      ],
      growthHacks: [
        "Launch a digital dry-risk maps public platform showing dry-risk stats.",
        "Implement up to 15% co-op member discount programs.",
        "Release open-source soil moisture analytical modules."
      ],
      fundingSources: [
        "Agricultural technology state development micro grants",
        "Deep-tech food security climate venture capital systems",
        "Clean water asset development funding partners"
      ]
    },
    marketTrends: {
      trendingStatus: "Extremely Bullish / Hyper-Growth",
      techDrivers: ["Low-weight battery improvements", "Advanced drone spatial algorithms"],
      capitalAvailability: "Over $450M deployed across AgriTech climate projects this year.",
      regulatoryForecast: "Favorable FAA drone autonomous low-flight field exclusions."
    }
  },
  seed_idea_2: {
    id: "seed_rep_2",
    ideaId: "seed_idea_2",
    validationScore: 78,
    marketOpportunityScore: 82,
    riskLevel: "High",
    revenuePotential: "Exponential",
    growthTrends: "Stable",
    healthScore: 80,
    scores: {
      marketNeed: 85,
      problemSolutionFit: 80,
      innovation: 83,
      scalability: 88,
      competitiveAdvantage: 75,
      successProbability: 78
    },
    swot: {
      strengths: [
        "Settlements completed inside 24 hours compared to 45 traditional days",
        "Eradicates standard bank escrow manual auditing human fee overheads",
        "Encrypted blockchain immutability prevents financial escrow fraudulence",
        "Direct smart contract compliance rules automate settlement payouts"
      ],
      weaknesses: [
        "Extremely steep compliance burdens across local banking jurisdictions",
        "Requires active bank manager approvals and ledger API coordinates",
        "Security attacks on smart contract coding could compromise transactions",
        "High trust barriers from classical real estate agents"
      ],
      opportunities: [
        "Expansion into title insurance automated audits",
        "Cross-border land transaction support solving currency transfers",
        "Integration into emerging tokenized property registries",
        "Exclusive white-labeling for national broker networks"
      ],
      threats: [
        "Rapid change in digital asset legal regulations globally",
        "Traditional bank groups releasing private clearing ledgers",
        "Security attacks targeting central smart contract code lines",
        "Title agent lobby pressure aiming to lock out digital automated escrow"
      ]
    },
    competitors: {
      direct: [
        {
          name: "Escrow.com",
          description: "Classical online digital escrow framework with manual operations.",
          pricing: "0.85% to 3.25% transaction fee",
          strength: "Heavy domestic trust and 20+ years brand authority.",
          weakness: "Slow settlement periods requiring manual review of wires."
        }
      ],
      indirect: [
        {
          name: "Traditional Commercial Banks",
          description: "Standard domestic banks acting as escrow ledger systems.",
          pricing: "$500+ static processing fees",
          strength: "Total regulatory safety insurance guarantees.",
          weakness: "Tedious physical paper checks and 30-day auditing lines."
        }
      ],
      advantages: [
        "10x faster settlement using real-time smart contracts.",
        "Drastically reduced transaction commissions (from 1.5% down to 0.15%).",
        "Verifiably tamper-proof compliance ledger records."
      ],
      marketMapping: [
        { name: "Escrow.com", x: -20, y: -40, type: "competitor" },
        { name: "Commercial Banks", x: 80, y: -80, type: "competitor" },
        { name: "VentureMind (Your Concept)", x: -60, y: 65, type: "subject" }
      ]
    },
    businessModelCanvas: {
      keyPartners: ["Qualified financial custodians", "State legal compliance auditors", "National land agency registries"],
      keyActivities: ["Banking API connection setup", "Tamper-proof smart contract audits", "Corporate trust consulting"],
      keyResources: ["Proprietary settlement pipeline patents", "Multi-sig escrow clearing pools", "Active state escrow micro-licenses"],
      valuePropositions: ["Escrow release finalized in hours instead of weeks", "Transaction clearing commissions diminished by 85%", "Automated compliance checks verified on ledger"],
      customerRelationships: ["Enterprise account management", "Continuous SLA security updates", "Automated compliance logs"],
      customerSegments: ["Modern real-estate brokerages", "Online commercial transaction desks", "Tech-fluent commercial property buyers"],
      channels: ["Real-estate technology portals", "Legal escrow state directories", "Global FinTech forums"],
      costStructure: ["Smart contract security audits", "Fiat-crypto liquidity pools", "Regulatory validation licensing"],
      revenueStreams: ["0.25% per transaction processing fee", "SaaS broker monitoring platform fees", "Custom integration setup packages"]
    },
    revenueForecast: {
      estimatedMonthlyRevenue: 18000,
      breakEvenMonths: 18,
      roiPercentage: 450,
      chartData: [
        { year: "Year 1", revenue: 220000, profit: 80000, customers: 40, cost: 140000 },
        { year: "Year 2", revenue: 650000, profit: 310000, customers: 110, cost: 340000 },
        { year: "Year 3", revenue: 1600000, profit: 890000, customers: 300, cost: 710000 },
        { year: "Year 4", revenue: 4200000, profit: 2600000, customers: 850, cost: 1600000 },
        { year: "Year 5", revenue: 9500000, profit: 6400000, customers: 2100, cost: 3100000 }
      ]
    },
    risks: [
      {
        type: "Technical",
        score: 75,
        severity: "High",
        description: "Coding bugs in multi-signature settlement smart contract templates.",
        mitigation: "Require 3 consecutive third-party CertiK and OpenZeppelin security audits before mainnet deployment."
      },
      {
        type: "Financial",
        score: 60,
        severity: "Moderate",
        description: "Extreme capital liquidity demands in escrow pools for huge property purchases.",
        mitigation: "Partner with institutional clearing bank partners to supply clearing guarantees and security backing."
      },
      {
        type: "Market",
        score: 45,
        severity: "Moderate",
        description: "Low initial technology trust factor within traditional mortgage networks.",
        mitigation: "Provide multi-million dollar fraud insurance protection per transaction ledger unit."
      },
      {
        type: "Operational",
        score: 50,
        severity: "Moderate",
        description: "Customer service needs during complicated transaction dispute resolutions.",
        mitigation: "Configure an integrated legal multi-signature dispute resolution board with clear escrow terms."
      },
      {
        type: "Legal & Regulatory",
        score: 85,
        severity: "High",
        description: "Local licensing mandates vary extremely across state regulatory bounds.",
        mitigation: "Partner with an established National Trust bank to bypass direct single-state registration barriers."
      }
    ],
    pitchDeck: {
      problem: {
        title: "The Sluggish 40-Day Funding Bottleneck",
        details: "Traditional transaction escrows take up to 45 days. Heavy human clearing overheads inflate fees, and security risks are prone to wire fraud.",
        bullets: ["Transaction processing takes weeks", "Escrow audit commissions exceed 1.5%", "Escrows suffer frequent wire fraud compromises"]
      },
      solution: {
        title: "Tamper-Proof Escrow Ledgers",
        details: "Automating transaction clearances utilizing direct smart-contract trust networks.",
        bullets: ["Escrows completed within 24 hours", "Cuts escrow clearing fees by 85%", "Tamper-proof blockchain security models"]
      },
      marketOpportunity: {
        title: "Massive Real Estate Volume TAM",
        details: "Focusing initially on tech-fluent commercial purchases for online asset transactions.",
        bullets: ["Addressable real estate fee TAM is $45B", "Rising digital contract adoption worldwide", "High margins in tokenized assets"],
        tam: "$45.2 Billion",
        sam: "$4.1 Billion",
        som: "$410 Million"
      },
      businessModel: {
        title: "Per-Transaction Processing Commissions",
        details: "Charging clean processing micro-commissions per validated smart contract transaction cleared.",
        bullets: ["0.25% transaction commission", "$199/mo brokerage cloud statistics dashboards", "Premium customization APIs for volume partners"]
      },
      competition: {
        title: "Banks & Manual Wire Networks Lacking Speed",
        details: "Classic banks rely on tedious physical signatures. Standard sites suffer long verification delays.",
        bullets: ["10x faster settlement velocities", "Tamper-proof auditing compliance logbooks", "Dramatically lower clearing overheads"]
      },
      revenueStrategy: {
        title: "Tech-Fluent Property Broker Partnerships",
        details: "Direct integrations with modern digital real estate platforms to capture high transactional volume.",
        bullets: ["Volume-based fee rebates", "Custom CRM software link systems", "Co-marketing campaign channels"]
      },
      teamComposition: {
        title: "Blockchain Architects & Compliance Pros",
        details: "Assembling developers fluent in smart contract coding and executives experienced in financial licensing.",
        bullets: ["Lead financial security tech architect", "Regulatory legal escrow officer", "Enterprise bank sales VP"]
      },
      financialModel: {
        title: "Targeting $220k Revenue Yr 1",
        details: "Scaling through volume transactions as broker partnerships go live across the country.",
        bullets: ["Yo3 transactional volumes reaching $100M", "High operating leverage from automated code layers", "Projecting $6.4M net margins in Year 5"],
        breakEven: "Escrow clearing volume yields break-even inside 18 months."
      },
      fundingRequirements: {
        title: "Projecting $1.5M Venture Capital Demand",
        amount: "$1,500,000 Venture Round",
        allocation: ["45% - High grade security smart contract audits", "35% - Multi-state compliance licensing & escrow bonds", "20% - Enterprise commercial broker sales"]
      }
    },
    recommendations: {
      improvements: [
        "Include automated digital notary seals in the platform.",
        "Obtain early SOC2 category compliance stamps.",
        "Verify contract templates via multi-sig testnets."
      ],
      monetization: [
        "White-label title audit portals for luxury developers",
        "Charge API connectivity licenses to legal firms",
        "Offer premium dispute settlement support tiers"
      ],
      customerAcquisition: [
        "Integrate with PropTech brokers via direct API connections.",
        "Host digital asset escrow compliance courses.",
        "Sponsor prominent FinTech showcase assemblies."
      ],
      growthHacks: [
        "Draft transactional fee calculator web widgets.",
        "Partner with regional luxury title chambers.",
        "Configure simple digital land tokenization guides."
      ],
      fundingSources: [
        "Global FinTech accelerator system seed funds",
        "Real-estate venture growth equity partnerships",
        "Secured bank credit clearing pools"
      ]
    },
    marketTrends: {
      trendingStatus: "Optimistic / Steady Growth",
      techDrivers: ["Digital ledger upgrades", "Smart contract platform growth"],
      capitalAvailability: "Over $1.2B deployed across blockchain trust platforms globally this fiscal period.",
      regulatoryForecast: "Stabilizing state regulations regarding secure digital transactions."
    }
  }
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<
    "landing" | "auth" | "dashboard" | "new-validator" | "report" | "chat" | "community" | "admin"
  >("landing");

  // Database tracking state
  const [ideas, setIdeas] = useState<StartupIdea[]>(PRELOADED_IDEAS);
  const [reports, setReports] = useState<Record<string, ValidationReport>>(PRELOADED_REPORTS);

  const [selectedIdea, setSelectedIdea] = useState<StartupIdea | null>(null);
  const [selectedReport, setSelectedReport] = useState<ValidationReport | null>(null);

  // Form inputs for new analyses
  const [newIdeaName, setNewIdeaName] = useState("");
  const [newIdeaConcept, setNewIdeaConcept] = useState("");
  const [newIdeaIndustry, setNewIdeaIndustry] = useState("AgriTech");
  const [newIdeaTarget, setNewIdeaTarget] = useState("");
  const [newIdeaProblem, setNewIdeaProblem] = useState("");
  const [newIdeaSolution, setNewIdeaSolution] = useState("");
  const [newIdeaRegion, setNewIdeaRegion] = useState("Global / Multiregion");

  const [loading, setLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UI state for sidebar responsiveness
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronize Auth changes securely
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Sync custom state or keep current preloads
        fetchUserCollections(authUser.uid);
      } else {
        setUser(null);
        setCurrentView("landing");
      }
    });
    return () => unsub();
  }, []);

  // Fetch from Firebase Firestore
  const fetchUserCollections = async (userId: string) => {
    try {
      // Query ideas collection synced to user
      const q = query(collection(db, "Ideas"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedIdeas: StartupIdea[] = [];
      querySnapshot.forEach((doc) => {
        fetchedIdeas.push({ id: doc.id, ...doc.data() } as StartupIdea);
      });

      if (fetchedIdeas.length > 0) {
        // Retrieve associated reports too
        const repSnapshot = await getDocs(query(collection(db, "ValidationReports"), where("userId", "==", userId)));
        const repMap: Record<string, ValidationReport> = { ...PRELOADED_REPORTS };
        repSnapshot.forEach((doc) => {
          const rep = { id: doc.id, ...doc.data() } as ValidationReport;
          if (rep.ideaId) {
            repMap[rep.ideaId] = rep;
          }
        });

        setIdeas([...PRELOADED_IDEAS, ...fetchedIdeas]);
        setReports(repMap);
      }
    } catch (err) {
      console.warn("Firestore fetch restricted or building index, fallback to stable state memory.", err);
    }
  };

  // Run the massive generative validation engine calling server.ts /api/validate-idea
  const handleValidateIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaName.trim() || !newIdeaConcept.trim()) {
      setErrorMsg("Startup Name and Core Idea concept description are required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setLoadingTip("Contextualizing market demographics...");

    const tips = [
      "Securing competitive coordinates...",
      "Analyzing SWOT dimensions...",
      "Simulating 5-Year customer scaling...",
      "Structuring 9 slide investor deck...",
      "Double checking compliance risks..."
    ];

    let tipIndex = 0;
    const interval = setInterval(() => {
      if (tipIndex < tips.length) {
        setLoadingTip(tips[tipIndex]);
        tipIndex++;
      }
    }, 2800);

    try {
      const payload = {
        name: newIdeaName,
        idea: newIdeaConcept,
        industry: newIdeaIndustry,
        targetCustomers: newIdeaTarget,
        problemStatement: newIdeaProblem,
        solution: newIdeaSolution,
        region: newIdeaRegion
      };

      const response = await fetch("/api/validate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "The validator server returned an error.");
      }

      const generatedReport: ValidationReport = await response.json();

      // Create new Idea object
      const freshIdeaId = `idea_usr_${Date.now()}`;
      const freshIdea: StartupIdea = {
        id: freshIdeaId,
        userId: user ? user.uid : "unauthenticated_guest",
        name: newIdeaName,
        idea: newIdeaConcept,
        industry: newIdeaIndustry,
        targetCustomers: newIdeaTarget,
        problemStatement: newIdeaProblem,
        solution: newIdeaSolution,
        region: newIdeaRegion
      };

      // Save to local hooks
      generatedReport.ideaId = freshIdeaId;
      generatedReport.id = `rep_usr_${Date.now()}`;

      setIdeas(prev => [freshIdea, ...prev]);
      setReports(prev => ({
        ...prev,
        [freshIdeaId]: generatedReport
      }));

      // Try save to firestore
      if (user && db) {
        try {
          const ideaDocRef = await addDoc(collection(db, "Ideas"), {
            ...freshIdea,
            userId: user.uid,
            createdAt: new Date().toISOString()
          });
          await addDoc(collection(db, "ValidationReports"), {
            ...generatedReport,
            userId: user.uid,
            ideaId: ideaDocRef.id,
            createdAt: new Date().toISOString()
          });
          freshIdea.id = ideaDocRef.id;
        } catch (fError) {
          console.warn("Unable to sync report to Firestore bucket, retaining safe memory state.", fError);
        }
      }

      // Display results instantly
      setSelectedIdea(freshIdea);
      setSelectedReport(generatedReport);
      setCurrentView("report");

      // Reset form variables
      setNewIdeaName("");
      setNewIdeaConcept("");
      setNewIdeaTarget("");
      setNewIdeaProblem("");
      setNewIdeaSolution("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected validation crash happened. Please check your system secrets key configurations.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleUpdateReport = (updatedReport: ValidationReport) => {
    if (updatedReport.ideaId) {
      setReports(prev => ({
        ...prev,
        [updatedReport.ideaId!]: updatedReport
      }));
      if (selectedReport && selectedReport.ideaId === updatedReport.ideaId) {
        setSelectedReport(updatedReport);
      }
    }
  };

  const handleDeleteIdeaAndReport = async (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you confident about removing this conceptual draft and report? This cannot be undone.")) return;

    setIdeas(prev => prev.filter(i => i.id !== ideaId));
    // Re-route if deleting currently viewed
    if (selectedIdea?.id === ideaId) {
      setSelectedIdea(null);
      setSelectedReport(null);
      setCurrentView("dashboard");
    }

    // Try delete from Firestore
    if (user && db && !ideaId.startsWith("seed_")) {
      try {
        const qIdeas = query(collection(db, "Ideas"), where("id", "==", ideaId));
        const snapshots = await getDocs(qIdeas);
        snapshots.forEach(async (snapshotDoc) => {
          await deleteDoc(doc(db, "Ideas", snapshotDoc.id));
        });
      } catch (fErr) {
        console.warn("Firestore delete issue, localized deletion successful.", fErr);
      }
    }
  };

  const handleOpenReportDirect = (ideaObj: StartupIdea) => {
    const reportObj = reports[ideaObj.id || ""];
    setSelectedIdea(ideaObj);
    if (reportObj) {
      setSelectedReport(reportObj);
      setCurrentView("report");
    } else {
      // Mock generation if missing report map
      alert("Validation intelligence report not fetched yet or restricted database schema.");
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIdeas(PRELOADED_IDEAS);
      setUser(null);
      setCurrentView("landing");
    } catch (err) {
      console.error(err);
    }
  };

  const seedTemplateCallback = () => {
    setIdeas([...PRELOADED_IDEAS]);
    setReports({...PRELOADED_REPORTS});
  };

  // Landing triggers
  const executeLandingGetStarted = (initialIdea?: string) => {
    if (initialIdea) {
      setNewIdeaConcept(initialIdea);
    }
    if (user) {
      setCurrentView("new-validator");
    } else {
      setCurrentView("auth");
    }
  };

  // Sidebar Layout Navigation
  const navigationItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: Layout },
    { id: "new-validator", label: "New Idea Validator", icon: PlusCircle },
    { id: "chat", label: "AI Strategic Mentor", icon: MessageSquare },
    { id: "community", label: "Community Forum", icon: Users }
  ] as const;

  // Add Admin console if matches developer or user email
  const isAdmin = user && (user.email === "damayanthisri7@gmail.com" || user.uid === "mock_demo_user_id_123");

  // Authentication check block
  const isLanding = currentView === "landing";
  const isAuth = currentView === "auth";

  if (isLanding) {
    return (
      <LandingPage
        onGetStarted={executeLandingGetStarted}
        onLoginClick={() => setCurrentView("auth")}
      />
    );
  }

  if (isAuth) {
    return (
      <AuthPage
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setCurrentView("dashboard");
        }}
        onBackToLanding={() => setCurrentView("landing")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans flex flex-col lg:flex-row relative">
      {/* Mobile Topbar Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 h-16 w-full px-4 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-medium text-base tracking-tight text-[#111827]">VentureMind AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 px-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Sidebar Panel (Responsive) */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 p-5 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 z-50 lg:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-[#111827]">
                  VentureMind AI
                </span>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                  Validated Growth
                </p>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Current user session banner */}
          <div className="p-3 bg-gray-50 border border-gray-150 rounded-lg flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] text-xs font-bold shrink-0">
              {user?.displayName ? user.displayName[0] : "I"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-[#111827] block truncate">
                {user?.displayName || "Innovator Guest"}
              </span>
              <span className="text-[10px] text-gray-500 truncate block">
                {user?.email || "innovator@venturemind.ai"}
              </span>
            </div>
          </div>

          {/* Navigation Items menu */}
          <nav className="space-y-1 pt-2">
            {navigationItems.map((item) => {
              const matches = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all leading-none ${
                    matches
                      ? "bg-blue-50 text-[#2563EB] font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#111827]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin control console toggle */}
            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView("admin");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all leading-none ${
                  currentView === "admin"
                    ? "bg-purple-50 text-purple-750 font-bold"
                    : "text-purple-600 hover:bg-purple-50/50"
                }`}
              >
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Admin Intelligence</span>
              </button>
            )}
          </nav>
        </div>

        {/* Exit banner button */}
        <div className="pt-4 border-t border-gray-150">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors leading-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Principal App stage */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Loader full-screen spinner */}
        {loading && (
          <div className="fixed inset-0 bg-gray-50/75 backdrop-blur-xs flex flex-col items-center justify-center z-50 space-y-4">
            <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-200">
              <Loader2 className="w-7 h-7 animate-spin text-[#2563EB]" />
            </div>
            <div className="text-center">
              <h3 className="text-[#111827] font-bold text-sm tracking-tight font-display">{loadingTip}</h3>
              <p className="text-gray-400 text-xs font-normal mt-0.5 leading-relaxed">
                VentureMind AI modeling financial matrices may occupy up to 15 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Views Router */}

        {/* 1. Dashboard Overview */}
        {currentView === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header widget */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm gap-4">
              <div>
                <h1 className="text-xl font-display font-bold text-[#111827] tracking-tight">Innovation Portfolio</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Access compiled validation files, track progress metrics, and model financial frameworks.
                </p>
              </div>
              <button
                onClick={() => setCurrentView("new-validator")}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:opacity-95 rounded-lg text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Analyze New Startup Idea</span>
              </button>
            </div>

            {/* Core Idea Portfolio Cards Grid */}
            <div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <History className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <span>Validated Concept Logs ({ideas.length})</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ideas.map((idea) => {
                  const correlatedReport = reports[idea.id || ""];
                  return (
                    <div
                      key={idea.id}
                      onClick={() => handleOpenReportDirect(idea)}
                      className="group bg-white border border-gray-200 hover:border-[#2563EB]/80 p-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 relative cursor-pointer"
                    >
                      {/* Top banner tag */}
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-bold text-[#2563EB] tracking-wider bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">
                          {idea.industry}
                        </span>
                        {correlatedReport && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full leading-none">
                            {correlatedReport.healthScore}% Health
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#111827] mt-3 group-hover:text-[#2563EB] transition-colors font-display">
                        {idea.name} Co.
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed font-normal">
                        "{idea.idea}"
                      </p>

                      {/* Card Lower values */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-[9px] font-bold text-gray-400 font-mono">
                        <span className="uppercase tracking-wide">Target: {idea.region}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleDeleteIdeaAndReport(idea.id!, e)}
                            className="p-1 border border-gray-200 rounded hover:bg-rose-50 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Blank creation card trigger */}
                <div
                  onClick={() => setCurrentView("new-validator")}
                  className="bg-white border border-dashed border-gray-300 hover:border-[#2563EB] rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[160px] shadow-xs hover:bg-gray-50/20"
                >
                  <PlusCircle className="w-6 h-6 text-gray-400 mb-2 group-hover:text-[#2563EB]" />
                  <span className="text-xs font-bold text-gray-700">Validate Initial Brief</span>
                  <p className="text-[10px] text-gray-400 mt-0.5 max-w-[160px] font-normal leading-normal">
                    Secure dynamic SWOT structures and forecasting tables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Form Input validator */}
        {currentView === "new-validator" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs">
              <h2 className="text-lg font-display font-bold text-[#111827] tracking-tight">Validate Startup Concept</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed font-normal">
                Feed the server your core parameters to build a comprehensive investor-ready intelligence validation ledger.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg font-medium leading-relaxed">
                🚨 {errorMsg}
              </div>
            )}

            <form onSubmit={handleValidateIdeaSubmit} className="bg-white border border-gray-200 p-6 rounded-xl shadow-xs space-y-4">
              {/* Row 1: Name and Industry */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Startup Entity Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none placeholder:text-gray-400 focus:bg-white transition-all"
                    placeholder="AgroDron Soil AI"
                    value={newIdeaName}
                    onChange={(e) => setNewIdeaName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Industry Sector Category
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none focus:bg-white transition-all"
                    value={newIdeaIndustry}
                    onChange={(e) => setNewIdeaIndustry(e.target.value)}
                  >
                    {["AgriTech", "FinTech", "HealthTech", "EdTech", "ClimateTech", "Robotics", "Cybersecurity", "SaaS"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Regions and target customers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Target Customers / Demographics
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none placeholder:text-gray-400 focus:bg-white transition-all"
                    placeholder="Commercial farm operators with 1,000+ crop acres"
                    value={newIdeaTarget}
                    onChange={(e) => setNewIdeaTarget(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Target Country/Region
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none placeholder:text-gray-400 focus:bg-white transition-all"
                    placeholder="Global / North America drought belts"
                    value={newIdeaRegion}
                    onChange={(e) => setNewIdeaRegion(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Problems statement */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Core Market Problem Statement
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none resize-none placeholder:text-gray-400 focus:bg-white transition-all"
                  placeholder="Aggregate water loss up to 45% due to delayed soil evaporation checks..."
                  value={newIdeaProblem}
                  onChange={(e) => setNewIdeaProblem(e.target.value)}
                />
              </div>

              {/* Row 4: Solution descriptions */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Proposed Solution Matrix
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none resize-none placeholder:text-gray-400 focus:bg-white transition-all"
                  placeholder="Automating lightweight drone sweeps connecting straight dry-sensors to smart hydration line valves..."
                  value={newIdeaSolution}
                  onChange={(e) => setNewIdeaSolution(e.target.value)}
                />
              </div>

              {/* Row 5: Detailed elevator brief */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Startup Idea / Elevator Concept
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-xs focus:border-[#2563EB]+/80 rounded-lg outline-none resize-none placeholder:text-gray-400 focus:bg-white transition-all"
                  placeholder="Briefly pitch your core concept elevator pitch..."
                  value={newIdeaConcept}
                  onChange={(e) => setNewIdeaConcept(e.target.value)}
                />
              </div>

              {/* CTA button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:opacity-95 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Begin Live AI Validation & Modeling</span>
              </button>
            </form>
          </div>
        )}

        {/* 3. Report display */}
        {currentView === "report" && selectedIdea && selectedReport && (
          <ReportDashboard
            idea={selectedIdea}
            report={selectedReport}
            onUpdateReport={handleUpdateReport}
          />
        )}

        {/* 4. Strategic chat advisory */}
        {currentView === "chat" && (
          <HelpChat
            currentIdea={selectedIdea}
            currentReport={selectedReport}
          />
        )}

        {/* 5. Community Forums */}
        {currentView === "community" && (
          <CommunityForum
            currentIdea={selectedIdea}
            currentReport={selectedReport}
          />
        )}

        {/* 6. Admin Panel controls */}
        {currentView === "admin" && (
          <AdminPanel
            onSeedTemplate={seedTemplateCallback}
          />
        )}
      </main>
    </div>
  );
}
