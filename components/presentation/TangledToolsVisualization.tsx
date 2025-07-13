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
    position: { x: 12, y: 18 },
    category: "Project Management",
  },
  {
    name: "Bluebeam",
    icon: PenTool,
    color: "bg-blue-500",
    position: { x: 78, y: 12 },
    category: "Document Management",
  },
  {
    name: "Excel",
    icon: Calculator,
    color: "bg-green-500",
    position: { x: 22, y: 65 },
    category: "Spreadsheets",
    hasDocumentSilos: true,
  },
  {
    name: "Word",
    icon: FileText,
    color: "bg-blue-600",
    position: { x: 8, y: 45 },
    category: "Documents",
    hasDocumentSilos: true,
  },
  {
    name: "Teams",
    icon: MessageCircle,
    color: "bg-purple-600",
    position: { x: 88, y: 25 },
    category: "Communication",
  },
  {
    name: "MS Project",
    icon: Calendar,
    color: "bg-green-600",
    position: { x: 92, y: 50 },
    category: "Scheduling",
  },
  {
    name: "Primavera P6",
    icon: Clock,
    color: "bg-red-600",
    position: { x: 45, y: 18 },
    category: "Scheduling",
  },
  {
    name: "Email",
    icon: Mail,
    color: "bg-red-500",
    position: { x: 65, y: 68 },
    category: "Communication",
  },
  {
    name: "SharePoint",
    icon: Database,
    color: "bg-blue-700",
    position: { x: 85, y: 78 },
    category: "File Storage",
  },
  {
    name: "Compass Analytics",
    icon: BarChart3,
    color: "bg-purple-500",
    position: { x: 8, y: 78 },
    category: "Analytics",
  },
  {
    name: "Sitemate",
    icon: FileText,
    color: "bg-teal-500",
    position: { x: 58, y: 32 },
    category: "Field Management",
  },
  {
    name: "Sage 300",
    icon: DollarSign,
    color: "bg-yellow-500",
    position: { x: 88, y: 65 },
    category: "Accounting",
  },
  {
    name: "BuildingConnected",
    icon: Layers,
    color: "bg-indigo-500",
    position: { x: 38, y: 88 },
    category: "Bidding",
  },
  {
    name: "Takeoff",
    icon: Settings,
    color: "bg-pink-500",
    position: { x: 72, y: 48 },
    category: "Estimating",
  },
  {
    name: "Unanet",
    icon: Shield,
    color: "bg-gray-500",
    position: { x: 52, y: 82 },
    category: "ERP",
  },
  {
    name: "Manual Tasks",
    icon: Zap,
    color: "bg-amber-500",
    position: { x: 68, y: 88 },
    category: "Legacy",
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

const DocumentSiloVisualization: React.FC<{ toolName: string }> = ({ toolName }) => {
  const fileExtension = toolName.includes("Word") ? ".docx" : ".xlsx"
  const fileColor = toolName.includes("Word") ? "bg-blue-100 border-blue-300" : "bg-green-100 border-green-300"

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-lg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{toolName} Document Chaos</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {documentSilos.reduce((sum, silo) => sum + silo.count, 0)} scattered files across departments
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors text-xl font-bold p-1"
            onClick={(e) => {
              e.stopPropagation()
              // This will be handled by the parent click handler
            }}
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
    </div>
  )
}

export const TangledToolsVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  // Generate connection lines between tools
  const generateConnections = () => {
    const connections = []
    const numConnections = 15 // Number of tangled connections

    for (let i = 0; i < numConnections; i++) {
      const fromTool = tools[Math.floor(Math.random() * tools.length)]
      const toTool = tools[Math.floor(Math.random() * tools.length)]

      if (fromTool !== toTool) {
        connections.push({
          from: fromTool.position,
          to: toTool.position,
          opacity: Math.random() * 0.3 + 0.1,
          strokeWidth: Math.random() * 2 + 1,
        })
      }
    }

    return connections
  }

  const connections = generateConnections()

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1" />
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
              (connection.from.x + connection.to.x) / 2 + Math.random() * 20 - 10
            } ${(connection.from.y + connection.to.y) / 2 + Math.random() * 20 - 10} ${connection.to.x} ${
              connection.to.y
            }`}
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth={connection.strokeWidth}
            opacity={connection.opacity}
            strokeDasharray="2,2"
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
                } text-white font-semibold px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap border border-white/20 ${
                  tool.hasDocumentSilos ? "ring-2 ring-yellow-400 ring-opacity-75 shadow-yellow-200/30" : ""
                }`}
                onClick={() => (tool.hasDocumentSilos ? setSelectedTool(tool) : null)}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tool.name}
                {tool.hasDocumentSilos && <FolderOpen className="h-4 w-4 ml-2 animate-pulse" />}
              </Badge>

              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 shadow-xl border border-gray-700">
                <div className="font-medium">{tool.category}</div>
                {tool.hasDocumentSilos && (
                  <div className="text-xs text-yellow-300 mt-1">Click to see document silos</div>
                )}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Enhanced Chaos indicator */}
      <div className="absolute bottom-6 right-6">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 font-medium">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Disconnected Systems</span>
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-4 border border-gray-300 dark:border-gray-600 shadow-lg min-w-48">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Current Tool Ecosystem
        </div>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex justify-between items-center">
            <span>Different Tools:</span>
            <span className="font-medium text-red-600 dark:text-red-400">{tools.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Data Silos:</span>
            <span className="font-medium text-orange-600 dark:text-orange-400">{connections.length}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div>• Manual Integration Required</div>
            <div>• Constant Information Loss</div>
          </div>
        </div>
      </div>

      {/* Document Silo Modal */}
      {selectedTool && selectedTool.hasDocumentSilos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTool(null)}
        >
          <DocumentSiloVisualization toolName={selectedTool.name} />
        </motion.div>
      )}
    </div>
  )
}

export default TangledToolsVisualization
