"use client"

import React from "react"
import { PresentationSlide } from "./PresentationCarousel"
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  Shield,
  TrendingUp,
  CheckCircle,
  Clock,
  UserCheck,
  Building2,
} from "lucide-react"

export const hrSlides: PresentationSlide[] = [
  {
    id: "hr-overview",
    title: "HR & Payroll in Our Control",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 text-center px-2 sm:px-4">
          Centralized{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            HR & Payroll Management
          </span>{" "}
          that puts you in complete control of your workforce operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl w-full mx-auto px-2 sm:px-4">
          <div className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]">
            <div className="flex justify-center mb-2">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Employee Management
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <li>• Complete employee profiles</li>
              <li>• Performance tracking</li>
              <li>• Training & development</li>
              <li>• Compliance monitoring</li>
            </ul>
          </div>

          <div className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]">
            <div className="flex justify-center mb-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Payroll Processing
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <li>• Automated calculations</li>
              <li>• Tax compliance</li>
              <li>• Benefits management</li>
              <li>• Time tracking</li>
            </ul>
          </div>

          <div className="flex flex-col justify-start text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 min-h-[200px] sm:min-h-[240px] md:min-h-[260px]">
            <div className="flex justify-center mb-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "rgb(250, 70, 22)" }} />
            </div>
            <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3" style={{ color: "rgb(250, 70, 22)" }}>
              Compliance & Security
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
              <li>• Regulatory compliance</li>
              <li>• Data security</li>
              <li>• Audit trails</li>
              <li>• Risk management</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "hr-benefits",
    title: "Key Benefits",
    content: (
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 text-center px-2 sm:px-4">
          Streamlined HR operations that{" "}
          <span style={{ color: "rgb(250, 70, 22)" }} className="font-semibold">
            reduce complexity
          </span>{" "}
          and increase efficiency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Centralized Control</h3>
            </div>
            <p className="text-sm text-blue-100">
              All HR functions in one platform - from recruitment to retirement, with complete visibility and control.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Operational Efficiency</h3>
            </div>
            <p className="text-sm text-blue-100">
              Automated processes reduce manual work by 60% while improving accuracy and compliance.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <UserCheck className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Employee Experience</h3>
            </div>
            <p className="text-sm text-blue-100">
              Self-service portals and mobile access improve employee satisfaction and reduce HR workload.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Strategic Insights</h3>
            </div>
            <p className="text-sm text-blue-100">
              Advanced analytics provide workforce insights for better decision-making and planning.
            </p>
          </div>
        </div>
      </div>
    ),
  },
]
