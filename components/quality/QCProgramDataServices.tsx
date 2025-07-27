/**
 * QC Program Data Services - HB Report Demo v3.0.0
 *
 * Data integration services for QC Program Generator
 * Simulates integration with:
 * - Project specifications
 * - Approved submittals
 * - Manufacturer guidelines
 * - Building codes and industry best practices
 */

// Project Specifications Data Service
export interface ProjectSpecificationData {
  id: string
  projectId: string
  sectionNumber: string
  sectionTitle: string
  division: string
  requirements: string[]
  standards: string[]
  testingRequirements: string[]
  acceptanceCriteria: string[]
  qualityAssuranceRequirements: string[]
  submittalsRequired: string[]
  lastUpdated: string
  revisionNumber: string
}

export const ProjectSpecificationService = {
  async getProjectSpecifications(projectId: string): Promise<ProjectSpecificationData[]> {
    // Mock project specifications data
    return [
      {
        id: "SPEC-001",
        projectId: projectId,
        sectionNumber: "03 30 00",
        sectionTitle: "Cast-in-Place Concrete",
        division: "03 - Concrete",
        requirements: [
          "Concrete shall achieve minimum 4000 PSI compressive strength at 28 days",
          "Slump shall not exceed 4 inches for normal placement",
          "Air content shall be 6% ± 1% for exterior concrete",
          "All concrete shall be tested in accordance with ASTM standards",
        ],
        standards: [
          "ACI 318 - Building Code Requirements for Structural Concrete",
          "ASTM C94 - Ready-Mixed Concrete",
          "ASTM C150 - Portland Cement",
          "ACI 301 - Specifications for Structural Concrete",
        ],
        testingRequirements: [
          "Compressive strength testing per ASTM C39",
          "Slump testing per ASTM C143",
          "Air content testing per ASTM C231",
          "Temperature monitoring during placement",
        ],
        acceptanceCriteria: [
          "Individual test results not more than 500 psi below specified strength",
          "Average of 3 consecutive tests equals or exceeds specified strength",
          "No test result below 3500 psi for 4000 psi concrete",
        ],
        qualityAssuranceRequirements: [
          "Continuous inspection during concrete placement",
          "Field testing by certified technicians",
          "Daily reports of all concrete activities",
          "Pre-placement inspection of reinforcement and formwork",
        ],
        submittalsRequired: [
          "Concrete mix designs",
          "Material certificates",
          "Testing laboratory qualifications",
          "Placement procedures",
        ],
        lastUpdated: "2024-12-10",
        revisionNumber: "Rev 2",
      },
      {
        id: "SPEC-002",
        projectId: projectId,
        sectionNumber: "05 12 00",
        sectionTitle: "Structural Steel Framing",
        division: "05 - Metals",
        requirements: [
          "Steel shall conform to ASTM A992 Grade 50",
          "All welding shall be performed by certified welders",
          "Shop drawings required for all structural steel",
          "Bolted connections shall use A325 bolts minimum",
        ],
        standards: [
          "AISC 360 - Specification for Structural Steel Buildings",
          "AWS D1.1 - Structural Welding Code",
          "ASTM A992 - Structural Steel Shapes",
          "RCSC - Research Council on Structural Connections",
        ],
        testingRequirements: [
          "Ultrasonic testing of full penetration welds",
          "Magnetic particle testing of fillet welds",
          "Bolt tension testing per ASTM F606",
          "Material testing per mill certificates",
        ],
        acceptanceCriteria: [
          "All welds shall meet AWS D1.1 standards",
          "No cracks or defects in welded connections",
          "Dimensional tolerances per AISC 303",
          "Proper bolt tension per RCSC requirements",
        ],
        qualityAssuranceRequirements: [
          "Shop inspection of fabricated members",
          "Field inspection of erected steel",
          "Welding procedure qualification",
          "Certified welding inspector on site",
        ],
        submittalsRequired: [
          "Shop drawings and calculations",
          "Material certificates",
          "Welding procedures",
          "Erection procedures",
        ],
        lastUpdated: "2024-12-08",
        revisionNumber: "Rev 1",
      },
      {
        id: "SPEC-003",
        projectId: projectId,
        sectionNumber: "07 21 00",
        sectionTitle: "Thermal Insulation",
        division: "07 - Thermal and Moisture Protection",
        requirements: [
          "Insulation R-values shall meet energy code requirements",
          "Vapor barrier installation required on warm side",
          "Fire-rated insulation required in rated assemblies",
          "Continuous insulation installation per manufacturer guidelines",
        ],
        standards: [
          "ASTM C518 - Thermal Transmission Properties",
          "ASTM E96 - Water Vapor Transmission",
          "NFPA 285 - Fire Test for Exterior Walls",
          "IECC - International Energy Conservation Code",
        ],
        testingRequirements: [
          "Thermal imaging inspection",
          "Blower door testing",
          "R-value verification testing",
          "Moisture content monitoring",
        ],
        acceptanceCriteria: [
          "No thermal bridging at connections",
          "Continuous vapor barrier with sealed joints",
          "R-values meet or exceed specified minimums",
          "Proper installation per manufacturer instructions",
        ],
        qualityAssuranceRequirements: [
          "Daily inspection of installation",
          "Photo documentation of installation",
          "Thermal imaging verification",
          "Moisture monitoring during installation",
        ],
        submittalsRequired: [
          "Product data sheets",
          "Installation instructions",
          "Fire test reports",
          "Thermal performance data",
        ],
        lastUpdated: "2024-12-05",
        revisionNumber: "Rev 1",
      },
    ]
  },

  async getSpecificationsByDivision(projectId: string, division: string): Promise<ProjectSpecificationData[]> {
    const allSpecs = await this.getProjectSpecifications(projectId)
    return allSpecs.filter((spec) => spec.division.startsWith(division))
  },
}

