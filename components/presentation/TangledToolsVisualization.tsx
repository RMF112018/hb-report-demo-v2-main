/**
 * @fileoverview Tangled Tools Visualization Component
 * @module TangledToolsVisualization
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Visual representation of the fragmented construction technology ecosystem
 * showing various tools connected by tangled lines to illustrate chaos.
 */

"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Mail,
  Calculator,
  Building2,
  BarChart3,
  Layers,
  Database,
  Settings,
  Zap,
  PenTool,
  DollarSign,
  Shield,
  MessageCircle,
  Calendar,
  Clock,
  FolderOpen,
  Users,
} from "lucide-react"

interface Tool {
  name: string
  icon: React.ComponentType<any>
  color: string
  position: { x: number; y: number }
  category: string
  hasDocumentSilos?: boolean
}

const tools: Tool[] = [
  {
    name: "Procore",
    icon: Building2,
    color: "bg-orange-500",
    position: { x: 15, y: 25 },
    category: "Project Management",
  },
  {
    name: "Bluebeam",
    icon: PenTool,
    color: "bg-blue-500",
    position: { x: 75, y: 15 },
    category: "Document Management",
  },
  {
    name: "Excel",
    icon: Calculator,
    color: "bg-green-500",
    position: { x: 25, y: 70 },
    category: "Spreadsheets",
    hasDocumentSilos: true,
  },
  {
    name: "Word",
    icon: FileText,
    color: "bg-blue-600",
    position: { x: 10, y: 50 },
    category: "Documents",
    hasDocumentSilos: true,
  },
  {
    name: "Teams",
    icon: MessageCircle,
    color: "bg-purple-600",
    position: { x: 85, y: 30 },
    category: "Communication",
  },
  {
    name: "MS Project",
    icon: Calendar,
    color: "bg-green-600",
    position: { x: 90, y: 55 },
    category: "Scheduling",
  },
  {
    name: "Primavera P6",
    icon: Clock,
    color: "bg-red-600",
    position: { x: 50, y: 20 },
    category: "Scheduling",
  },
  {
    name: "Email",
    icon: Mail,
    color: "bg-red-500",
    position: { x: 60, y: 75 },
    category: "Communication",
  },
  {
    name: "SharePoint",
    icon: FolderOpen,
    color: "bg-gray-600",
    position: { x: 80, y: 70 },
    category: "File Storage",
  },
  {
    name: "Compass Analytics",
    icon: BarChart3,
    color: "bg-purple-500",
    position: { x: 35, y: 40 },
    category: "Analytics",
  },
  {
    name: "Sitemate",
    icon: Layers,
    color: "bg-teal-500",
    position: { x: 70, y: 45 },
    category: "Field Management",
  },
  {
    name: "Sage 300",
    icon: DollarSign,
    color: "bg-yellow-600",
    position: { x: 45, y: 60 },
    category: "Financial",
  },
  {
    name: "BuildingConnected",
    icon: Database,
    color: "bg-indigo-500",
    position: { x: 55, y: 35 },
    category: "Procurement",
  },
  {
    name: "Takeoff",
    icon: Settings,
    color: "bg-gray-500",
    position: { x: 30, y: 25 },
    category: "Estimation",
  },
  {
    name: "Unanet",
    icon: Shield,
    color: "bg-rose-500",
    position: { x: 40, y: 80 },
    category: "ERP",
  },
  {
    name: "Manual Tasks",
    icon: Users,
    color: "bg-red-700",
    position: { x: 15, y: 85 },
    category: "Manual Process",
  },
]

// Document silos for Word and Excel
const documentSilos = [
  { name: "Estimating", position: { x: 20, y: 20 }, count: 47 },
  { name: "Ops", position: { x: 50, y: 25 }, count: 32 },
  { name: "Field", position: { x: 80, y: 30 }, count: 28 },
  { name: "Residential", position: { x: 15, y: 50 }, count: 19 },
  { name: "Winter Park", position: { x: 45, y: 55 }, count: 15 },
  { name: "Melbourne", position: { x: 75, y: 60 }, count: 23 },
  { name: "WPB", position: { x: 30, y: 75 }, count: 12 },
]

