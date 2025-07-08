"use client"

import React from "react"
import Image from "next/image"

interface FinancialForecastMemoProps {
  projectData?: {
    name: string
    number: string
    type: string
    contractType: string
    damagesClause: string
    nocDate: string
    pm: string
    px: string
    forecastMonth: string
    super: string
    savingsShare: string
    buildRisk: string
  }
}

export function FinancialForecastMemo({ projectData }: FinancialForecastMemoProps) {
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
    damagesClause: "$5,000/day",
    nocDate: "Complete Project Info",
    pm: "HBC Project Manager",
    px: "Complete Project Info",
    forecastMonth: "October 2025",
    super: "Complete Project Info",
    savingsShare: "50.00%",
    buildRisk: "Complete Project Info",
  }

  const data = projectData || mockProjectData

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto font-sans print:p-4 print:max-w-none">
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
                  <strong>Damages Clause:</strong> {data.damagesClause}
                </div>
                <div>
                  <strong>N.O.C. Date:</strong> {data.nocDate}
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
                  <strong>Super:</strong> {data.super}
                </div>
                <div>
                  <strong>Damages Per:</strong> {data.damagesClause}
                </div>
                <div>
                  <strong>Savings Share:</strong> {data.savingsShare}
                </div>
                <div>
                  <strong>Build. Risk:</strong> {data.buildRisk}
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

      {/* General Conditions */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">3. General Conditions Period Ending</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>Original GC/GR Estimate:</strong> $3,672,852.00
            </div>
            <div className="mb-2">
              <strong>Current GC Est. at Compl.:</strong> $2,188,774.10
            </div>
            <div className="mb-2">
              <strong>Variance from Original:</strong> $1,484,077.90
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Prev. Month GC Est. at Compl.:</strong> $-
            </div>
            <div className="mb-2">
              <strong>GC Est. at Compl. MoM Change:</strong> $2,188,774.10
            </div>
          </div>
        </div>
      </div>

      {/* Contingencies */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">4. Contingencies</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <div className="mb-2">
              <strong>Original Contingency:</strong> $700,000.00
            </div>
            <div className="mb-2">
              <strong>Initial Buyout Contingency:</strong> $-
            </div>
            <div className="mb-2">
              <strong>Current Buyout Savings:</strong> $30,005.00
            </div>
            <div className="mb-2">
              <strong>HBC Savings Share:</strong> $15,002.50
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Current Contingency:</strong> $700,000.00
            </div>
            <div className="mb-2">
              <strong>Variance to Original:</strong> $-
            </div>
            <div className="mb-2">
              <strong>Previous Month Contingency:</strong> $-
            </div>
            <div className="mb-2">
              <strong>Contingency MoM Change:</strong> $700,000.00
            </div>
          </div>
        </div>
      </div>

      {/* Financial Change Summary */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">5. FINANCIAL CHANGE SUMMARY:</h2>
        </div>
        <div className="text-sm">
          <p className="mb-4">
            <strong>
              Provide a brief narrative explaining any changes in the project's profit on a month-to-month basis.
            </strong>
            Use this section to clarify factors that contributed to increases or decreases in profit, including
            adjustments in cost estimates, contingencies, revenue projections, or other financial elements.
            Additionally, note any significant events, risks, or decisions that may have impacted the profit forecast.
            Your summary should give context to the reported changes and help stakeholders understand the current
            condition of the project's profit.
          </p>
          <p className="mb-2">Examples of points to include:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Reasons for profit variances (e.g., changes in scope, unexpected costs, value engineering efforts).</li>
            <li>Impacts of external factors, such as market conditions or supply chain disruptions.</li>
            <li>Key decisions made to address profit challenges or capitalize on profit opportunities.</li>
            <li>Any anticipated trends or risks that may affect future profit projections.</li>
          </ul>
        </div>
      </div>

      {/* Page Break Indicator */}
      <div className="border-t-2 border-dashed border-gray-300 my-8 pt-8 print:page-break-before">
        <div className="text-center text-gray-500 text-sm mb-8 print:hidden">--- Page 2 ---</div>
      </div>

      {/* Problems/Exposures Section */}
      <div className="mb-8">
        <div className="bg-gray-100 p-2 mb-4 border border-gray-300">
          <h2 className="font-bold text-lg">6. PROBLEMS / EXPOSURES:</h2>
        </div>

        {/* Schedule */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">a. Schedule:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Provide a brief narrative on the current health of the project's schedule. Include any insights into
              delays, acceleration, or potential risks that may impact the timeline. Describe how these issues could
              lead to financial exposure, such as increased labor costs, penalties, or lost revenue opportunities. Your
              summary should help stakeholders understand the root causes of schedule challenges and any planned actions
              to mitigate their impact.
            </p>
            <p className="mb-2">Examples of points to include:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Status of key milestones or critical path activities.</li>
              <li>
                Delays or disruptions caused by internal or external factors (e.g., weather, resource shortages, or
                design changes).
              </li>
              <li>Any anticipated risks to on-time completion and their financial implications.</li>
              <li>
                Steps taken or planned to address schedule challenges (e.g., recovery plans, additional resources, or
                scope adjustments).
              </li>
            </ul>
          </div>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">b. Budget:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Provide a narrative on the current health of the project's budget. Include details about any challenges
              related to buyout, general conditions, or other known or anticipated issues that could impact the
              financial position of the project and any risks or opportunities affecting budget performance.
            </p>
            <p className="mb-2">Examples of points to include:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Status of buyout and any variances from original estimates.</li>
              <li>Unforeseen costs or changes to general conditions.</li>
              <li>Adjustments to contingency, allowances, or other budgetary reserves.</li>
              <li>
                Known or potential risks (e.g., market conditions, subcontractor disputes, or material price
                escalations).
              </li>
              <li>Actions being taken to address budgetary challenges or maintain financial health.</li>
            </ul>
          </div>
        </div>

        {/* Payments */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">c. Payments:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Provide a brief narrative regarding the status of Owner Payment Applications and PCCOs. Include details
              about the progress, any delays, or challenges related to approvals, processing, or payment collection.
              Your commentary should clarify the current financial position in terms of payments and highlight any
              potential risks or impacts on cash flow.
            </p>
            <p className="mb-2">Examples of points to include:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Status of submitted Owner Payment Applications (e.g., pending approvals, partially paid applications).
              </li>
              <li>Delays or disputes in processing PCCOs.</li>
              <li>Any issues related to payment timing or deviations from the contract terms.</li>
              <li>Anticipated risks or delays in future payment applications.</li>
              <li>Steps being taken to expedite payment resolution or address challenges.</li>
            </ul>
          </div>
        </div>

        {/* Safety */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">d. Safety:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Highlight any realized or potential safety issues that could significantly impact the project. Include
              details about incidents, risks, or concerns that may affect progress, costs, or compliance.
            </p>
          </div>
        </div>

        {/* Requests for Information */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">e. Requests for Information:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Identify any RFI-related items that could create exposure or hinder project progress. Highlight delays,
              unresolved issues, or critical impacts tied to RFIs.
            </p>
          </div>
        </div>

        {/* Submittals */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">f. Submittals:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Identify any Submittal-related items that could create exposure or hinder project progress. Highlight
              delays, unresolved issues, or critical impacts tied to Submittals.
            </p>
          </div>
        </div>

        {/* Risk Management */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">g. Risk Management:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Detail any preventative actions being taken to mitigate project risks. Include information on additional
              insurance policies needed or acquired, as well as other measures implemented to manage and reduce
              exposure.
            </p>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 mb-2 border border-gray-200">
            <h3 className="font-semibold">h. Critical Issues:</h3>
          </div>
          <div className="text-sm">
            <p className="mb-2">
              Capture any additional potential risks or exposures not covered in the previous sections. Use this space
              to highlight concerns or issues that could impact the project's success.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
