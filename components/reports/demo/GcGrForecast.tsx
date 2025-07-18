"use client"

import React from "react"
import Image from "next/image"

interface GcGrForecastProps {
  projectData?: {
    name: string
    number: string
    type: string
    contractType: string
    pm: string
    px: string
    forecastMonth: string
  }
}

export function GcGrForecast({ projectData }: GcGrForecastProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const mockProjectData = {
    name: "Demo Construction Project",
    number: "HBC-2024-001",
    type: "New Construction",
    contractType: "Lump Sum",
    pm: "HBC Project Manager",
    px: "Complete Project Info",
    forecastMonth: "October 2025",
  }

  const data = projectData || mockProjectData

  // Mock GC & GR data based on the Forecasting component
  const gcGrData = [
    {
      category: "General Conditions",
      originalBudget: 8500000,
      currentBudget: 8500000,
      actualToDate: 7200000,
      committedToDate: 7800000,
      forecastToComplete: 8100000,
      variance: 400000,
      variancePercent: 4.7,
      completion: 85,
    },
    {
      category: "Project Management",
      originalBudget: 3200000,
      currentBudget: 3200000,
      actualToDate: 2850000,
      committedToDate: 2950000,
      forecastToComplete: 3000000,
      variance: 200000,
      variancePercent: 6.3,
      completion: 88,
    },
    {
      category: "Supervision",
      originalBudget: 2800000,
      currentBudget: 2800000,
      actualToDate: 2450000,
      committedToDate: 2520000,
      forecastToComplete: 2580000,
      variance: 220000,
      variancePercent: 7.9,
      completion: 85,
    },
    {
      category: "Safety & Security",
      originalBudget: 1200000,
      currentBudget: 1200000,
      actualToDate: 1080000,
      committedToDate: 1120000,
      forecastToComplete: 1150000,
      variance: 50000,
      variancePercent: 4.2,
      completion: 90,
    },
    {
      category: "Quality Control",
      originalBudget: 950000,
      currentBudget: 950000,
      actualToDate: 820000,
      committedToDate: 850000,
      forecastToComplete: 880000,
      variance: 70000,
      variancePercent: 7.4,
      completion: 87,
    },
    {
      category: "Documentation",
      originalBudget: 650000,
      currentBudget: 650000,
      actualToDate: 580000,
      committedToDate: 600000,
      forecastToComplete: 620000,
      variance: 30000,
      variancePercent: 4.6,
      completion: 89,
    },
    {
      category: "Temporary Facilities",
      originalBudget: 1800000,
      currentBudget: 1800000,
      actualToDate: 1620000,
      committedToDate: 1680000,
      forecastToComplete: 1720000,
      variance: 80000,
      variancePercent: 4.4,
      completion: 88,
    },
    {
      category: "Utilities & Services",
      originalBudget: 1400000,
      currentBudget: 1400000,
      actualToDate: 1250000,
      committedToDate: 1280000,
      forecastToComplete: 1320000,
      variance: 80000,
      variancePercent: 5.7,
      completion: 86,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`
  }

  const totalOriginalBudget = gcGrData.reduce((sum, item) => sum + item.originalBudget, 0)
  const totalCurrentBudget = gcGrData.reduce((sum, item) => sum + item.currentBudget, 0)
  const totalActualToDate = gcGrData.reduce((sum, item) => sum + item.actualToDate, 0)
  const totalCommittedToDate = gcGrData.reduce((sum, item) => sum + item.committedToDate, 0)
  const totalForecastToComplete = gcGrData.reduce((sum, item) => sum + item.forecastToComplete, 0)
  const totalVariance = gcGrData.reduce((sum, item) => sum + item.variance, 0)

  return (
    <div className="bg-white text-black p-8 max-w-6xl mx-auto font-sans print:p-4 print:max-w-none">
      {/* Header */}
      <div className="grid grid-cols-3 items-center mb-8 border-b-2 border-gray-300 pb-4">
        <div className="flex items-center">
          <Image
            src="/images/HB_Logo_Large.png"
            alt="Hedrick Brothers Construction"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#FF6B35]">GC & GR FORECAST</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{currentDate}</p>
        </div>
      </div>

      {/* Project Information */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>Project Name:</strong> {data.name}
            </div>
            <div className="mb-2">
              <strong>Project Number:</strong> {data.number}
            </div>
            <div className="mb-2">
              <strong>Project Type:</strong> {data.type}
            </div>
            <div className="mb-2">
              <strong>Contract Type:</strong> {data.contractType}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>PM:</strong> {data.pm}
            </div>
            <div className="mb-2">
              <strong>PX:</strong> {data.px}
            </div>
            <div className="mb-2">
              <strong>Report Date:</strong> {data.forecastMonth}
            </div>
            <div className="mb-2">
              <strong>Contract Value:</strong> {formatCurrency(57235491)}
            </div>
          </div>
        </div>
      </div>

      {/* GC & GR Summary */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">General Conditions & General Requirements Forecast</h2>
        </div>
        <div className="grid grid-cols-7 gap-4 text-sm font-medium border-b border-gray-300 pb-2 mb-4">
          <div>Category</div>
          <div className="text-right">Original Budget</div>
          <div className="text-right">Current Budget</div>
          <div className="text-right">Actual To Date</div>
          <div className="text-right">Committed To Date</div>
          <div className="text-right">Forecast To Complete</div>
          <div className="text-right">Variance</div>
        </div>
        {gcGrData.map((item, index) => (
          <div key={index} className="grid grid-cols-7 gap-4 text-sm border-b border-gray-200 py-2">
            <div className="font-medium">{item.category}</div>
            <div className="text-right">{formatCurrency(item.originalBudget)}</div>
            <div className="text-right">{formatCurrency(item.currentBudget)}</div>
            <div className="text-right">{formatCurrency(item.actualToDate)}</div>
            <div className="text-right">{formatCurrency(item.committedToDate)}</div>
            <div className="text-right">{formatCurrency(item.forecastToComplete)}</div>
            <div className={`text-right ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(item.variance)}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-7 gap-4 text-sm font-bold border-t-2 border-gray-400 pt-2 mt-2">
          <div>TOTAL</div>
          <div className="text-right">{formatCurrency(totalOriginalBudget)}</div>
          <div className="text-right">{formatCurrency(totalCurrentBudget)}</div>
          <div className="text-right">{formatCurrency(totalActualToDate)}</div>
          <div className="text-right">{formatCurrency(totalCommittedToDate)}</div>
          <div className="text-right">{formatCurrency(totalForecastToComplete)}</div>
          <div className={`text-right ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(totalVariance)}
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Performance Analysis</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>GC & GR Budget Utilization:</strong> 84.7%
            </div>
            <div className="mb-2">
              <strong>Cost Performance Index:</strong> 1.058
            </div>
            <div className="mb-2">
              <strong>Schedule Performance Index:</strong> 0.972
            </div>
            <div className="mb-2">
              <strong>Overall Completion:</strong> 86.8%
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Total Variance:</strong> {formatCurrency(totalVariance)}
            </div>
            <div className="mb-2">
              <strong>Variance Percentage:</strong> {formatPercent((totalVariance / totalOriginalBudget) * 100)}
            </div>
            <div className="mb-2">
              <strong>Forecast at Completion:</strong> {formatCurrency(totalForecastToComplete)}
            </div>
            <div className="mb-2">
              <strong>Projected Profit:</strong> {formatCurrency(2336015)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Categories Analysis */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Key Categories Analysis</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-bold mb-2">Top Performing Categories</h3>
            <div className="space-y-1">
              <div>• Safety & Security (90% complete)</div>
              <div>• Documentation (89% complete)</div>
              <div>• Temporary Facilities (88% complete)</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Categories Requiring Attention</h3>
            <div className="space-y-1">
              <div>• Quality Control (87% complete)</div>
              <div>• Supervision (85% complete)</div>
              <div>• General Conditions (85% complete)</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Variance Analysis</h3>
            <div className="space-y-1">
              <div>• Supervision: {formatCurrency(220000)} over</div>
              <div>• Quality Control: {formatCurrency(70000)} over</div>
              <div>• Utilities & Services: {formatCurrency(80000)} over</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Risk Assessment</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-2">High Risk Areas</h3>
            <div className="space-y-1">
              <div>• Supervision variance exceeds 7% threshold</div>
              <div>• Quality Control approaching budget limit</div>
              <div>• General Conditions requires monitoring</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Mitigation Strategies</h3>
            <div className="space-y-1">
              <div>• Implement additional oversight controls</div>
              <div>• Review quality processes for efficiency</div>
              <div>• Optimize general conditions spending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