// Approved Submittals Data Service
export interface ApprovedSubmittalData {
  id: string
  projectId: string
  submittalNumber: string
  specSection: string
  productName: string
  manufacturer: string
  model: string
  category: string
  approvalStatus: "approved" | "approved_as_noted" | "rejected" | "pending"
  approvalDate: string
  specifications: string[]
  installationGuidelines: string[]
  testingProtocols: string[]
  warrantyRequirements: string[]
  qualityControlRequirements: string[]
  installationSequence: string[]
  specialInstructions: string[]
  relatedSubmittals: string[]
}

export const ApprovedSubmittalsService = {
  async getApprovedSubmittals(projectId: string): Promise<ApprovedSubmittalData[]> {
    return [
      {
        id: "SUB-001",
        projectId: projectId,
        submittalNumber: "03300-001",
        specSection: "03 30 00",
        productName: "High-Strength Concrete Mix",
        manufacturer: "ReadyMix Concrete Co.",
        model: "RM-4000-A",
        category: "Concrete",
        approvalStatus: "approved",
        approvalDate: "2024-12-01",
        specifications: [
          "4000 PSI compressive strength at 28 days",
          "Maximum 4-inch slump",
          "6% air content for exterior exposure",
          "Type II Portland cement",
        ],
        installationGuidelines: [
          "Place concrete within 90 minutes of mixing",
          "Maintain temperature above 40°F during placement",
          "Cure for minimum 7 days with wet curing method",
          "Protect from freezing for 48 hours minimum",
        ],
        testingProtocols: [
          "Test cylinders for every 50 CY or daily minimum",
          "Slump test for each truck load",
          "Air content test for each truck load",
          "Temperature monitoring during placement",
        ],
        warrantyRequirements: [
          "1-year warranty on concrete strength",
          "Replacement of defective concrete at no cost",
          "Warranty void if installation not per specifications",
        ],
        qualityControlRequirements: [
          "Certified concrete testing laboratory",
          "Continuous inspection during placement",
          "Daily placement reports",
          "Photo documentation of placement",
        ],
        installationSequence: [
          "Pre-placement inspection",
          "Concrete delivery and testing",
          "Placement and consolidation",
          "Finishing and curing",
        ],
        specialInstructions: [
          "Do not add water at job site",
          "Reject concrete if slump exceeds 4 inches",
          "Begin curing within 1 hour of finishing",
        ],
        relatedSubmittals: ["SUB-002", "SUB-003"],
      },
      {
        id: "SUB-002",
        projectId: projectId,
        submittalNumber: "05120-001",
        specSection: "05 12 00",
        productName: "Structural Steel Beams",
        manufacturer: "American Steel Corp.",
        model: "W-Series",
        category: "Structural Steel",
        approvalStatus: "approved_as_noted",
        approvalDate: "2024-11-28",
        specifications: [
          "ASTM A992 Grade 50 steel",
          "Shop welding per AWS D1.1",
          "Mill test certificates required",
          "Galvanized finish for exposed steel",
        ],
        installationGuidelines: [
          "Erect steel per approved shop drawings",
          "Use certified welders for field welding",
          "Install temporary bracing as required",
          "Maintain plumb and level during erection",
        ],
        testingProtocols: [
          "Ultrasonic testing of complete penetration welds",
          "Visual inspection of all welds",
          "Dimensional verification survey",
          "Bolt tension verification",
        ],
        warrantyRequirements: [
          "2-year warranty on structural steel",
          "Repair or replace defective members",
          "Warranty includes material and labor",
        ],
        qualityControlRequirements: [
          "Certified welding inspector on site",
          "Daily erection reports",
          "Shop inspection before delivery",
          "Field inspection during erection",
        ],
        installationSequence: [
          "Foundation anchor bolt verification",
          "Steel delivery and staging",
          "Erection of structural frame",
          "Field welding and connections",
        ],
        specialInstructions: [
          "Coordinate with concrete schedule",
          "Protect galvanized surfaces during erection",
          "Weld only in suitable weather conditions",
        ],
        relatedSubmittals: ["SUB-001", "SUB-004"],
      },
      {
        id: "SUB-003",
        projectId: projectId,
        submittalNumber: "07210-001",
        specSection: "07 21 00",
        productName: "Rigid Foam Insulation",
        manufacturer: "Thermal Solutions Inc.",
        model: "TS-R20",
        category: "Insulation",
        approvalStatus: "approved",
        approvalDate: "2024-12-03",
        specifications: [
          "R-20 thermal resistance",
          "Closed-cell polyurethane foam",
          "Fire-rated per NFPA 285",
          "Moisture resistant facing",
        ],
        installationGuidelines: [
          "Install continuous insulation with sealed joints",
          "Use appropriate fasteners for substrate",
          "Install vapor barrier on warm side",
          "Seal all penetrations and joints",
        ],
        testingProtocols: [
          "Thermal imaging inspection",
          "Blower door testing",
          "R-value verification",
          "Moisture content monitoring",
        ],
        warrantyRequirements: [
          "10-year thermal performance warranty",
          "Replacement of defective insulation",
          "Labor warranty for 2 years",
        ],
        qualityControlRequirements: [
          "Daily installation inspection",
          "Photo documentation of installation",
          "Thermal imaging verification",
          "Moisture monitoring",
        ],
        installationSequence: [
          "Substrate preparation",
          "Insulation installation",
          "Vapor barrier installation",
          "Penetration sealing",
        ],
        specialInstructions: [
          "Do not install in wet conditions",
          "Maintain storage temperature above 50°F",
          "Cut insulation with sharp knife only",
        ],
        relatedSubmittals: ["SUB-005", "SUB-006"],
      },
    ]
  },

  async getSubmittalsByCategory(projectId: string, category: string): Promise<ApprovedSubmittalData[]> {
    const allSubmittals = await this.getApprovedSubmittals(projectId)
    return allSubmittals.filter((submittal) => submittal.category === category)
  },
}