const DocumentSiloVisualization: React.FC<{ toolName: string; onClose: () => void }> = ({ toolName, onClose }) => {
  const fileExtension = toolName.includes("Word") ? ".docx" : ".xlsx"
  const fileColor = toolName.includes("Word") ? "bg-blue-100 border-blue-300" : "bg-green-100 border-green-300"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-lg flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{toolName} Document Chaos</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {documentSilos.reduce((sum, silo) => sum + silo.count, 0)} scattered files across departments
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors text-xl font-bold p-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="relative h-48 bg-gray-50 dark:bg-gray-700 rounded border overflow-hidden">
          {documentSilos.map((silo, index) => (
            <div key={silo.name} className="absolute">
              <div
                className="absolute"
                style={{
                  left: `${silo.position.x}%`,
                  top: `${silo.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{silo.name}</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {Array.from({ length: Math.min(silo.count, 8) }, (_, i) => (
                      <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${fileColor} text-xs flex items-center justify-center`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1 + i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {silo.count} {fileExtension}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Isolated in departmental silos</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              No version control or central access
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const TangledToolsVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  // Generate connection lines between tools
  const generateConnections = () => {
    const connections = []
    const numConnections = 12 // Increased slightly for better visual impact

    // Create more purposeful connections between related tools
    const purposefulConnections = [
      { from: tools[0], to: tools[12] }, // Procore to BuildingConnected
      { from: tools[2], to: tools[3] }, // Excel to Word
      { from: tools[4], to: tools[7] }, // Teams to Email
      { from: tools[5], to: tools[6] }, // MS Project to Primavera
      { from: tools[8], to: tools[7] }, // SharePoint to Email
    ]

    // Add purposeful connections first
    purposefulConnections.forEach((conn) => {
      connections.push({
        from: conn.from.position,
        to: conn.to.position,
        opacity: 0.4, // Increased for better visibility as background
        strokeWidth: 2,
        isPurposeful: true,
      })
    })

    // Add remaining random connections
    for (let i = purposefulConnections.length; i < numConnections; i++) {
      const fromTool = tools[Math.floor(Math.random() * tools.length)]
      const toTool = tools[Math.floor(Math.random() * tools.length)]

      if (fromTool !== toTool) {
        connections.push({
          from: fromTool.position,
          to: toTool.position,
          opacity: Math.random() * 0.3 + 0.15, // Increased for background visibility
          strokeWidth: Math.random() * 1.5 + 1,
          isPurposeful: false,
        })
      }
    }

    return connections
  }

  const connections = generateConnections()

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Background visualization container */}
      <div className="absolute inset-0 opacity-40">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-50/10 to-gray-100/10 dark:from-gray-900/20 dark:to-gray-800/20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgb(255, 255, 255)" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Tangled connection lines */}
          <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map((connection, index) => (
              <motion.path
                key={index}
                d={`M ${connection.from.x} ${connection.from.y} Q ${
                  (connection.from.x + connection.to.x) / 2 + (connection.isPurposeful ? 0 : Math.random() * 15 - 7.5)
                } ${
                  (connection.from.y + connection.to.y) / 2 + (connection.isPurposeful ? 0 : Math.random() * 15 - 7.5)
                } ${connection.to.x} ${connection.to.y}`}
                fill="none"
                stroke={connection.isPurposeful ? "rgb(239, 68, 68)" : "rgb(156, 163, 175)"}
                strokeWidth={connection.strokeWidth}
                opacity={connection.opacity}
                strokeDasharray={connection.isPurposeful ? "4,4" : "2,3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>

          {/* Tool nodes */}
          {tools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <motion.div
                key={tool.name}
                className="absolute"
                style={{
                  left: `${tool.position.x}%`,
                  top: `${tool.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <div className="relative group">
                  <Badge
                    className={`${
                      tool.color
                    } text-white font-medium px-4 py-2 text-base shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap border border-white/30 hover:scale-105 ${
                      tool.hasDocumentSilos ? "ring-2 ring-yellow-400 ring-opacity-75" : ""
                    }`}
                    onClick={() => (tool.hasDocumentSilos ? setSelectedTool(tool) : null)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tool.name}
                    {tool.hasDocumentSilos && <span className="ml-1 text-yellow-300">📁</span>}
                  </Badge>

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                    {tool.category}
                    {tool.hasDocumentSilos && <div className="text-xs text-yellow-300">Click for document silos</div>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Compact legend in bottom corner */}
      <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20 z-10">
        <div className="text-white text-sm space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>16+ Disconnected Tools</span>
          </div>
          <div className="text-xs text-gray-300">
            {tools.filter((t) => t.hasDocumentSilos).length} Document Silos • Manual Integration Required
          </div>
        </div>
      </div>

      {/* Chaos indicator in top right */}
      <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-400/30 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-200 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">System Fragmentation</span>
        </div>
      </div>

      {/* Document Silo Modal */}
      {selectedTool && <DocumentSiloVisualization toolName={selectedTool.name} onClose={() => setSelectedTool(null)} />}
    </div>
  )
}

export default TangledToolsVisualization
