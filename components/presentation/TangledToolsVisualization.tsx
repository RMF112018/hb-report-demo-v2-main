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
    position: { x: 15, y: 15 },
    category: "Project Management",
  },
  {
    name: "Bluebeam",
    icon: PenTool,
    color: "bg-blue-500",
    position: { x: 75, y: 10 },
    category: "Document Management",
  },
  {
    name: "Excel",
    icon: Calculator,
    color: "bg-green-500",
    position: { x: 25, y: 60 },
    category: "Spreadsheets",
    hasDocumentSilos: true,
  },
  {
    name: "Microsoft Word",
    icon: FileText,
    color: "bg-blue-600",
    position: { x: 15, y: 40 },
    category: "Documents",
    hasDocumentSilos: true,
  },
  {
    name: "Microsoft Teams",
    icon: MessageCircle,
    color: "bg-purple-600",
    position: { x: 85, y: 20 },
    category: "Communication",
  },
  {
    name: "MS Project",
    icon: Calendar,
    color: "bg-green-600",
    position: { x: 90, y: 45 },
    category: "Scheduling",
  },
  {
    name: "Oracle Primavera P6",
    icon: Clock,
    color: "bg-red-600",
    position: { x: 40, y: 15 },
    category: "Project Scheduling",
  },
  {
    name: "Email",
    icon: Mail,
    color: "bg-red-500",
    position: { x: 60, y: 65 },
    category: "Communication",
  },
  {
    name: "SharePoint",
    icon: Database,
    color: "bg-blue-700",
    position: { x: 80, y: 80 },
    category: "File Storage",
  },
  {
    name: "Compass by Bespoke",
    icon: BarChart3,
    color: "bg-purple-500",
    position: { x: 10, y: 75 },
    category: "Analytics",
  },
  {
    name: "Sitemate",
    icon: FileText,
    color: "bg-teal-500",
    position: { x: 55, y: 30 },
    category: "Field Management",
  },
  {
    name: "Sage 300",
    icon: DollarSign,
    color: "bg-yellow-500",
    position: { x: 85, y: 60 },
    category: "Accounting",
  },
  {
    name: "BuildingConnected",
    icon: Layers,
    color: "bg-indigo-500",
    position: { x: 35, y: 85 },
    category: "Bidding",
  },
  {
    name: "On Screen Takeoff",
    icon: Settings,
    color: "bg-pink-500",
    position: { x: 70, y: 45 },
    category: "Estimating",
  },
  {
    name: "Unanet",
    icon: Shield,
    color: "bg-gray-500",
    position: { x: 50, y: 80 },
    category: "ERP",
  },
  {
    name: "Manual Processes",
    icon: Zap,
    color: "bg-amber-500",
    position: { x: 65, y: 85 },
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
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{toolName} Document Chaos</h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {documentSilos.reduce((sum, silo) => sum + silo.count, 0)} scattered files
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                // This will be handled by the parent click handler
              }}
            >
              ✕
            </button>
          </div>
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

        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Isolated in departmental silos</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>No version control or central access</span>
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
                } text-white font-medium px-3 py-1 text-xs shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  tool.hasDocumentSilos ? "ring-2 ring-yellow-300 ring-opacity-50" : ""
                }`}
                onClick={() => (tool.hasDocumentSilos ? setSelectedTool(tool) : null)}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {tool.name}
                {tool.hasDocumentSilos && <FolderOpen className="h-3 w-3 ml-1 animate-pulse" />}
              </Badge>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {tool.category}
                {tool.hasDocumentSilos && " • Click to see document silos"}
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Chaos indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Disconnected Systems</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Current Tool Ecosystem</div>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
          <div>• {tools.length} Different Tools</div>
          <div>• {connections.length} Data Silos</div>
          <div>• Manual Integration</div>
          <div>• Information Loss</div>
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
