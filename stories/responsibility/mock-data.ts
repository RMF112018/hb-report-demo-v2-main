import type { ResponsibilityTask, ResponsibilityRole, ResponsibilityMetrics } from "@/types/responsibility"

export const mockRoles: ResponsibilityRole[] = [
  {
    key: "PX",
    name: "Project Executive",
    color: "#3B82F6",
    enabled: true,
    description: "Overall project oversight and client relations",
  },
  {
    key: "PM1",
    name: "Project Manager 1",
    color: "#10B981",
    enabled: true,
    description: "Primary project management responsibilities",
  },
  {
    key: "PM2",
    name: "Project Manager 2",
    color: "#8B5CF6",
    enabled: true,
    description: "Secondary project management support",
  },
  {
    key: "PA",
    name: "Project Administrator",
    color: "#EC4899",
    enabled: true,
    description: "Administrative support and documentation",
  },
  {
    key: "QAC",
    name: "Quality Assurance Coordinator",
    color: "#F59E0B",
    enabled: true,
    description: "Quality control and assurance oversight",
  },
  {
    key: "ProjAcct",
    name: "Project Accountant",
    color: "#06B6D4",
    enabled: true,
    description: "Financial management and accounting",
  },
  {
    key: "A",
    name: "Architect",
    color: "#6366F1",
    enabled: true,
    description: "Design review and architectural oversight",
  },
  {
    key: "C",
    name: "Contractor",
    color: "#F57734",
    enabled: true,
    description: "Construction execution and coordination",
  },
  {
    key: "S",
    name: "Safety Manager",
    color: "#EF4444",
    enabled: true,
    description: "Safety compliance and management",
  },
]

export const mockCategories = [
  "Contract Management",
  "Financial Management",
  "Procurement",
  "Quality Control",
  "Safety Management",
  "Schedule Management",
  "Risk Management",
  "Document Control",
  "Communication",
  "Environmental Compliance",
]

export const mockResponsibilityTasks: ResponsibilityTask[] = [
  {
    id: "task-001",
    projectId: "401001",
    type: "team",
    category: "Contract Management",
    task: "Sign all contracts",
    page: "",
    article: "",
    responsible: "PX",
    assignments: {
      PX: "Primary",
      PM1: "Support",
      PM2: "None",
      PA: "None",
      QAC: "None",
      ProjAcct: "None",
      A: "None",
      C: "None",
      S: "None",
    },
    status: "active",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    annotations: [
      {
        id: "ann-001",
        user: "PM John Smith",
        timestamp: "2025-01-15T10:00:00Z",
        comment: "Contract signed and verified for compliance with project requirements.",
      },
    ],
  },
  {
    id: "task-002",
    projectId: "401001",
    type: "team",
    category: "Financial Management",
    task: "Review & Approve Subcontractor SOVs",
    page: "",
    article: "",
    responsible: "PM1",
    assignments: {
      PX: "Approve",
      PM1: "Primary",
      PM2: "None",
      PA: "None",
      QAC: "None",
      ProjAcct: "Support",
      A: "None",
      C: "None",
      S: "None",
    },
    status: "active",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-06-01T10:30:00Z",
    annotations: [],
  },
  {
    id: "task-003",
    projectId: "401001",
    type: "prime-contract",
    category: "Contract Administration",
    task: "Review and approve change orders",
    page: "15",
    article: "3.2.1",
    responsible: "PM1",
    assignments: {
      PX: "Approve",
      PM1: "Primary",
      PM2: "None",
      PA: "Support",
      QAC: "None",
      ProjAcct: "Support",
      A: "None",
      C: "None",
      S: "None",
    },
    status: "active",
    createdAt: "2025-01-15T13:30:00Z",
    updatedAt: "2025-06-01T13:30:00Z",
    annotations: [],
  },
  {
    id: "task-004",
    projectId: "401001",
    type: "subcontract",
    category: "Electrical Systems",
    task: "Install electrical systems",
    page: "12",
    article: "E-2.1",
    responsible: "C",
    assignments: {
      PX: "None",
      PM1: "Approve",
      PM2: "None",
      PA: "None",
      QAC: "Support",
      ProjAcct: "None",
      A: "None",
      C: "Primary",
      S: "Support",
    },
    status: "pending",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    annotations: [],
  },
  {
    id: "task-005",
    projectId: "401001",
    type: "team",
    category: "Quality Control",
    task: "Conduct Quality Inspections",
    page: "",
    article: "",
    responsible: "QAC",
    assignments: {
      PX: "None",
      PM1: "Support",
      PM2: "None",
      PA: "None",
      QAC: "Primary",
      ProjAcct: "None",
      A: "None",
      C: "Support",
      S: "None",
    },
    status: "completed",
    createdAt: "2025-01-15T11:30:00Z",
    updatedAt: "2025-06-01T11:30:00Z",
    annotations: [],
  },
]

export const mockMetrics: ResponsibilityMetrics = {
  totalTasks: 25,
  unassignedTasks: 3,
  completedTasks: 15,
  pendingTasks: 7,
  roleWorkload: {
    PX: 8,
    PM1: 12,
    PM2: 5,
    PA: 3,
    QAC: 7,
    ProjAcct: 4,
    A: 6,
    C: 9,
    S: 4,
  },
  categoryDistribution: {
    "Contract Management": 8,
    "Financial Management": 6,
    "Quality Control": 5,
    "Safety Management": 3,
    "Schedule Management": 3,
  },
  completionRate: 60,
  averageTasksPerRole: 5.8,
}