// Manufacturer Guidelines Data Service
export interface ManufacturerGuidelineData {
  id: string
  manufacturer: string
  product: string
  category: string
  version: string
  lastUpdated: string
  installationSteps: string[]
  qualityChecks: string[]
  testingProcedures: string[]
  commonIssues: string[]
  bestPractices: string[]
  safetyRequirements: string[]
  toolsRequired: string[]
  environmentalConditions: string[]
  warrantyClauses: string[]
  troubleshooting: string[]
}

export const ManufacturerGuidelinesService = {
  async getManufacturerGuidelines(manufacturer: string, product: string): Promise<ManufacturerGuidelineData[]> {
    const mockGuidelines: ManufacturerGuidelineData[] = [
      {
        id: "MFG-001",
        manufacturer: "ReadyMix Concrete Co.",
        product: "High-Strength Concrete Mix",
        category: "Concrete",
        version: "v2.1",
        lastUpdated: "2024-11-15",
        installationSteps: [
          "Verify proper mix design and delivery ticket",
          "Check concrete temperature (40°F - 90°F)",
          "Test slump immediately upon arrival",
          "Place concrete within 90 minutes of mixing",
          "Consolidate concrete thoroughly using vibrators",
          "Float surface to desired finish",
          "Begin curing within 1 hour of finishing",
        ],
        qualityChecks: [
          "Verify concrete strength certification",
          "Check slump consistency across trucks",
          "Monitor air content for freeze-thaw resistance",
          "Inspect for segregation or bleeding",
          "Verify proper consolidation",
          "Check surface finish quality",
        ],
        testingProcedures: [
          "Slump test per ASTM C143",
          "Air content test per ASTM C231",
          "Temperature measurement per ASTM C1064",
          "Compression test cylinders per ASTM C39",
          "Density test per ASTM C138",
        ],
        commonIssues: [
          "Slump loss during transport",
          "Cold weather placement problems",
          "Segregation during placement",
          "Inadequate curing leading to low strength",
          "Surface cracking from rapid drying",
        ],
        bestPractices: [
          "Schedule concrete delivery to match placement capacity",
          "Use proper curing methods for 7 days minimum",
          "Maintain consistent placement rate",
          "Monitor weather conditions continuously",
          "Use appropriate admixtures for conditions",
        ],
        safetyRequirements: [
          "Wear appropriate PPE during placement",
          "Ensure proper ventilation in enclosed areas",
          "Use fall protection on elevated surfaces",
          "Maintain safe distances from equipment",
          "Follow lockout/tagout procedures",
        ],
        toolsRequired: [
          "Concrete vibrators",
          "Screeds and floats",
          "Slump cone and rod",
          "Thermometer",
          "Sampling equipment",
        ],
        environmentalConditions: [
          "Air temperature: 40°F - 90°F",
          "Substrate temperature: Above 35°F",
          "Wind speed: Less than 25 mph",
          "Humidity: Monitor for rapid drying",
          "Precipitation: No rain during placement",
        ],
        warrantyClauses: [
          "1-year warranty on compressive strength",
          "Warranty void if modified at job site",
          "Proper installation required for warranty",
          "Notify within 30 days of defects",
        ],
        troubleshooting: [
          "Low slump: Check mix design and water content",
          "Segregation: Reduce drop height and improve handling",
          "Slow setting: Check temperature and admixtures",
          "Surface defects: Improve finishing techniques",
        ],
      },
      {
        id: "MFG-002",
        manufacturer: "American Steel Corp.",
        product: "Structural Steel Beams",
        category: "Structural Steel",
        version: "v3.0",
        lastUpdated: "2024-12-01",
        installationSteps: [
          "Verify anchor bolt locations and elevations",
          "Check shop drawings against field conditions",
          "Erect steel per approved sequence",
          "Install temporary bracing as required",
          "Make field connections per specifications",
          "Verify plumb and level throughout erection",
          "Complete final connections and remove temporary bracing",
        ],
        qualityChecks: [
          "Verify material certifications",
          "Check dimensional accuracy of members",
          "Inspect welded connections for quality",
          "Verify bolt tension in connections",
          "Check overall structural alignment",
          "Inspect protective coatings",
        ],
        testingProcedures: [
          "Ultrasonic testing of complete penetration welds",
          "Magnetic particle testing of fillet welds",
          "Bolt tension testing per ASTM F606",
          "Dimensional survey per AISC 303",
          "Visual inspection per AWS D1.1",
        ],
        commonIssues: [
          "Anchor bolt misalignment",
          "Welding defects in field connections",
          "Dimensional errors in fabrication",
          "Coating damage during erection",
          "Improper bolt tension",
        ],
        bestPractices: [
          "Coordinate with concrete contractor for anchor bolts",
          "Use certified welders for all field welding",
          "Maintain steel storage off ground",
          "Plan erection sequence carefully",
          "Protect coatings during handling",
        ],
        safetyRequirements: [
          "Fall protection required above 6 feet",
          "Use certified rigging equipment",
          "Maintain clear work areas",
          "Follow crane safety procedures",
          "Wear appropriate PPE",
        ],
        toolsRequired: [
          "Welding equipment and consumables",
          "Torque wrenches for bolts",
          "Lifting equipment and rigging",
          "Measuring instruments",
          "Cutting torches",
        ],
        environmentalConditions: [
          "Temperature: Above 0°F for welding",
          "Wind speed: Less than 25 mph for lifting",
          "Precipitation: No welding in rain",
          "Humidity: Monitor for condensation",
          "Visibility: Adequate for safe operations",
        ],
        warrantyClauses: [
          "2-year warranty on structural steel",
          "Includes material and fabrication defects",
          "Field erection warranty separate",
          "Proper maintenance required",
        ],
        troubleshooting: [
          "Misaligned connections: Check dimensions and adjust",
          "Welding problems: Verify procedures and qualifications",
          "Coating damage: Touch up per manufacturer specs",
          "Bolt issues: Check torque and thread engagement",
        ],
      },
    ]

    return mockGuidelines.filter(
      (guideline) => guideline.manufacturer === manufacturer && guideline.product === product
    )
  },

  async getGuidelinesByCategory(category: string): Promise<ManufacturerGuidelineData[]> {
    const allGuidelines = await this.getAllGuidelines()
    return allGuidelines.filter((guideline) => guideline.category === category)
  },

  async getAllGuidelines(): Promise<ManufacturerGuidelineData[]> {
    // Return all mock guidelines - in real implementation, this would be a database query
    return [
      // Add more mock guidelines here as needed
    ]
  },
}

