"use client"

import React from "react"
import Image from "next/image"

interface JobCostHistoryProps {
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

export function JobCostHistory({ projectData }: JobCostHistoryProps) {
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

  // Mock JCHR data based on the JCHR component
  const jchrData = [
    {
      division: "02 - Existing Conditions",
      budget: 125000,
      actual: 118500,
      committed: 122000,
      forecast: 125000,
      variance: 6500,
      variancePercent: 5.2,
      completion: 95,
    },
    {
      division: "03 - Concrete",
      budget: 2850000,
      actual: 2720000,
      committed: 2780000,
      forecast: 2820000,
      variance: 30000,
      variancePercent: 1.1,
      completion: 88,
    },
    {
      division: "04 - Masonry",
      budget: 1850000,
      actual: 1680000,
      committed: 1720000,
      forecast: 1750000,
      variance: 100000,
      variancePercent: 5.4,
      completion: 92,
    },
    {
      division: "05 - Metals",
      budget: 3200000,
      actual: 2950000,
      committed: 3020000,
      forecast: 3080000,
      variance: 120000,
      variancePercent: 3.8,
      completion: 85,
    },
    {
      division: "06 - Wood & Plastics",
      budget: 850000,
      actual: 780000,
      committed: 800000,
      forecast: 820000,
      variance: 30000,
      variancePercent: 3.5,
      completion: 90,
    },
    {
      division: "07 - Thermal & Moisture",
      budget: 2100000,
      actual: 1950000,
      committed: 1980000,
      forecast: 2020000,
      variance: 80000,
      variancePercent: 3.8,
      completion: 87,
    },
    {
      division: "08 - Doors & Windows",
      budget: 1650000,
      actual: 1520000,
      committed: 1550000,
      forecast: 1580000,
      variance: 70000,
      variancePercent: 4.2,
      completion: 89,
    },
    {
      division: "09 - Finishes",
      budget: 3200000,
      actual: 2850000,
      committed: 2920000,
      forecast: 2980000,
      variance: 220000,
      variancePercent: 6.9,
      completion: 82,
    },
    {
      division: "10 - Specialties",
      budget: 450000,
      actual: 420000,
      committed: 430000,
      forecast: 440000,
      variance: 10000,
      variancePercent: 2.2,
      completion: 94,
    },
    {
      division: "11 - Equipment",
      budget: 1800000,
      actual: 1650000,
      committed: 1680000,
      forecast: 1720000,
      variance: 80000,
      variancePercent: 4.4,
      completion: 86,
    },
    {
      division: "12 - Furnishings",
      budget: 350000,
      actual: 320000,
      committed: 330000,
      forecast: 340000,
      variance: 10000,
      variancePercent: 2.9,
      completion: 91,
    },
    {
      division: "21 - Fire Suppression",
      budget: 850000,
      actual: 780000,
      committed: 800000,
      forecast: 820000,
      variance: 30000,
      variancePercent: 3.5,
      completion: 88,
    },
    {
      division: "22 - Plumbing",
      budget: 2100000,
      actual: 1950000,
      committed: 1980000,
      forecast: 2020000,
      variance: 80000,
      variancePercent: 3.8,
      completion: 87,
    },
    {
      division: "23 - HVAC",
      budget: 2850000,
      actual: 2650000,
      committed: 2700000,
      forecast: 2750000,
      variance: 100000,
      variancePercent: 3.5,
      completion: 85,
    },
    {
      division: "26 - Electrical",
      budget: 3200000,
      actual: 2950000,
      committed: 3020000,
      forecast: 3080000,
      variance: 120000,
      variancePercent: 3.8,
      completion: 85,
    },
    {
      division: "31 - Earthwork",
      budget: 1850000,
      actual: 1680000,
      committed: 1720000,
      forecast: 1750000,
      variance: 100000,
      variancePercent: 5.4,
      completion: 92,
    },
    {
      division: "32 - Exterior Improvements",
      budget: 850000,
      actual: 780000,
      committed: 800000,
      forecast: 820000,
      variance: 30000,
      variancePercent: 3.5,
      completion: 90,
    },
    {
      division: "33 - Utilities",
      budget: 1250000,
      actual: 1150000,
      committed: 1180000,
      forecast: 1200000,
      variance: 50000,
      variancePercent: 4.0,
      completion: 88,
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

  const totalBudget = jchrData.reduce((sum, item) => sum + item.budget, 0)
  const totalActual = jchrData.reduce((sum, item) => sum + item.actual, 0)
  const totalCommitted = jchrData.reduce((sum, item) => sum + item.committed, 0)
  const totalForecast = jchrData.reduce((sum, item) => sum + item.forecast, 0)
  const totalVariance = jchrData.reduce((sum, item) => sum + item.variance, 0)

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
          <h1 className="text-xl font-bold text-[#FF6B35]">JOB COST HISTORY REPORT</h1>
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

      {/* JCHR Summary */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Job Cost History Summary</h2>
        </div>
        <div className="grid grid-cols-6 gap-4 text-sm font-medium border-b border-gray-300 pb-2 mb-4">
          <div>Division</div>
          <div className="text-right">Budget</div>
          <div className="text-right">Actual</div>
          <div className="text-right">Committed</div>
          <div className="text-right">Forecast</div>
          <div className="text-right">Variance</div>
        </div>
        {jchrData.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 text-sm border-b border-gray-200 py-2">
            <div className="font-medium">{item.division}</div>
            <div className="text-right">{formatCurrency(item.budget)}</div>
            <div className="text-right">{formatCurrency(item.actual)}</div>
            <div className="text-right">{formatCurrency(item.committed)}</div>
            <div className="text-right">{formatCurrency(item.forecast)}</div>
            <div className={`text-right ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(item.variance)}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-6 gap-4 text-sm font-bold border-t-2 border-gray-400 pt-2 mt-2">
          <div>TOTAL</div>
          <div className="text-right">{formatCurrency(totalBudget)}</div>
          <div className="text-right">{formatCurrency(totalActual)}</div>
          <div className="text-right">{formatCurrency(totalCommitted)}</div>
          <div className="text-right">{formatCurrency(totalForecast)}</div>
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
              <strong>Overall Budget Utilization:</strong> 78.5%
            </div>
            <div className="mb-2">
              <strong>Cost Performance Index:</strong> 1.072
            </div>
            <div className="mb-2">
              <strong>Schedule Performance Index:</strong> 0.965
            </div>
            <div className="mb-2">
              <strong>Overall Completion:</strong> 87.2%
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Total Variance:</strong> {formatCurrency(totalVariance)}
            </div>
            <div className="mb-2">
              <strong>Variance Percentage:</strong> {formatPercent((totalVariance / totalBudget) * 100)}
            </div>
            <div className="mb-2">
              <strong>Forecast at Completion:</strong> {formatCurrency(totalForecast)}
            </div>
            <div className="mb-2">
              <strong>Projected Profit:</strong> {formatCurrency(2336015)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Divisions Analysis */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Key Divisions Analysis</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-bold mb-2">Top Performing Divisions</h3>
            <div className="space-y-1">
              <div>• 02 - Existing Conditions (95% complete)</div>
              <div>• 10 - Specialties (94% complete)</div>
              <div>• 12 - Furnishings (91% complete)</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Divisions Requiring Attention</h3>
            <div className="space-y-1">
              <div>• 09 - Finishes (82% complete)</div>
              <div>• 05 - Metals (85% complete)</div>
              <div>• 23 - HVAC (85% complete)</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Variance Analysis</h3>
            <div className="space-y-1">
              <div>• 09 - Finishes: {formatCurrency(220000)} over</div>
              <div>• 05 - Metals: {formatCurrency(120000)} over</div>
              <div>• 04 - Masonry: {formatCurrency(100000)} over</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
