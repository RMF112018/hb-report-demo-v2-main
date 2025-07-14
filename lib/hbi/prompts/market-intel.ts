/**
 * @fileoverview HBI Market Intelligence Prompt Templates
 * @module HBIMarketIntelPrompts
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Reusable prompt templates for HBI-powered market intelligence analysis
 */

export interface HBIPromptTemplate {
  id: string
  category: string
  prompt: string
  parameters?: string[]
  expectedOutput: string
  confidence: number
  timeframe: string
}

export interface HBIPromptParameters {
  region?: string
  timeframe?: string
  sector?: string
  marketSegment?: string
  riskLevel?: "low" | "medium" | "high"
  analysisDepth?: "summary" | "detailed" | "comprehensive"
}

export const MARKET_INTELLIGENCE_PROMPTS: Record<string, HBIPromptTemplate> = {
  // Market Growth & Trajectory Analysis
  FLORIDA_COMMERCIAL_TRAJECTORY: {
    id: "florida-commercial-trajectory",
    category: "Market Growth",
    prompt:
      "Predict the 3-month trajectory for commercial nonresidential starts in Central Florida, considering current economic indicators, population growth trends, and infrastructure investment patterns.",
    parameters: ["region", "timeframe"],
    expectedOutput: "Growth percentage, key drivers, risk factors",
    confidence: 85,
    timeframe: "3 months",
  },

  REGIONAL_MARKET_FORECAST: {
    id: "regional-market-forecast",
    category: "Market Growth",
    prompt:
      "Analyze construction market momentum across {region} Florida, evaluating permit activity, developer sentiment, and macroeconomic factors to forecast {timeframe} market performance.",
    parameters: ["region", "timeframe"],
    expectedOutput: "Market forecast, confidence intervals, key indicators",
    confidence: 88,
    timeframe: "Variable",
  },

  // Risk & Opportunity Assessment
  LUXURY_MULTIFAMILY_RISKS: {
    id: "luxury-multifamily-risks",
    category: "Risk Assessment",
    prompt:
      "Evaluate market risks and opportunities for luxury multifamily development in Southeast Florida, analyzing land availability, demographic trends, pricing premiums, and competitive landscape.",
    parameters: ["marketSegment", "region"],
    expectedOutput: "Risk matrix, opportunity scoring, strategic recommendations",
    confidence: 82,
    timeframe: "12 months",
  },

  MACROECONOMIC_PRESSURE_ANALYSIS: {
    id: "macroeconomic-pressures",
    category: "Risk Assessment",
    prompt:
      "What macroeconomic pressures could affect developer confidence in Q4 2025? Analyze interest rate trends, insurance market volatility, material cost inflation, and regulatory changes.",
    parameters: ["timeframe", "riskLevel"],
    expectedOutput: "Pressure assessment, confidence impact, mitigation strategies",
    confidence: 76,
    timeframe: "9 months",
  },

  THREAT_LANDSCAPE_SCAN: {
    id: "threat-landscape-scan",
    category: "Risk Assessment",
    prompt:
      "Conduct comprehensive threat analysis for {sector} construction in {region}, identifying cost pressures, market risks, and regulatory challenges with severity scoring.",
    parameters: ["sector", "region"],
    expectedOutput: "Threat severity matrix, impact timeline, risk mitigation priorities",
    confidence: 91,
    timeframe: "6 months",
  },

  // Technology & Innovation Analysis
  EMERGING_CONSTRUCTION_TECH: {
    id: "emerging-construction-tech",
    category: "Innovation",
    prompt:
      "Highlight emerging technologies transforming the Florida construction market, evaluating adoption rates, cost-benefit analysis, and competitive advantages for modular construction, AI forecasting, and green building innovations.",
    parameters: ["analysisDepth"],
    expectedOutput: "Technology adoption forecast, ROI analysis, implementation timeline",
    confidence: 89,
    timeframe: "18 months",
  },

  MODULAR_CONSTRUCTION_OPPORTUNITY: {
    id: "modular-construction-opportunity",
    category: "Innovation",
    prompt:
      "Assess modular construction market opportunity in Florida, analyzing current adoption rates, timeline savings potential, cost reduction benefits, and market penetration forecasts.",
    parameters: ["marketSegment", "timeframe"],
    expectedOutput: "Market sizing, adoption timeline, competitive positioning",
    confidence: 87,
    timeframe: "24 months",
  },

  // Competitive Intelligence
  COMPETITOR_POSITIONING_ANALYSIS: {
    id: "competitor-positioning",
    category: "Competitive Intelligence",
    prompt:
      "Analyze competitive positioning in {sector} market, comparing market share, competitive advantages, strategic positioning, and growth opportunities against key players.",
    parameters: ["sector", "region"],
    expectedOutput: "Competitive landscape, positioning recommendations, market gaps",
    confidence: 88,
    timeframe: "12 months",
  },

  MARKET_SHARE_DYNAMICS: {
    id: "market-share-dynamics",
    category: "Competitive Intelligence",
    prompt:
      "Evaluate market share dynamics and competitive threats in {region} {sector} construction, identifying potential market disruptions and strategic response options.",
    parameters: ["region", "sector"],
    expectedOutput: "Market share analysis, threat assessment, strategic options",
    confidence: 84,
    timeframe: "18 months",
  },

  // Sentiment & Market Psychology
  DEVELOPER_SENTIMENT_ANALYSIS: {
    id: "developer-sentiment-analysis",
    category: "Market Sentiment",
    prompt:
      "Analyze developer sentiment indicators including market confidence, risk assessment, financing conditions, and regulatory environment to predict market behavior.",
    parameters: ["region", "timeframe"],
    expectedOutput: "Sentiment scoring, trend analysis, behavioral predictions",
    confidence: 82,
    timeframe: "6 months",
  },

  MARKET_PSYCHOLOGY_FACTORS: {
    id: "market-psychology-factors",
    category: "Market Sentiment",
    prompt:
      "Evaluate psychological factors affecting construction market decisions in {region}, including confidence indicators, fear-greed dynamics, and herd behavior patterns.",
    parameters: ["region", "analysisDepth"],
    expectedOutput: "Psychology assessment, market timing indicators, behavioral insights",
    confidence: 79,
    timeframe: "12 months",
  },

  // Strategic Planning
  SWOT_STRATEGIC_ANALYSIS: {
    id: "swot-strategic-analysis",
    category: "Strategic Planning",
    prompt:
      "Conduct comprehensive SWOT analysis for construction market positioning, evaluating internal capabilities against external market opportunities and threats.",
    parameters: ["marketSegment", "analysisDepth"],
    expectedOutput: "SWOT matrix, strategic priorities, action recommendations",
    confidence: 85,
    timeframe: "24 months",
  },

  PORTFOLIO_DIVERSIFICATION_ANALYSIS: {
    id: "portfolio-diversification",
    category: "Strategic Planning",
    prompt:
      "Analyze portfolio diversification opportunities across {sector} segments, evaluating risk-adjusted returns, market entry barriers, and strategic fit.",
    parameters: ["sector", "riskLevel"],
    expectedOutput: "Diversification strategy, risk-return profile, implementation roadmap",
    confidence: 83,
    timeframe: "36 months",
  },
}