// Building Codes Data Service
export interface BuildingCodeData {
  id: string
  code: string
  section: string
  title: string
  jurisdiction: string
  edition: string
  effectiveDate: string
  requirements: string[]
  inspectionPoints: string[]
  complianceChecks: string[]
  penalties: string[]
  relatedCodes: string[]
  amendments: string[]
  interpretations: string[]
}

export const BuildingCodeService = {
  async getBuildingCodes(jurisdiction: string): Promise<BuildingCodeData[]> {
    return [
      {
        id: "CODE-001",
        code: "IBC",
        section: "1704",
        title: "Special Inspections and Tests",
        jurisdiction: "State Building Code",
        edition: "2021",
        effectiveDate: "2024-01-01",
        requirements: [
          "Continuous inspection required for concrete placement",
          "Periodic inspection of reinforcing steel",
          "Welding inspection by certified inspector",
          "Fireproofing inspection and testing",
          "Structural steel inspection during erection",
        ],
        inspectionPoints: [
          "Foundation inspection before concrete placement",
          "Reinforcing steel inspection before concrete",
          "Concrete placement inspection",
          "Structural steel erection inspection",
          "Welding inspection during and after welding",
        ],
        complianceChecks: [
          "Verify inspector certifications",
          "Check inspection frequency requirements",
          "Review inspection reports for completeness",
          "Ensure proper documentation",
          "Verify corrective action implementation",
        ],
        penalties: [
          "Stop work order for non-compliance",
          "Fines up to $10,000 per violation",
          "Revocation of building permit",
          "Required re-inspection at owner expense",
        ],
        relatedCodes: ["AISC 360", "ACI 318", "AWS D1.1"],
        amendments: [
          "Local amendment A-2024-001: Additional concrete testing",
          "Local amendment B-2024-002: Enhanced welding inspection",
        ],
        interpretations: [
          "Interpretation 2024-001: Continuous inspection definition",
          "Interpretation 2024-002: Certified inspector requirements",
        ],
      },
      {
        id: "CODE-002",
        code: "IECC",
        section: "C402",
        title: "Building Envelope Requirements",
        jurisdiction: "International Energy Conservation Code",
        edition: "2021",
        effectiveDate: "2024-01-01",
        requirements: [
          "Continuous insulation installation required",
          "Thermal bridging minimization",
          "Air barrier installation and testing",
          "Fenestration performance requirements",
          "Envelope commissioning required",
        ],
        inspectionPoints: [
          "Insulation installation inspection",
          "Air barrier continuity inspection",
          "Thermal bridging inspection",
          "Fenestration installation inspection",
          "Envelope commissioning verification",
        ],
        complianceChecks: [
          "Verify R-value compliance",
          "Check air barrier continuity",
          "Test envelope performance",
          "Verify fenestration specifications",
          "Review commissioning reports",
        ],
        penalties: [
          "Certificate of occupancy withheld",
          "Required envelope modifications",
          "Additional testing at owner expense",
          "Potential permit revocation",
        ],
        relatedCodes: ["ASHRAE 90.1", "ASTM C518", "NFPA 285"],
        amendments: ["Local amendment C-2024-001: Enhanced insulation requirements"],
        interpretations: [
          "Interpretation 2024-003: Continuous insulation definition",
          "Interpretation 2024-004: Air barrier testing requirements",
        ],
      },
      {
        id: "CODE-003",
        code: "NFPA 101",
        section: "7.2",
        title: "Means of Egress",
        jurisdiction: "Life Safety Code",
        edition: "2021",
        effectiveDate: "2024-01-01",
        requirements: [
          "Egress width calculations per occupancy",
          "Exit sign and emergency lighting requirements",
          "Egress door hardware specifications",
          "Corridor and exit stair requirements",
          "Occupancy load calculations",
        ],
        inspectionPoints: [
          "Egress width measurements",
          "Exit sign placement and operation",
          "Emergency lighting testing",
          "Door hardware operation",
          "Corridor obstruction check",
        ],
        complianceChecks: [
          "Verify egress calculations",
          "Test emergency systems",
          "Check door operation",
          "Verify signage compliance",
          "Review occupancy loads",
        ],
        penalties: [
          "Occupancy permit denial",
          "Required egress modifications",
          "Fire department violations",
          "Insurance implications",
        ],
        relatedCodes: ["IBC", "NFPA 1", "NFPA 13"],
        amendments: ["Local amendment D-2024-001: Additional egress requirements"],
        interpretations: [
          "Interpretation 2024-005: Egress width calculations",
          "Interpretation 2024-006: Emergency lighting duration",
        ],
      },
    ]
  },

  async getCodesBySection(code: string, section: string): Promise<BuildingCodeData[]> {
    const allCodes = await this.getBuildingCodes("all")
    return allCodes.filter((codeData) => codeData.code === code && codeData.section === section)
  },

  async getCodeRequirements(codeId: string): Promise<string[]> {
    const allCodes = await this.getBuildingCodes("all")
    const code = allCodes.find((c) => c.id === codeId)
    return code?.requirements || []
  },
}

