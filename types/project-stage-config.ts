export interface ProjectStageConfig {
  stageId: number
  stageName: string
  primaryFocus: string
  keyActivities: string[]
  criticalData: string[]
  hiddenSections: string[]
  primaryActions: string[]
  kpiMetrics: string[]
  navigationItems: string[]
  documentCategories: string[]
  reportingRequirements: string[]
  stageColor: string
  stageIcon: string
  nextStages: string[]
  requiredCompletionItems: string[]
}

export interface StageViewProps {
  project: any
  projectData: any
  stageConfig: ProjectStageConfig
}

export interface StageTransitionProps {
  project: any
  onStageChange: (newStage: string) => void
}

export interface StageTransitionRequirements {
  isValid: boolean
  missingRequirements: string[]
  warnings: string[]
}

export const PROJECT_STAGE_CONFIGS: Record<string, ProjectStageConfig> = {
  "BIM Coordination": {
    stageId: 1,
    stageName: "BIM Coordination",
    primaryFocus: "Design coordination and clash detection",
    keyActivities: ["BIM modeling", "Clash detection", "Design reviews", "Coordination meetings"],
    criticalData: ["design_documents", "clash_reports", "coordination_meetings", "model_revisions"],
    hiddenSections: ["field_reports", "warranty_tracking", "final_financials", "procurement_log"],
    primaryActions: ["upload_model", "run_clash_detection", "schedule_coordination", "review_design"],
    kpiMetrics: ["design_completion", "clash_resolution", "coordination_efficiency", "model_accuracy"],
    navigationItems: ["BIM Models", "Clash Reports", "Design Reviews", "Coordination Schedule"],
    documentCategories: ["Design Documents", "BIM Models", "Coordination Reports", "Meeting Minutes"],
    reportingRequirements: ["Weekly BIM Progress", "Clash Detection Summary", "Coordination Status"],
    stageColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    stageIcon: "Building2",
    nextStages: ["Bidding", "Pre-Construction"],
    requiredCompletionItems: ["All major clashes resolved", "Design documentation complete", "Coordination sign-off"],
  },
  Bidding: {
    stageId: 2,
    stageName: "Bidding",
    primaryFocus: "Bid preparation and subcontractor coordination",
    keyActivities: ["Estimate development", "Subcontractor outreach", "Bid compilation", "Market analysis"],
    criticalData: ["estimates", "subcontractor_bids", "bid_analysis", "market_pricing"],
    hiddenSections: ["construction_progress", "warranty_tracking", "closeout_documents", "field_operations"],
    primaryActions: ["create_estimate", "request_sub_bids", "compile_bid_package", "analyze_competition"],
    kpiMetrics: ["bid_accuracy", "subcontractor_response_rate", "bid_competitiveness", "margin_analysis"],
    navigationItems: ["Estimates", "Subcontractor Bids", "Bid Analysis", "Market Intelligence"],
    documentCategories: ["Estimate Documents", "Subcontractor Proposals", "Bid Packages", "Market Analysis"],
    reportingRequirements: ["Bid Status Report", "Subcontractor Outreach Summary", "Competitive Analysis"],
    stageColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    stageIcon: "Calculator",
    nextStages: ["Pre-Construction", "Construction"],
    requiredCompletionItems: ["Final estimate complete", "All sub-bids received", "Bid package submitted"],
  },
  "Pre-Construction": {
    stageId: 3,
    stageName: "Pre-Construction",
    primaryFocus: "Value engineering and constructibility analysis",
    keyActivities: ["Value engineering", "Constructibility reviews", "Contract negotiation", "Permit coordination"],
    criticalData: ["value_engineering", "constructibility_analysis", "contract_terms", "permit_status"],
    hiddenSections: ["daily_reports", "warranty_claims", "final_accounting", "active_field_work"],
    primaryActions: [
      "conduct_value_engineering",
      "review_constructibility",
      "negotiate_contract",
      "coordinate_permits",
    ],
    kpiMetrics: ["cost_savings", "constructibility_score", "contract_efficiency", "permit_progress"],
    navigationItems: ["Value Engineering", "Constructibility", "Contract Terms", "Permit Coordination"],
    documentCategories: ["VE Reports", "Constructibility Studies", "Contract Documents", "Permit Applications"],
    reportingRequirements: ["Pre-Construction Progress", "Value Engineering Summary", "Contract Status"],
    stageColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    stageIcon: "Settings",
    nextStages: ["Construction"],
    requiredCompletionItems: ["Contract executed", "Major permits obtained", "Value engineering complete"],
  },
  Construction: {
    stageId: 4,
    stageName: "Construction",
    primaryFocus: "Active construction management and field operations",
    keyActivities: ["Daily field management", "Progress tracking", "Quality control", "Safety management"],
    criticalData: ["field_reports", "schedule_progress", "quality_inspections", "safety_records"],
    hiddenSections: ["bid_analysis", "initial_estimates", "warranty_specific", "precon_activities"],
    primaryActions: ["submit_daily_report", "track_progress", "conduct_inspection", "manage_safety"],
    kpiMetrics: ["schedule_performance", "budget_performance", "quality_score", "safety_record"],
    navigationItems: ["Field Reports", "Schedule", "Quality Control", "Safety Management"],
    documentCategories: ["Daily Reports", "Progress Photos", "Quality Documents", "Safety Records"],
    reportingRequirements: ["Weekly Progress Report", "Monthly Financial Summary", "Safety Reports"],
    stageColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    stageIcon: "HardHat",
    nextStages: ["Closeout"],
    requiredCompletionItems: ["Construction substantially complete", "All inspections passed", "Punch list started"],
  },
  Closeout: {
    stageId: 5,
    stageName: "Closeout",
    primaryFocus: "Project completion and documentation finalization",
    keyActivities: ["Punch list completion", "Final documentation", "Closeout procedures", "Final billing"],
    criticalData: ["punch_list", "final_documents", "closeout_checklist", "final_billing"],
    hiddenSections: ["bidding_documents", "early_estimates", "active_construction", "ongoing_procurement"],
    primaryActions: ["complete_punch_list", "finalize_documentation", "prepare_handover", "process_final_billing"],
    kpiMetrics: ["punch_list_completion", "documentation_completeness", "handover_readiness", "final_margin"],
    navigationItems: ["Punch List", "Final Documents", "Closeout Checklist", "Final Billing"],
    documentCategories: ["Closeout Documents", "As-Built Drawings", "Warranties", "Final Billing"],
    reportingRequirements: ["Closeout Status Report", "Final Project Summary", "Financial Closeout"],
    stageColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    stageIcon: "CheckCircle",
    nextStages: ["Warranty", "Closed"],
    requiredCompletionItems: ["Punch list complete", "All documentation finalized", "Final billing processed"],
  },
  Warranty: {
    stageId: 6,
    stageName: "Warranty",
    primaryFocus: "Warranty management and issue resolution",
    keyActivities: ["Warranty claim processing", "Issue resolution", "Client communication", "Preventive maintenance"],
    criticalData: ["warranty_claims", "resolution_tracking", "client_communications", "maintenance_schedule"],
    hiddenSections: ["construction_progress", "bidding_data", "active_procurement", "field_operations"],
    primaryActions: ["log_warranty_claim", "track_resolution", "communicate_with_client", "schedule_maintenance"],
    kpiMetrics: ["claim_resolution_time", "client_satisfaction", "warranty_cost", "prevention_effectiveness"],
    navigationItems: ["Warranty Claims", "Resolution Tracking", "Client Communications", "Maintenance Schedule"],
    documentCategories: ["Warranty Claims", "Resolution Reports", "Client Correspondence", "Maintenance Records"],
    reportingRequirements: ["Monthly Warranty Report", "Client Satisfaction Survey", "Cost Analysis"],
    stageColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    stageIcon: "Shield",
    nextStages: ["Closed"],
    requiredCompletionItems: ["Warranty period expired", "All claims resolved", "Client sign-off received"],
  },
  Closed: {
    stageId: 7,
    stageName: "Closed",
    primaryFocus: "Project archive and lessons learned",
    keyActivities: ["Final archiving", "Lessons learned", "Performance analysis", "Knowledge transfer"],
    criticalData: ["final_metrics", "lessons_learned", "archived_documents", "performance_analysis"],
    hiddenSections: ["active_tracking", "real_time_updates", "ongoing_activities", "live_operations"],
    primaryActions: ["generate_final_report", "document_lessons_learned", "archive_project", "transfer_knowledge"],
    kpiMetrics: ["final_profitability", "client_satisfaction", "project_success_metrics", "knowledge_capture"],
    navigationItems: ["Final Reports", "Lessons Learned", "Archive", "Performance Analysis"],
    documentCategories: ["Final Reports", "Lessons Learned", "Archived Documents", "Performance Analysis"],
    reportingRequirements: ["Final Project Report", "Lessons Learned Summary", "Performance Analysis"],
    stageColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    stageIcon: "Archive",
    nextStages: [],
    requiredCompletionItems: ["All documentation archived", "Lessons learned documented", "Final report complete"],
  },
}

// Helper functions for stage management
export const getStageConfig = (stageName: string): ProjectStageConfig | null => {
  return PROJECT_STAGE_CONFIGS[stageName] || null
}

export const getNextStages = (currentStage: string): string[] => {
  const config = getStageConfig(currentStage)
  return config?.nextStages || []
}

export const isStageTransitionValid = (fromStage: string, toStage: string): boolean => {
  const config = getStageConfig(fromStage)
  return config?.nextStages.includes(toStage) || false
}

export const getStageOrder = (): string[] => {
  return ["BIM Coordination", "Bidding", "Pre-Construction", "Construction", "Closeout", "Warranty", "Closed"]
}

export const getStageProgress = (currentStage: string): number => {
  const stageOrder = getStageOrder()
  const currentIndex = stageOrder.indexOf(currentStage)
  return currentIndex >= 0 ? Math.round(((currentIndex + 1) / stageOrder.length) * 100) : 0
}
