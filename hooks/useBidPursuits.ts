import { useState, useEffect } from "react"
import { ProjectPursuit } from "../types/estimating"
import defaultPursuits from "../data/mock/pursuits.json"

export const useBidPursuits = () => {
  const [data, setData] = useState<ProjectPursuit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data from localStorage or default JSON
  useEffect(() => {
    const initializeData = () => {
      try {
        const cached = localStorage.getItem("pursuits")
        if (cached) {
          const parsedData = JSON.parse(cached) as ProjectPursuit[]
          setData(parsedData)
        } else {
          // Type assertion for imported JSON data
          const typedDefaultPursuits = defaultPursuits as ProjectPursuit[]
          setData(typedDefaultPursuits)
          localStorage.setItem("pursuits", JSON.stringify(typedDefaultPursuits))
        }
      } catch (error) {
        console.error("Error loading pursuits data:", error)
        // Fallback to default data if localStorage fails
        const typedDefaultPursuits = defaultPursuits as ProjectPursuit[]
        setData(typedDefaultPursuits)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const updateProject = (id: string, updates: Partial<ProjectPursuit>) => {
    setData((currentData) => {
      const updated = currentData.map((project) => (project.id === id ? { ...project, ...updates } : project))

      try {
        localStorage.setItem("pursuits", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      return updated
    })
  }

  const addProject = (newProject: ProjectPursuit) => {
    setData((currentData) => {
      const updated = [...currentData, newProject]

      try {
        localStorage.setItem("pursuits", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      return updated
    })
  }

  const removeProject = (id: string) => {
    setData((currentData) => {
      const updated = currentData.filter((project) => project.id !== id)

      try {
        localStorage.setItem("pursuits", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      return updated
    })
  }

  const resetToDefaults = () => {
    const typedDefaultPursuits = defaultPursuits as ProjectPursuit[]
    setData(typedDefaultPursuits)

    try {
      localStorage.setItem("pursuits", JSON.stringify(typedDefaultPursuits))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return {
    data,
    isLoading,
    updateProject,
    addProject,
    removeProject,
    resetToDefaults,
  }
}
