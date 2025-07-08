"use client"

import React from "react"
import Image from "next/image"

interface DrawForecastProps {
  projectData?: {
    name: string
    number: string
    contractValue: string
    forecastMonth: string
  }
}

export function DrawForecast({ projectData }: DrawForecastProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const mockProjectData = {
    name: "Demo Construction Project",
    number: "HBC-2024-001",
    contractValue: "$57,235,491.00",
    forecastMonth: "October 2025",
  }

  const data = projectData || mockProjectData

  // Mock draw schedule data
  const drawSchedule = [
    {
      month: "Jan 2025",
      budgetedAmount: "$2,500,000",
      actualAmount: "$2,450,000",
      variance: "$50,000",
      cumulativeBudget: "$2,500,000",
      cumulativeActual: "$2,450,000",
    },
    {
      month: "Feb 2025",
      budgetedAmount: "$3,200,000",
      actualAmount: "$3,150,000",
      variance: "$50,000",
      cumulativeBudget: "$5,700,000",
      cumulativeActual: "$5,600,000",
    },
    {
      month: "Mar 2025",
      budgetedAmount: "$4,100,000",
      actualAmount: "$4,200,000",
      variance: "-$100,000",
      cumulativeBudget: "$9,800,000",
      cumulativeActual: "$9,800,000",
    },
    {
      month: "Apr 2025",
      budgetedAmount: "$4,800,000",
      actualAmount: "$4,750,000",
      variance: "$50,000",
      cumulativeBudget: "$14,600,000",
      cumulativeActual: "$14,550,000",
    },
    {
      month: "May 2025",
      budgetedAmount: "$5,200,000",
      actualAmount: "$5,300,000",
      variance: "-$100,000",
      cumulativeBudget: "$19,800,000",
      cumulativeActual: "$19,850,000",
    },
    {
      month: "Jun 2025",
      budgetedAmount: "$5,800,000",
      actualAmount: "$5,750,000",
      variance: "$50,000",
      cumulativeBudget: "$25,600,000",
      cumulativeActual: "$25,600,000",
    },
    {
      month: "Jul 2025",
      budgetedAmount: "$6,200,000",
      actualAmount: "$6,100,000",
      variance: "$100,000",
      cumulativeBudget: "$31,800,000",
      cumulativeActual: "$31,700,000",
    },
    {
      month: "Aug 2025",
      budgetedAmount: "$6,800,000",
      actualAmount: "$6,900,000",
      variance: "-$100,000",
      cumulativeBudget: "$38,600,000",
      cumulativeActual: "$38,600,000",
    },
    {
      month: "Sep 2025",
      budgetedAmount: "$7,200,000",
      actualAmount: "$7,150,000",
      variance: "$50,000",
      cumulativeBudget: "$45,800,000",
      cumulativeActual: "$45,750,000",
    },
    {
      month: "Oct 2025",
      budgetedAmount: "$7,800,000",
      actualAmount: "$7,900,000",
      variance: "-$100,000",
      cumulativeBudget: "$53,600,000",
      cumulativeActual: "$53,650,000",
    },
    {
      month: "Nov 2025",
      budgetedAmount: "$2,200,000",
      actualAmount: "$2,150,000",
      variance: "$50,000",
      cumulativeBudget: "$55,800,000",
      cumulativeActual: "$55,800,000",
    },
    {
      month: "Dec 2025",
      budgetedAmount: "$1,435,491",
      actualAmount: "$1,435,491",
      variance: "$0",
      cumulativeBudget: "$57,235,491",
      cumulativeActual: "$57,235,491",
    },
  ]

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
          <h1 className="text-xl font-bold text-[#FF6B35]">DRAW FORECAST</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{currentDate}</p>
        </div>
      </div>

      {/* Project Information Header */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Project Name:</strong> {data.name}
          </div>
          <div>
            <strong>Project Number:</strong> {data.number}
          </div>
          <div>
            <strong>Contract Value:</strong> {data.contractValue}
          </div>
          <div>
            <strong>Forecast Month:</strong> {data.forecastMonth}
          </div>
        </div>
      </div>

      {/* Draw Schedule Summary */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">1. Draw Schedule Summary</h2>
        </div>
        <div className="grid grid-cols-3 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>Total Contract Value:</strong> $57,235,491.00
            </div>
            <div className="mb-2">
              <strong>Total Draws to Date:</strong> $45,750,000.00
            </div>
            <div className="mb-2">
              <strong>Percentage Complete:</strong> 79.9%
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Remaining Contract Value:</strong> $11,485,491.00
            </div>
            <div className="mb-2">
              <strong>Projected Completion:</strong> December 2025
            </div>
            <div className="mb-2">
              <strong>Next Draw Amount:</strong> $7,900,000.00
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Average Monthly Draw:</strong> $5,225,000.00
            </div>
            <div className="mb-2">
              <strong>Variance to Budget:</strong> -$150,000.00
            </div>
            <div className="mb-2">
              <strong>Cash Flow Status:</strong> On Track
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Draw Schedule Table */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">2. Monthly Draw Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Month</th>
                <th className="border border-gray-300 p-2 text-right">Budgeted Amount</th>
                <th className="border border-gray-300 p-2 text-right">Actual/Forecast</th>
                <th className="border border-gray-300 p-2 text-right">Variance</th>
                <th className="border border-gray-300 p-2 text-right">Cumulative Budget</th>
                <th className="border border-gray-300 p-2 text-right">Cumulative Actual</th>
              </tr>
            </thead>
            <tbody>
              {drawSchedule.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 p-2 font-medium">{row.month}</td>
                  <td className="border border-gray-300 p-2 text-right">{row.budgetedAmount}</td>
                  <td className="border border-gray-300 p-2 text-right">{row.actualAmount}</td>
                  <td
                    className={`border border-gray-300 p-2 text-right ${
                      row.variance.includes("-") ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {row.variance}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">{row.cumulativeBudget}</td>
                  <td className="border border-gray-300 p-2 text-right">{row.cumulativeActual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Analysis */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">3. Cash Flow Analysis</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Monthly Cash Flow Trends:</h3>
              <ul className="space-y-1 ml-4">
                <li>• Peak draw periods: May-October 2025</li>
                <li>• Seasonal adjustments for weather delays</li>
                <li>• Material procurement impact on timing</li>
                <li>• Labor resource allocation effects</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Risk Factors:</h3>
              <ul className="space-y-1 ml-4">
                <li>• Supply chain disruptions</li>
                <li>• Weather-related delays</li>
                <li>• Permit approval timing</li>
                <li>• Change order impacts</li>
              </ul>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Key Milestones:</h3>
              <ul className="space-y-1 ml-4">
                <li>• Foundation completion: March 2025</li>
                <li>• Structural steel: June 2025</li>
                <li>• Mechanical/Electrical rough-in: September 2025</li>
                <li>• Final inspections: November 2025</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Optimization Opportunities:</h3>
              <ul className="space-y-1 ml-4">
                <li>• Early material procurement discounts</li>
                <li>• Subcontractor incentive programs</li>
                <li>• Equipment rental optimization</li>
                <li>• Bulk purchasing arrangements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Adjustments */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">4. Forecast Adjustments & Assumptions</h2>
        </div>
        <div className="text-sm">
          <p className="mb-4">
            <strong>Key Assumptions for Draw Forecast:</strong>
          </p>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>Normal weather conditions with standard seasonal adjustments</li>
            <li>No major design changes or scope modifications</li>
            <li>Subcontractor performance within contracted timelines</li>
            <li>Material availability and pricing remain stable</li>
            <li>No significant permit or inspection delays</li>
          </ul>

          <p className="mb-4">
            <strong>Recent Adjustments Made:</strong>
          </p>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>Accelerated electrical rough-in schedule (+$100K in August)</li>
            <li>Delayed concrete pour due to weather (-$100K in March)</li>
            <li>Early material procurement for steel structure (+$50K in February)</li>
          </ul>

          <p className="mb-4">
            <strong>Contingency Planning:</strong>
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>10% contingency buffer maintained throughout project</li>
            <li>Alternative supplier arrangements for critical materials</li>
            <li>Backup subcontractor agreements in place</li>
            <li>Weekly cash flow monitoring and adjustment protocols</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
