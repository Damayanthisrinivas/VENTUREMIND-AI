export interface StartupIdea {
  id?: string;
  userId?: string;
  name: string;
  idea: string;
  industry: string;
  targetCustomers: string;
  problemStatement: string;
  solution: string;
  region: string;
  createdAt?: string;
}

export interface Competitor {
  name: string;
  description: string;
  pricing: string;
  strength: string;
  weakness: string;
}

export interface CompetitiveMapItem {
  name: string;
  x: number; // -100 to 100 on price
  y: number; // -100 to 100 on tech/innovation
  type: 'competitor' | 'subject';
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface BusinessModelCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  customerSegments: string[];
  channels: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface RevenueForecastPoint {
  year: string;
  revenue: number;
  profit: number;
  customers: number;
  cost: number;
}

export interface RevenueForecast {
  estimatedMonthlyRevenue: number;
  breakEvenMonths: number;
  roiPercentage: number;
  chartData: RevenueForecastPoint[];
}

export interface RiskItem {
  type: string;
  score: number;
  severity: 'Low' | 'Moderate' | 'High';
  description: string;
  mitigation: string;
}

export interface SlideContent {
  title: string;
  details: string;
  bullets: string[];
}

export interface PitchDeck {
  problem: SlideContent;
  solution: SlideContent;
  marketOpportunity: SlideContent & { tam: string; sam: string; som: string };
  businessModel: SlideContent;
  competition: SlideContent;
  revenueStrategy: SlideContent;
  teamComposition: SlideContent;
  financialModel: SlideContent & { breakEven: string };
  fundingRequirements: {
    title: string;
    amount: string;
    allocation: string[];
  };
}

export interface Recommendations {
  improvements: string[];
  monetization: string[];
  customerAcquisition: string[];
  growthHacks: string[];
  fundingSources: string[];
}

export interface MarketTrends {
  trendingStatus: string;
  techDrivers: string[];
  capitalAvailability: string;
  regulatoryForecast: string;
}

export interface ValidationReport {
  id?: string;
  ideaId?: string;
  createdAt?: string;
  validationScore: number;
  marketOpportunityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  revenuePotential: 'Low' | 'Moderate' | 'High' | 'Exponential';
  growthTrends: 'Upward' | 'Stable' | 'Highly Volatile';
  healthScore: number;
  scores: {
    marketNeed: number;
    problemSolutionFit: number;
    innovation: number;
    scalability: number;
    competitiveAdvantage: number;
    successProbability: number;
  };
  swot: SWOT;
  competitors: {
    direct: Competitor[];
    indirect: Competitor[];
    advantages: string[];
    marketMapping: CompetitiveMapItem[];
  };
  businessModelCanvas: BusinessModelCanvas;
  revenueForecast: RevenueForecast;
  risks: RiskItem[];
  pitchDeck: PitchDeck;
  recommendations: Recommendations;
  marketTrends: MarketTrends;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}
