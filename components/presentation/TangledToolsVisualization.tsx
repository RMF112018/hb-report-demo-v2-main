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

import React, { useEffect, useRef } from "react"
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
} from "lucide-react"

interface Tool {
  name: string
  icon: React.ComponentType<any>
  color: string
  position: { x: number; y: number }
  category: string
}

const tools: Tool[] = [
  {
    name: "Procore",
    icon: Building2,
    color: "bg-orange-500",
    position: { x: 15, y: 20 },
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
    position: { x: 25, y: 65 },
    category: "Spreadsheets",
  },
  {
    name: "Email",
    icon: Mail,
    color: "bg-red-500",
    position: { x: 60, y: 70 },
    category: "Communication",
  },
  {
    name: "SharePoint",
    icon: Database,
    color: "bg-blue-600",
    position: { x: 80, y: 45 },
    category: "File Storage",
  },
  {
    name: "Compass by Bespoke",
    icon: BarChart3,
    color: "bg-purple-500",
    position: { x: 10, y: 45 },
    category: "Analytics",
  },
  {
    name: "Sitemate",
    icon: FileText,
    color: "bg-teal-500",
    position: { x: 45, y: 25 },
    category: "Field Management",
  },
  {
    name: "Sage 300",
    icon: DollarSign,
    color: "bg-yellow-500",
    position: { x: 85, y: 75 },
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
    position: { x: 70, y: 35 },
    category: "Estimating",
  },
  {
    name: "Unanet",
    icon: Shield,
    color: "bg-gray-500",
    position: { x: 50, y: 55 },
    category: "ERP",
  },
  {
    name: "Manual Processes",
    icon: Zap,
    color: "bg-amber-500",
    position: { x: 20, y: 80 },
    category: "Legacy",
  },
]

export const TangledToolsVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)

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
                className={`${tool.color} text-white font-medium px-3 py-1 text-xs shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {tool.name}
              </Badge>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {tool.category}
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
    </div>
  )
}

export default TangledToolsVisualization
