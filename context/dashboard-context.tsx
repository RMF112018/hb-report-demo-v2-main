import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DashboardLayout, DashboardCard } from "@/types/dashboard"
import executiveLayout from "@/data/mock/layouts/executive-layout.json"
import projectExecutiveLayout from "@/data/mock/layouts/project-executive-layout.json"
import projectManagerLayout from "@/data/mock/layouts/project-manager-layout.json"
import financialReviewLayout from "@/data/mock/layouts/financial-review-layout.json"
import itLayout from "@/data/mock/layouts/it-layout.json"

/**
 * DashboardContext
 * ----------------
 * Provides state and actions for user-personalized dashboards, including:
 * - List of dashboards (per user)
 * - Current dashboard (active tab)
 * - Template dashboard (per role)
 * - CRUD operations (add, remove, update, reset)
 *
 * This context enables a Power BI/Oracle-style dashboard experience with tabs and full customization.
 */

// Helper function to get default span based on card size
function getDefaultSpan(size?: DashboardCard["size"]): { cols: number; rows: number } {
  switch (size) {
    case "small":
      return { cols: 3, rows: 3 }
    case "medium":
      return { cols: 4, rows: 4 }
    case "large":
      return { cols: 6, rows: 6 }
    case "wide":
      return { cols: 8, rows: 4 }
    case "tall":
      return { cols: 4, rows: 8 }
    case "extra-large":
      return { cols: 8, rows: 8 }
    default:
      return { cols: 4, rows: 4 }
  }
}

// Helper function to ensure cards have span properties
function normalizeCards(cards: DashboardCard[]): DashboardCard[] {
  return cards.map((card) => {
    const normalizedCard = {
      ...card,
      span: card.span || getDefaultSpan(card.size),
    }

    return normalizedCard
  })
}

interface DashboardContextType {
  dashboards: DashboardLayout[]
  currentDashboardId: string | null
  setCurrentDashboardId: (id: string) => void
  addDashboard: (dashboard: DashboardLayout) => void
  updateDashboard: (dashboard: DashboardLayout) => void
  removeDashboard: (id: string) => void
  resetDashboard: (id: string) => void
  templateDashboard: DashboardLayout | null
  loading: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboardContext must be used within DashboardProvider")
  return ctx
}

export function DashboardProvider({ userId, role, children }: { userId: string; role: string; children: ReactNode }) {
  const [dashboards, setDashboards] = useState<DashboardLayout[]>([])
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null)
  const [templateDashboard, setTemplateDashboard] = useState<DashboardLayout | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch dashboards and template on mount
  useEffect(() => {
    async function fetchDashboards() {
      setLoading(true)

      // DEMO: Use static JSON for templates based on user role
      let template: DashboardLayout | null = null
      const userDashboards: DashboardLayout[] = []

      if (role === "executive") {
        template = {
          ...executiveLayout,
          name: "Executive Overview",
          cards: normalizeCards(executiveLayout.cards as DashboardCard[]),
        }

        // Create Executive Overview and Financial Review dashboards
        userDashboards.push({
          ...template,
          id: `${role}-executive-overview`,
          name: "Project Executive Overview",
          cards: normalizeCards(template.cards),
        })

        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: "Financial Review",
          role: role,
          cards: normalizeCards(financialReviewLayout.cards as DashboardCard[]),
        })
      } else if (role === "project-executive") {
        template = {
          ...projectExecutiveLayout,
          cards: normalizeCards(projectExecutiveLayout.cards as DashboardCard[]),
        }

        // Create Project Executive Overview and Financial Review dashboards
        userDashboards.push({
          ...template,
          id: `${role}-user-dashboard`,
          name: "Project Executive Overview",
          cards: normalizeCards(template.cards),
        })

        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: "Financial Review",
          role: role,
          cards: normalizeCards(financialReviewLayout.cards as DashboardCard[]),
        })
      } else if (role === "project-manager") {
        template = {
          ...projectManagerLayout,
          cards: normalizeCards(projectManagerLayout.cards as DashboardCard[]),
        }

        // Create Project Manager Overview and Financial Review dashboards
        userDashboards.push({
          ...template,
          id: `${role}-user-dashboard`,
          name: "Project Manager Overview",
          cards: normalizeCards(template.cards),
        })

        // Add Financial Review dashboard for Project Manager (filtered to 1 project max)
        // Remove Portfolio Overview card for Project Manager
        const projectManagerFinancialCards = (financialReviewLayout.cards as DashboardCard[]).filter(
          (card) => card.type !== "project-overview"
        )
        userDashboards.push({
          ...financialReviewLayout,
          id: `${role}-financial-review`,
          name: "Financial Review",
          role: role,
          cards: normalizeCards(projectManagerFinancialCards),
        })
      } else if (role === "admin") {
        template = {
          ...itLayout,
          cards: normalizeCards(itLayout.cards as DashboardCard[]),
        }

        userDashboards.push({
          ...template,
          id: `${role}-it-command-center`,
          name: template?.name || "IT Command Center",
          cards: normalizeCards(template.cards),
        })
      }

      // Filter to ensure only allowed dashboards for executive role
      const allowedDashboards =
        role === "executive"
          ? userDashboards.filter((d) => d.name === "Project Executive Overview" || d.name === "Financial Review")
          : userDashboards

      setDashboards(allowedDashboards)
      setTemplateDashboard(template)
      setCurrentDashboardId(allowedDashboards[0]?.id || null)
      setLoading(false)
    }
    fetchDashboards()
  }, [userId, role])

  function addDashboard(dashboard: DashboardLayout) {
    // Prevent adding new dashboards for executive role - only allow Project Executive Overview and Financial Review
    if (role === "executive") {
      const allowedNames = ["Project Executive Overview", "Financial Review"]
      if (!allowedNames.includes(dashboard.name)) {
        console.warn(`Dashboard "${dashboard.name}" not allowed for executive role`)
        return
      }
    }

    const normalizedDashboard = {
      ...dashboard,
      cards: normalizeCards(dashboard.cards),
    }
    setDashboards((prev) => [...prev, normalizedDashboard])
    // TODO: Persist to backend
  }
  function updateDashboard(dashboard: DashboardLayout) {
    const normalizedDashboard = {
      ...dashboard,
      cards: normalizeCards(dashboard.cards),
    }
    setDashboards((prev) => prev.map((d) => (d.id === dashboard.id ? normalizedDashboard : d)))
    // TODO: Persist to backend
  }
  function removeDashboard(id: string) {
    setDashboards((prev) => prev.filter((d) => d.id !== id))
    // TODO: Persist to backend
  }
  function resetDashboard(id: string) {
    if (!templateDashboard) return
    const resetDash = {
      ...templateDashboard,
      id,
      name: dashboards.find((d) => d.id === id)?.name || templateDashboard.name,
      cards: normalizeCards(templateDashboard.cards),
    }
    setDashboards((prev) => prev.map((d) => (d.id === id ? resetDash : d)))
    // TODO: Persist to backend
  }

  return (
    <DashboardContext.Provider
      value={{
        dashboards,
        currentDashboardId,
        setCurrentDashboardId,
        addDashboard,
        updateDashboard,
        removeDashboard,
        resetDashboard,
        templateDashboard,
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
