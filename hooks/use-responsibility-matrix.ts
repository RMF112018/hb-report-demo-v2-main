import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import responsibilityRawData from "@/data/mock/responsibility.json"

export interface ResponsibilityTask {
  id: string
  projectId: string
  type: "team" | "prime-contract" | "subcontract"
  category: string
  task: string
  page?: string
  article?: string
  responsible: string
  assignments: { [key: string]: "Approve" | "Primary" | "Support" | "None" }
  status: "active" | "pending" | "completed"
  createdAt: string
  updatedAt: string
  annotations: any[]
}

export interface ResponsibilityRole {
  key: string
  name: string
  color: string
  enabled: boolean
  description: string
}

export interface ResponsibilityMetrics {
  totalTasks: number
  unassignedTasks: number
  completedTasks: number
  pendingTasks: number
  roleWorkload: { [roleKey: string]: number }
  categoryDistribution: { [category: string]: number }
  completionRate: number
  averageTasksPerRole: number
}

const roleColors: { [key: string]: string } = {
  PX: "#1890ff",
  PM3: "#722ed1",
  PM1: "#52c41a",
  APM: "#fa8c16",
  PACT: "#fadb14",
  S3: "#722ed1",
  S2: "#a0d911",
  AS: "#fa541c",
  QCM: "#f5222d",
  SM: "#f57734",
}

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Memoized data transformation
const transformRawDataToTasks = (activeTab: string): ResponsibilityTask[] => {
  return responsibilityRawData
    .filter((item) => item["Task Category"] && item["Tasks/Role"])
    .map((item, index) => {
      const randomAssignments: { [key: string]: "Approve" | "Primary" | "Support" | "None" } = {}
      const category = item["Task Category"] || "General"

      Object.keys(roleColors).forEach((role) => {
        if (role === category) {
          randomAssignments[role] = Math.random() > 0.3 ? "Primary" : "Support"
        } else if (["PX", "PM3"].includes(role)) {
          randomAssignments[role] = Math.random() > 0.7 ? "Approve" : "None"
        } else {
          randomAssignments[role] = Math.random() > 0.8 ? "Support" : "None"
        }
      })

      return {
        id: `task-${index}`,
        projectId: "current-project",
        type: activeTab as "team" | "prime-contract" | "subcontract",
        category: category,
        task: item["Tasks/Role"] || "",
        page: Math.random() > 0.5 ? `${Math.floor(Math.random() * 50) + 1}` : "",
        article:
          Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20) + 1}` : "",
        responsible:
          category === "PX"
            ? "PX"
            : category === "PM3"
            ? "PM3"
            : Object.keys(randomAssignments).find((role) => randomAssignments[role] === "Primary") || "",
        assignments: randomAssignments,
        status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)] as "active" | "pending" | "completed",
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        annotations: [],
      }
    })
}

export const useResponsibilityMatrix = (projectId: string) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"team" | "prime-contract" | "subcontract">("team")
  const [tasks, setTasks] = useState<ResponsibilityTask[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const storageKey = `responsibility-matrix-${projectId}-${user?.id || "guest"}`

  // Memoize expensive transformations
  const transformedTasks = useMemo(() => {
    return transformRawDataToTasks(activeTab)
  }, [activeTab])

  // Debounced localStorage save function
  const debouncedSave = useMemo(
    () =>
      debounce((data: any) => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data))
        } catch (error) {
          console.warn("Error saving responsibility matrix data:", error)
        }
      }, 500),
    [storageKey]
  )

  // Memoize roles to prevent recalculation
  const roles: ResponsibilityRole[] = useMemo(() => {
    return Object.entries(roleColors).map(([key, color]) => ({
      key,
      name:
        key === "PX"
          ? "Project Executive"
          : key === "PM3"
          ? "Project Manager 3"
          : key === "PM1"
          ? "Project Manager 1"
          : key === "APM"
          ? "Assistant Project Manager"
          : key === "PACT"
          ? "Project Accountant"
          : key === "S3"
          ? "Superintendent 3"
          : key === "S2"
          ? "Superintendent 2"
          : key === "AS"
          ? "Assistant Superintendent"
          : key === "QCM"
          ? "Quality Control Manager"
          : key === "SM"
          ? "Safety Manager"
          : key,
      color,
      enabled: true,
      description: `${key} role responsibilities`,
    }))
  }, [])

  // Memoize metrics calculation
  const metrics: ResponsibilityMetrics = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const pendingTasks = tasks.filter((t) => t.status === "pending").length
    const unassignedTasks = tasks.filter((t) => !t.responsible || t.responsible === "").length

    const roleWorkload = tasks.reduce((acc, task) => {
      Object.entries(task.assignments).forEach(([role, assignment]) => {
        if (assignment !== "None") {
          acc[role] = (acc[role] || 0) + 1
        }
      })
      return acc
    }, {} as { [roleKey: string]: number })

    const categoryDistribution = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as { [category: string]: number })

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const averageTasksPerRole =
      Object.keys(roleColors).length > 0
        ? Object.values(roleWorkload).reduce((sum, count) => sum + count, 0) / Object.keys(roleColors).length
        : 0

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      unassignedTasks,
      roleWorkload,
      categoryDistribution,
      completionRate,
      averageTasksPerRole,
    }
  }, [tasks])

  // Load data from localStorage or initialize with mock data
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsedData = JSON.parse(stored)
          setTasks(parsedData.tasks || [])
          setActiveTab(parsedData.activeTab || "team")
        } else {
          // Initialize with mock data
          setTasks(transformedTasks)
          setActiveTab("team")
        }
      } catch (error) {
        console.warn("Error loading responsibility matrix data:", error)
        // Fallback to mock data
        setTasks(transformedTasks)
        setActiveTab("team")
      }
      setLoading(false)
      setIsInitialized(true)
    }

    if (user && !isInitialized) {
      loadData()
    }
  }, [user, storageKey, transformedTasks, isInitialized])

  // Optimized localStorage save with debouncing
  useEffect(() => {
    if (!loading && user && isInitialized) {
      const dataToStore = {
        tasks,
        activeTab,
        lastUpdated: new Date().toISOString(),
      }
      debouncedSave(dataToStore)
    }
  }, [tasks, activeTab, loading, user, isInitialized, debouncedSave])

  // Clear data on logout (listen for user changes)
  useEffect(() => {
    if (!user && isInitialized) {
      try {
        localStorage.removeItem(storageKey)
        setTasks([])
        setActiveTab("team")
        setIsInitialized(false)
      } catch (error) {
        console.warn("Error clearing responsibility matrix data:", error)
      }
    }
  }, [user, storageKey, isInitialized])

  // Clear data on window close/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.removeItem(storageKey)
      } catch (error) {
        console.warn("Error clearing data on window close:", error)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [storageKey])

  // Optimized update task assignment with batching
  const updateTaskAssignment = useCallback(
    (taskId: string, role: string, assignment: "Approve" | "Primary" | "Support" | "None") => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const newAssignments = { ...task.assignments, [role]: assignment }

            // Update responsible person if this is a Primary assignment
            let newResponsible = task.responsible
            if (assignment === "Primary") {
              newResponsible = role
            } else if (task.responsible === role && assignment === "None") {
              // Find another Primary role if the current responsible is being removed
              const primaryRole = Object.entries(newAssignments).find(([, assign]) => assign === "Primary")
              newResponsible = primaryRole ? primaryRole[0] : ""
            }

            return {
              ...task,
              assignments: newAssignments,
              responsible: newResponsible,
              updatedAt: new Date().toISOString(),
            }
          }
          return task
        })
      )
    },
    []
  )

  // Optimized update task status
  const updateTaskStatus = useCallback((taskId: string, status: "active" | "pending" | "completed") => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task))
    )
  }, [])

  // Add new task
  const addTask = useCallback((newTask: Omit<ResponsibilityTask, "id" | "createdAt" | "updatedAt">) => {
    const task: ResponsibilityTask = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, task])
  }, [])

  // Remove task
  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }, [])

  // Reset to default data
  const resetToDefault = useCallback(() => {
    setTasks(transformedTasks)
  }, [transformedTasks])

  return {
    tasks,
    roles,
    metrics,
    activeTab,
    setActiveTab,
    loading,
    updateTaskAssignment,
    updateTaskStatus,
    addTask,
    removeTask,
    resetToDefault,
    roleColors,
  }
}
