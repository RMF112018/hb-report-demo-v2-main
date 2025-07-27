export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  company: string
  createdAt: string
  isActive: boolean
  avatar?: string
  permissions?: {
    preConAccess?: boolean
    [key: string]: any
  }
}

export type UserRole =
  | "executive"
  | "project-executive"
  | "project-manager"
  | "superintendent"
  | "estimator"
  | "team-member"
  | "admin"
  | "viewer"
  | "hr-payroll"

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  logout: () => void
  isLoading: boolean
}

export interface ProjectData {
  project_id: string
  name: string
  status: string
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  manager: string
  location: string
}

// Export productivity types
export * from "./productivity"

// Export activity feed types
export * from "./activity-feed"
