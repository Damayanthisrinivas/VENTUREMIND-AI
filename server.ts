import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize Gemini API client lazily - will fail on first request if key is absent
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please set your Gemini API key in the secrets panel.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// 1. AI Startup Idea Validation Endpoint
app.post("/api/validate-idea", async (req, res) => {
  try {
    const { name, idea, industry, targetCustomers, problemStatement, solution, region } = req.body;

    if (!idea || !industry || !name) {
      return res.status(400).json({ error: "Missing required fields: name, idea, and industry are mandatory." });
    }

    const ai = getAIClient();

    const systemPrompt = `
      You are an expert venture capitalist, startup incubator director, and master business analyst.
      Analyze the following startup concept detailed below:
      - Startup Name: ${name}
      - Core Idea: ${idea}
      - Industry: ${industry}
      - Target Customers: ${targetCustomers || "General market / undeterred"}
      - Problem Statement: ${problemStatement || "Not specified, deduce logically"}
      - Proposed Solution: ${solution || "Not specified, deduce logically"}
      - Target Country/Region: ${region || "Worldwide"}

      Generate a extremely comprehensive, highly detailed, realistic, and investor-ready business intelligence and validation report.
      You must return ONLY a JSON object that adheres strictly to the following structural schema, without any markdown wrappers or extra text.
      Return valid JSON with the following structure:
      {
        "validationScore": number (30-100),
        "marketOpportunityScore": number (30-100),
        "riskLevel": string ("Low" | "Medium" | "High" | "Critical"),
        "revenuePotential": string ("Low" | "Moderate" | "High" | "Exponential"),
        "growthTrends": string ("Upward" | "Stable" | "Highly Volatile"),
        "healthScore": number (30-100),
        "scores": {
          "marketNeed": number (30-100),
          "problemSolutionFit": number (30-100),
          "innovation": number (30-100),
          "scalability": number (30-100),
          "competitiveAdvantage": number (30-100),
          "successProbability": number (30-100)
        },
        "swot": {
          "strengths": [string, string, string, string],
          "weaknesses": [string, string, string, string],
          "opportunities": [string, string, string, string],
          "threats": [string, string, string, string]
        },
        "competitors": {
          "direct": [
            { "name": string, "description": string, "pricing": string, "strength": string, "weakness": string },
            { "name": string, "description": string, "pricing": string, "strength": string, "weakness": string }
          ],
          "indirect": [
            { "name": string, "description": string, "pricing": string, "strength": string, "weakness": string },
            { "name": string, "description": string, "pricing": string, "strength": string, "weakness": string }
          ],
          "advantages": [string, string, string],
          "marketMapping": [
            { "name": string, "x": number (-100 to 100 on price spectrum), "y": number (-100 to 100 on technology spectrum), "type": string ("competitor" | "subject") }
          ]
        },
        "businessModelCanvas": {
          "keyPartners": [string, string, string],
          "keyActivities": [string, string, string],
          "keyResources": [string, string, string],
          "valuePropositions": [string, string, string],
          "customerRelationships": [string, string, string],
          "customerSegments": [string, string, string],
          "channels": [string, string, string],
          "costStructure": [string, string, string],
          "revenueStreams": [string, string, string]
        },
        "revenueForecast": {
          "estimatedMonthlyRevenue": number (approximate starting monthly revenue in USD, minimum 5000),
          "breakEvenMonths": number,
          "roiPercentage": number,
          "chartData": [
            { "year": "Year 1", "revenue": number, "profit": number, "customers": number, "cost": number },
            { "year": "Year 2", "revenue": number, "profit": number, "customers": number, "cost": number },
            { "year": "Year 3", "revenue": number, "profit": number, "customers": number, "cost": number },
            { "year": "Year 4", "revenue": number, "profit": number, "customers": number, "cost": number },
            { "year": "Year 5", "revenue": number, "profit": number, "customers": number, "cost": number }
          ]
        },
        "risks": [
          { "type": "Technical", "score": number (0-100), "severity": "Low" | "Moderate" | "High", "description": string, "mitigation": string },
          { "type": "Financial", "score": number (0-100), "severity": "Low" | "Moderate" | "High", "description": string, "mitigation": string },
          { "type": "Market", "score": number (0-100), "severity": "Low" | "Moderate" | "High", "description": string, "mitigation": string },
          { "type": "Operational", "score": number (0-100), "severity": "Low" | "Moderate" | "High", "description": string, "mitigation": string },
          { "type": "Legal & Regulatory", "score": number (0-100), "severity": "Low" | "Moderate" | "High", "description": string, "mitigation": string }
        ],
        "pitchDeck": {
          "problem": { "title": "The Problem", "details": string, "bullets": [string, string, string] },
          "solution": { "title": "The Solution", "details": string, "bullets": [string, string, string] },
          "marketOpportunity": { "title": "Market Opportunity", "details": string, "bullets": [string, string, string], "tam": string, "sam": string, "som": string },
          "businessModel": { "title": "Business Model", "details": string, "bullets": [string, string, string] },
          "competition": { "title": "Competition", "details": string, "bullets": [string, string, string] },
          "revenueStrategy": { "title": "Revenue Strategy", "details": string, "bullets": [string, string, string] },
          "teamComposition": { "title": "Team Composition Needs", "details": string, "bullets": [string, string, string] },
          "financialModel": { "title": "Financial Outlook", "details": string, "bullets": [string, string, string], "breakEven": string },
          "fundingRequirements": { "title": "Funding Requirements", "amount": string, "allocation": [string, string, string] }
        },
        "recommendations": {
          "improvements": [string, string, string, string],
          "monetization": [string, string, string],
          "customerAcquisition": [string, string, string],
          "growthHacks": [string, string, string],
          "fundingSources": [string, string, string]
        },
        "marketTrends": {
          "trendingStatus": string,
          "techDrivers": [string, string],
          "capitalAvailability": string,
          "regulatoryForecast": string
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const reportText = response.text;
    const parsedData = JSON.parse(reportText || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error validating startup idea:", error);
    res.status(500).json({ error: error.message || "Something went wrong during analysis." });
  }
});

// 2. Chat Advisory Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, startupDetails } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing parameter: message is required." });
    }

    const ai = getAIClient();

    let context = "You are VentureMind Advisor, a brilliant startup mentor, venture strategist, and expert technical co-founder.";
    if (startupDetails) {
      context += `
        The user is currently analyzing their startup concept:
        - Name: ${startupDetails.name}
        - Industry: ${startupDetails.industry}
        - Description: ${startupDetails.idea}
        - Target: ${startupDetails.targetCustomers}
      `;
    }

    const systemPrompt = `
      ${context}
      Provide constructive, friendly, actionable startup advice. Keep your response formatting clean and structured using brief bullet points.
      Do not make up fake metrics if the user asks for real statistics, but offer frameworks.
      Answer the user's latest query: "${message}".
    `;

    // Incorporate previous messages
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Error communicating with Gemini Advisor." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