/**
 * Generate HBI prompt with parameters
 */
export function generateHBIPrompt(templateId: string, parameters: HBIPromptParameters = {}): string {
  const template = MARKET_INTELLIGENCE_PROMPTS[templateId]
  if (!template) {
    throw new Error(`HBI prompt template not found: ${templateId}`)
  }

  let prompt = template.prompt

  // Replace parameter placeholders
  if (parameters.region) {
    prompt = prompt.replace(/{region}/g, parameters.region)
  }
  if (parameters.timeframe) {
    prompt = prompt.replace(/{timeframe}/g, parameters.timeframe)
  }
  if (parameters.sector) {
    prompt = prompt.replace(/{sector}/g, parameters.sector)
  }
  if (parameters.marketSegment) {
    prompt = prompt.replace(/{marketSegment}/g, parameters.marketSegment)
  }

  return prompt
}

/**
 * Get HBI prompts by category
 */
export function getHBIPromptsByCategory(category: string): HBIPromptTemplate[] {
  return Object.values(MARKET_INTELLIGENCE_PROMPTS).filter((template) => template.category === category)
}

/**
 * Get all HBI prompt categories
 */
export function getHBIPromptCategories(): string[] {
  return Array.from(new Set(Object.values(MARKET_INTELLIGENCE_PROMPTS).map((template) => template.category)))
}

/**
 * Validate HBI prompt parameters
 */
export function validateHBIPromptParameters(
  templateId: string,
  parameters: HBIPromptParameters
): { valid: boolean; errors: string[] } {
  const template = MARKET_INTELLIGENCE_PROMPTS[templateId]
  if (!template) {
    return { valid: false, errors: [`Template not found: ${templateId}`] }
  }

  const errors: string[] = []
  const requiredParams = template.parameters || []

  // Check for required parameters
  requiredParams.forEach((param) => {
    if (!parameters[param as keyof HBIPromptParameters]) {
      errors.push(`Missing required parameter: ${param}`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Get HBI prompt execution metadata
 */
export function getHBIPromptMetadata(templateId: string) {
  const template = MARKET_INTELLIGENCE_PROMPTS[templateId]
  if (!template) {
    return null
  }

  return {
    id: template.id,
    category: template.category,
    confidence: template.confidence,
    timeframe: template.timeframe,
    expectedOutput: template.expectedOutput,
    parameters: template.parameters || [],
  }
}
