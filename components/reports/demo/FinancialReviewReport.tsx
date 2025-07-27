"use client"

import React from "react"
import Image from "next/image"

interface FinancialReviewReportProps {
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

export function FinancialReviewReport({ projectData }: FinancialReviewReportProps) {
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

  // Mock budget data for Budget Snapshot
  const budgetData = [
    { category: "General Conditions", budgeted: 8500000, actual: 7200000, committed: 7800000, forecast: 8100000 },
    { category: "Main Construction", budgeted: 32500000, actual: 28200000, committed: 30800000, forecast: 31200000 },
    { category: "Materials", budgeted: 12800000, actual: 10950000, committed: 12100000, forecast: 12400000 },
    { category: "Labor", budgeted: 18500000, actual: 15800000, committed: 17200000, forecast: 17500000 },
    { category: "Equipment", budgeted: 4200000, actual: 3800000, committed: 4000000, forecast: 4100000 },
    { category: "Subcontractors", budgeted: 28500000, actual: 24500000, committed: 26800000, forecast: 27200000 },
  ]

  // Mock JCHR data
  const jchrData = [
    { division: "02 - Existing Conditions", budget: 125000, actual: 118500, committed: 122000, forecast: 125000 },
    { division: "03 - Concrete", budget: 2850000, actual: 2720000, committed: 2780000, forecast: 2820000 },
    { division: "04 - Masonry", budget: 1850000, actual: 1680000, committed: 1720000, forecast: 1750000 },
    { division: "05 - Metals", budget: 3200000, actual: 2950000, committed: 3020000, forecast: 3080000 },
    { division: "06 - Wood & Plastics", budget: 850000, actual: 780000, committed: 800000, forecast: 820000 },
    { division: "07 - Thermal & Moisture", budget: 2100000, actual: 1950000, committed: 1980000, forecast: 2020000 },
    { division: "08 - Doors & Windows", budget: 1650000, actual: 1520000, committed: 1550000, forecast: 1580000 },
    { division: "09 - Finishes", budget: 3200000, actual: 2850000, committed: 2920000, forecast: 2980000 },
  ]

  // Mock GC & GR data
  const gcGrData = [
    {
      category: "General Conditions",
      originalBudget: 8500000,
      currentBudget: 8500000,
      actualToDate: 7200000,
      committedToDate: 7800000,
      forecastToComplete: 8100000,
    },
    {
      category: "Project Management",
      originalBudget: 3200000,
      currentBudget: 3200000,
      actualToDate: 2850000,
      committedToDate: 2950000,
      forecastToComplete: 3000000,
    },
    {
      category: "Supervision",
      originalBudget: 2800000,
      currentBudget: 2800000,
      actualToDate: 2450000,
      committedToDate: 2520000,
      forecastToComplete: 2580000,
    },
    {
      category: "Safety & Security",
      originalBudget: 1200000,
      currentBudget: 1200000,
      actualToDate: 1080000,
      committedToDate: 1120000,
      forecastToComplete: 1150000,
    },
    {
      category: "Quality Control",
      originalBudget: 950000,
      currentBudget: 950000,
      actualToDate: 820000,
      committedToDate: 850000,
      forecastToComplete: 880000,
    },
    {
      category: "Documentation",
      originalBudget: 650000,
      currentBudget: 650000,
      actualToDate: 580000,
      committedToDate: 600000,
      forecastToComplete: 620000,
    },
  ]

  // Mock Draw Forecast data
  const drawForecastData = [
    { month: "October 2024", scheduled: 2850000, actual: 2720000, variance: 130000, completion: 95 },
    { month: "November 2024", scheduled: 3200000, actual: 2950000, variance: 250000, completion: 92 },
    { month: "December 2024", scheduled: 2800000, actual: 2650000, variance: 150000, completion: 95 },
    { month: "January 2025", scheduled: 3100000, actual: 2850000, variance: 250000, completion: 92 },
    { month: "February 2025", scheduled: 2950000, actual: 2720000, variance: 230000, completion: 92 },
    { month: "March 2025", scheduled: 3250000, actual: 2980000, variance: 270000, completion: 92 },
    { month: "April 2025", scheduled: 3400000, actual: 3120000, variance: 280000, completion: 92 },
    { month: "May 2025", scheduled: 3600000, actual: 3320000, variance: 280000, completion: 92 },
  ]

  return (
    <div className="bg-white text-black font-sans print:p-0 print:max-w-none">
      {/* Page 1: Financial Forecast Memo */}
      <div className="p-8 max-w-4xl mx-auto print:max-w-none print:p-4 print:page-break-after-always">
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
            <h1 className="text-xl font-bold text-[#FF6B35]">FINANCIAL FORECAST</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{currentDate}</p>
          </div>
        </div>

        {/* Project Information Header */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Project Name:</strong> {data.name}
                  </div>
                  <div>
                    <strong>Project Number:</strong> {data.number}
                  </div>
                  <div>
                    <strong>Project Type:</strong> {data.type}
                  </div>
                  <div>
                    <strong>Contract Type:</strong> {data.contractType}
                  </div>
                  <div>
                    <strong>Damages Clause:</strong> $5,000/day
                  </div>
                  <div>
                    <strong>N.O.C. Date:</strong> Complete Project Info
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>PM:</strong> {data.pm}
                  </div>
                  <div>
                    <strong>Forecast Month:</strong> {data.forecastMonth}
                  </div>
                  <div>
                    <strong>PX:</strong> {data.px}
                  </div>
                  <div>
                    <strong>Super:</strong> Complete Project Info
                  </div>
                  <div>
                    <strong>Damages Per:</strong> $5,000/day
                  </div>
                  <div>
                    <strong>Savings Share:</strong> 50.00%
                  </div>
                  <div>
                    <strong>Build. Risk:</strong> Complete Project Info
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">1. Schedule</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="mb-2">
                <strong>Original Completion Date:</strong> 5/1/26
              </div>
              <div className="mb-2">
                <strong>Approved Extensions:</strong> Complete 'Project Info'
              </div>
              <div className="mb-2">
                <strong>Approved Completion Date:</strong> 6/25/26
              </div>
              <div className="mb-2">
                <strong>Damages Realized to Date:</strong> $-
              </div>
            </div>
            <div>
              <div className="mb-2">
                <strong>Schedule Data Date:</strong> 12/20/24
              </div>
              <div className="mb-2">
                <strong>Current Planned Completion:</strong> 5/8/26
              </div>
              <div className="mb-2">
                <strong>Variance to Appr. Completion:</strong> 48 Days Ahead
              </div>
              <div className="mb-2">
                <strong>Total Damages Forecasted:</strong> $-
              </div>
            </div>
          </div>
        </div>

        {/* Financial Status */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">2. Financial Status</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="mb-2">
                <strong>Original Contract Value:</strong> $57,235,491.00
              </div>
              <div className="mb-2">
                <strong>Value of Approved PCCOs:</strong> $-
              </div>
              <div className="mb-2">
                <strong>Current Approved Value:</strong> $57,235,491.00
              </div>
              <div className="mb-2">
                <strong>Original Cost:</strong>
              </div>
              <div className="mb-2">
                <strong>Current Cost to Complete:</strong>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <strong>Original Profit:</strong> $2,321,013.00
              </div>
              <div className="mb-2">
                <strong>Current Profit:</strong> $2,321,013.00
              </div>
              <div className="mb-2">
                <strong>Potential Total Profit:</strong> $2,336,015.50
              </div>
              <div className="mb-2">
                <strong>Prev. Month Potential Profit:</strong> $2,336,015.50
              </div>
              <div className="mb-2">
                <strong>Potential Profit MoM Change:</strong> $-
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Budget Snapshot */}
      <div className="p-8 max-w-6xl mx-auto print:max-w-none print:p-4 print:page-break-after-always">
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

        {/* Budget Summary Grid */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">Budget Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold">Category</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Budgeted</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Actual</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Committed</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Forecast</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-2 font-medium">{item.category}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.budgeted)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.actual)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.committed)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.forecast)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 p-2">TOTAL</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(budgetData.reduce((sum, item) => sum + item.budgeted, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(budgetData.reduce((sum, item) => sum + item.actual, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(budgetData.reduce((sum, item) => sum + item.committed, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(budgetData.reduce((sum, item) => sum + item.forecast, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
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

      {/* Page 3: JCHR */}
      <div className="p-8 max-w-6xl mx-auto print:max-w-none print:p-4 print:page-break-after-always">
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

        {/* JCHR Summary Grid */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">Job Cost History Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold">Division</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Budget</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Actual</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Committed</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Forecast</th>
                </tr>
              </thead>
              <tbody>
                {jchrData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-2 font-medium">{item.division}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.budget)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.actual)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.committed)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.forecast)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 p-2">TOTAL</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(jchrData.reduce((sum, item) => sum + item.budget, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(jchrData.reduce((sum, item) => sum + item.actual, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(jchrData.reduce((sum, item) => sum + item.committed, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(jchrData.reduce((sum, item) => sum + item.forecast, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
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
                <strong>Total Variance:</strong>{" "}
                {formatCurrency(jchrData.reduce((sum, item) => sum + (item.forecast - item.budget), 0))}
              </div>
              <div className="mb-2">
                <strong>Variance Percentage:</strong>{" "}
                {formatPercent(
                  (jchrData.reduce((sum, item) => sum + (item.forecast - item.budget), 0) /
                    jchrData.reduce((sum, item) => sum + item.budget, 0)) *
                    100
                )}
              </div>
              <div className="mb-2">
                <strong>Forecast at Completion:</strong>{" "}
                {formatCurrency(jchrData.reduce((sum, item) => sum + item.forecast, 0))}
              </div>
              <div className="mb-2">
                <strong>Projected Profit:</strong> {formatCurrency(2336015)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 4: GC & GR Forecast */}
      <div className="p-8 max-w-6xl mx-auto print:max-w-none print:p-4 print:page-break-after-always">
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

        {/* GC & GR Summary Grid */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">General Conditions & General Requirements Forecast</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold">Category</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Original Budget</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Current Budget</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Actual To Date</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Committed To Date</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Forecast To Complete</th>
                </tr>
              </thead>
              <tbody>
                {gcGrData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-2 font-medium">{item.category}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.originalBudget)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.currentBudget)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.actualToDate)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.committedToDate)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.forecastToComplete)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 p-2">TOTAL</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(gcGrData.reduce((sum, item) => sum + item.originalBudget, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(gcGrData.reduce((sum, item) => sum + item.currentBudget, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(gcGrData.reduce((sum, item) => sum + item.actualToDate, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(gcGrData.reduce((sum, item) => sum + item.committedToDate, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(gcGrData.reduce((sum, item) => sum + item.forecastToComplete, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
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
                <strong>Total Variance:</strong>{" "}
                {formatCurrency(
                  gcGrData.reduce((sum, item) => sum + (item.forecastToComplete - item.originalBudget), 0)
                )}
              </div>
              <div className="mb-2">
                <strong>Variance Percentage:</strong>{" "}
                {formatPercent(
                  (gcGrData.reduce((sum, item) => sum + (item.forecastToComplete - item.originalBudget), 0) /
                    gcGrData.reduce((sum, item) => sum + item.originalBudget, 0)) *
                    100
                )}
              </div>
              <div className="mb-2">
                <strong>Forecast at Completion:</strong>{" "}
                {formatCurrency(gcGrData.reduce((sum, item) => sum + item.forecastToComplete, 0))}
              </div>
              <div className="mb-2">
                <strong>Projected Profit:</strong> {formatCurrency(2336015)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 5: Draw Forecast */}
      <div className="p-8 max-w-6xl mx-auto print:max-w-none print:p-4">
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
            <h1 className="text-xl font-bold text-[#FF6B35]">DRAW FORECAST</h1>
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

        {/* Draw Schedule Summary Grid */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">Draw Schedule Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold">Month</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Scheduled</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Actual</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Variance</th>
                  <th className="border border-gray-300 p-2 text-right font-bold">Completion</th>
                </tr>
              </thead>
              <tbody>
                {drawForecastData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-2 font-medium">{item.month}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.scheduled)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.actual)}</td>
                    <td
                      className={`border border-gray-300 p-2 text-right ${
                        item.variance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(item.variance)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">{formatPercent(item.completion)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 p-2">TOTAL</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.scheduled, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.actual, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.variance, 0))}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatPercent(
                      drawForecastData.reduce((sum, item) => sum + item.completion, 0) / drawForecastData.length
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="mb-8">
          <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
            <h2 className="font-bold text-lg">Cash Flow Analysis</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="mb-2">
                <strong>Total Scheduled Draws:</strong>{" "}
                {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.scheduled, 0))}
              </div>
              <div className="mb-2">
                <strong>Total Actual Draws:</strong>{" "}
                {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.actual, 0))}
              </div>
              <div className="mb-2">
                <strong>Average Monthly Draw:</strong>{" "}
                {formatCurrency(
                  drawForecastData.reduce((sum, item) => sum + item.scheduled, 0) / drawForecastData.length
                )}
              </div>
              <div className="mb-2">
                <strong>Cash Flow Variance:</strong>{" "}
                {formatCurrency(drawForecastData.reduce((sum, item) => sum + item.variance, 0))}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <strong>Overall Completion:</strong> 92.3%
              </div>
              <div className="mb-2">
                <strong>Cash Flow Performance:</strong> 94.2%
              </div>
              <div className="mb-2">
                <strong>Projected Completion:</strong> May 2025
              </div>
              <div className="mb-2">
                <strong>Remaining Draws:</strong> {formatCurrency(8500000)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
