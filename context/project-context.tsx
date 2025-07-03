'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import projectsData from '@/data/mock/projects.json'

type ProjectContextType = {
  projectId: string
  projectName: string | null
  setProjectId: (id: string) => void
  getProjectById: (id: string) => any
  clearProject: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectId, setProjectIdState] = useState<string>('all')
  const [projectName, setProjectName] = useState<string | null>(null)

  // Get project by ID helper function
  const getProjectById = (id: string) => {
    if (id === 'all') return null
    return projectsData.find(p => p.project_id.toString() === id) || null
  }

  // Update project name when projectId changes
  useEffect(() => {
    const project = getProjectById(projectId)
    setProjectName(project?.name || null)
  }, [projectId])

  useEffect(() => {
    const saved = localStorage.getItem('selectedProject')
    if (saved && saved !== 'all') {
      console.log('ProjectContext: Restoring saved project:', saved)
      setProjectIdState(saved)
    }
  }, [])

  const setProjectId = (id: string) => {
    console.log('ProjectContext: Setting project ID:', id)
    if (id === 'all') {
      localStorage.removeItem('selectedProject')
    } else {
      localStorage.setItem('selectedProject', id)
    }
    setProjectIdState(id)
  }

  const clearProject = () => {
    console.log('ProjectContext: Clearing project selection')
    // Note: localStorage is cleared centrally in auth context on logout
    setProjectIdState('all')
    setProjectName(null)
  }

  return (
    <ProjectContext.Provider value={{ 
      projectId, 
      projectName, 
      setProjectId, 
      getProjectById, 
      clearProject 
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectContext = (): ProjectContextType => {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjectContext must be used within a ProjectProvider')
  return ctx
}