// AI Data Integration Service
export interface AIDataIntegrationResult {
  projectSpecifications: ProjectSpecificationData[]
  approvedSubmittals: ApprovedSubmittalData[]
  manufacturerGuidelines: ManufacturerGuidelineData[]
  buildingCodes: BuildingCodeData[]
  integrationSummary: {
    totalSpecifications: number
    totalSubmittals: number
    totalGuidelines: number
    totalCodes: number
    dataQuality: number
    integrationConfidence: number
  }
}

export const AIDataIntegrationService = {
  async integrateProjectData(projectId: string, focusAreas: string[]): Promise<AIDataIntegrationResult> {
    // Simulate AI-powered data integration
    const specifications = await ProjectSpecificationService.getProjectSpecifications(projectId)
    const submittals = await ApprovedSubmittalsService.getApprovedSubmittals(projectId)
    const buildingCodes = await BuildingCodeService.getBuildingCodes("State Building Code")

    // Get manufacturer guidelines for approved submittals
    const guidelines: ManufacturerGuidelineData[] = []
    for (const submittal of submittals) {
      const manufacturerGuidelines = await ManufacturerGuidelinesService.getManufacturerGuidelines(
        submittal.manufacturer,
        submittal.productName
      )
      guidelines.push(...manufacturerGuidelines)
    }

    return {
      projectSpecifications: specifications,
      approvedSubmittals: submittals,
      manufacturerGuidelines: guidelines,
      buildingCodes: buildingCodes,
      integrationSummary: {
        totalSpecifications: specifications.length,
        totalSubmittals: submittals.length,
        totalGuidelines: guidelines.length,
        totalCodes: buildingCodes.length,
        dataQuality: 94, // AI-calculated data quality score
        integrationConfidence: 91, // AI confidence in integration
      },
    }
  },
}
