"use client"

import React from "react"
import Image from "next/image"

interface BudgetSnapshotProps {
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

export function BudgetSnapshot({ projectData }: BudgetSnapshotProps) {
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

  // Mock budget data based on the Budget Analysis component
  const budgetData = [
    {
      category: "General Conditions",
      budgeted: 8500000,
      actual: 7200000,
      committed: 7800000,
      forecast: 8100000,
      variance: 400000,
      variancePercent: 4.7,
    },
    {
      category: "Main Construction",
      budgeted: 32500000,
      actual: 28200000,
      committed: 30800000,
      forecast: 31200000,
      variance: 1300000,
      variancePercent: 4.0,
    },
    {
      category: "Materials",
      budgeted: 12800000,
      actual: 10950000,
      committed: 12100000,
      forecast: 12400000,
      variance: 400000,
      variancePercent: 3.1,
    },
    {
      category: "Labor",
      budgeted: 18500000,
      actual: 15800000,
      committed: 17200000,
      forecast: 17500000,
      variance: 1000000,
      variancePercent: 5.4,
    },
    {
      category: "Equipment",
      budgeted: 4200000,
      actual: 3800000,
      committed: 4000000,
      forecast: 4100000,
      variance: 100000,
      variancePercent: 2.4,
    },
    {
      category: "Subcontractors",
      budgeted: 28500000,
      actual: 24500000,
      committed: 26800000,
      forecast: 27200000,
      variance: 1300000,
      variancePercent: 4.6,
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

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0)
  const totalCommitted = budgetData.reduce((sum, item) => sum + item.committed, 0)
  const totalForecast = budgetData.reduce((sum, item) => sum + item.forecast, 0)
  const totalVariance = budgetData.reduce((sum, item) => sum + item.variance, 0)

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
          <h1 className="text-xl font-bold text-[#FF6B35]">BUDGET SNAPSHOT</h1>
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

      {/* Budget Summary */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Budget Summary</h2>
        </div>
        <div className="grid grid-cols-5 gap-4 text-sm font-medium border-b border-gray-300 pb-2 mb-4">
          <div>Category</div>
          <div className="text-right">Budgeted</div>
          <div className="text-right">Actual</div>
          <div className="text-right">Committed</div>
          <div className="text-right">Forecast</div>
        </div>
        {budgetData.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 text-sm border-b border-gray-200 py-2">
            <div className="font-medium">{item.category}</div>
            <div className="text-right">{formatCurrency(item.budgeted)}</div>
            <div className="text-right">{formatCurrency(item.actual)}</div>
            <div className="text-right">{formatCurrency(item.committed)}</div>
            <div className="text-right">{formatCurrency(item.forecast)}</div>
          </div>
        ))}
        <div className="grid grid-cols-5 gap-4 text-sm font-bold border-t-2 border-gray-400 pt-2 mt-2">
          <div>TOTAL</div>
          <div className="text-right">{formatCurrency(totalBudgeted)}</div>
          <div className="text-right">{formatCurrency(totalActual)}</div>
          <div className="text-right">{formatCurrency(totalCommitted)}</div>
          <div className="text-right">{formatCurrency(totalForecast)}</div>
        </div>
      </div>

      {/* Variance Analysis */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Variance Analysis</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm font-medium border-b border-gray-300 pb-2 mb-4">
          <div>Category</div>
          <div className="text-right">Variance</div>
          <div className="text-right">Variance %</div>
          <div className="text-right">Status</div>
        </div>
        {budgetData.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 text-sm border-b border-gray-200 py-2">
            <div className="font-medium">{item.category}</div>
            <div className={`text-right ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(item.variance)}
            </div>
            <div className="text-right">{formatPercent(item.variancePercent)}</div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  item.variance >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {item.variance >= 0 ? "Under Budget" : "Over Budget"}
              </span>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-4 gap-4 text-sm font-bold border-t-2 border-gray-400 pt-2 mt-2">
          <div>TOTAL VARIANCE</div>
          <div className={`text-right ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(totalVariance)}
          </div>
          <div className="text-right">{formatPercent((totalVariance / totalBudgeted) * 100)}</div>
          <div className="text-right">
            <span
              className={`px-2 py-1 rounded text-xs ${
                totalVariance >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {totalVariance >= 0 ? "Under Budget" : "Over Budget"}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>Budget Utilization:</strong> 78.5%
            </div>
            <div className="mb-2">
              <strong>Cost Performance Index:</strong> 1.072
            </div>
            <div className="mb-2">
              <strong>Schedule Performance Index:</strong> 0.965
            </div>
            <div className="mb-2">
              <strong>Completion Percentage:</strong> 77.8%
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Contingency Available:</strong> {formatCurrency(3900000)}
            </div>
            <div className="mb-2">
              <strong>Change Order Total:</strong> {formatCurrency(864509)}
            </div>
            <div className="mb-2">
              <strong>Budget Variance:</strong> {formatCurrency(3900000)}
            </div>
            <div className="mb-2">
              <strong>Projected Profit:</strong> {formatCurrency(2336015)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
