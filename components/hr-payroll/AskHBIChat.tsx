"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface MockConversation {
  id: string
  title: string
  messages: ChatMessage[]
  icon: React.ReactNode
  color: string
}

const AskHBIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock conversations for HR & Payroll
  const mockConversations: MockConversation[] = [
    {
      id: "job-description",
      title: "Generate a Site Superintendent job description",
      messages: [
        {
          id: "1",
          type: "user",
          content: "Generate a Site Superintendent job description",
          timestamp: new Date(Date.now() - 300000),
        },
        {
          id: "2",
          type: "assistant",
          content:
            "Here's a comprehensive Site Superintendent job description:\n\n**Position:** Site Superintendent\n**Department:** Field Operations\n**Reports to:** Project Manager\n\n**Key Responsibilities:**\n• Oversee daily construction activities and ensure project timeline adherence\n• Manage on-site personnel, subcontractors, and safety protocols\n• Coordinate with project managers, architects, and engineers\n• Monitor quality control and compliance with building codes\n• Maintain daily logs, progress reports, and documentation\n• Conduct safety meetings and toolbox talks\n• Manage material deliveries and equipment coordination\n\n**Requirements:**\n• 5+ years construction supervision experience\n• OSHA 30 certification required\n• Strong leadership and communication skills\n• Knowledge of construction methods and safety regulations\n• Ability to read blueprints and technical drawings\n\n**Physical Requirements:**\n• Ability to work outdoors in various weather conditions\n• Must be able to climb ladders and walk on uneven surfaces\n• Valid driver's license required",
          timestamp: new Date(Date.now() - 240000),
        },
      ],
      icon: <FileText className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      id: "osha-compliance",
      title: "Who hasn't completed OSHA 10?",
      messages: [
        {
          id: "3",
          type: "user",
          content: "Who hasn't completed OSHA 10?",
          timestamp: new Date(Date.now() - 600000),
        },
        {
          id: "4",
          type: "assistant",
          content:
            "**OSHA 10 Certification Status Report**\n\n**Employees Missing OSHA 10 Certification:**\n\n1. **Michael Chen** - Estimator (Expired: 2024-03-15)\n2. **Sarah Johnson** - Project Manager (Expired: 2024-05-22)\n3. **David Rodriguez** - Field Engineer (Never completed)\n4. **Lisa Thompson** - Safety Coordinator (Expired: 2024-06-10)\n5. **James Wilson** - Site Superintendent (Expired: 2024-04-18)\n\n**Total:** 5 employees require immediate attention\n\n**Recommendations:**\n• Schedule OSHA 10 training sessions\n• Set up automatic renewal reminders\n• Consider OSHA 30 for supervisory roles\n• Implement compliance tracking system",
          timestamp: new Date(Date.now() - 540000),
        },
      ],
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-red-500",
    },
    {
      id: "payroll-forecast",
      title: "Forecast OT payroll for next month",
      messages: [
        {
          id: "5",
          type: "user",
          content: "Forecast OT payroll for next month",
          timestamp: new Date(Date.now() - 900000),
        },
        {
          id: "6",
          type: "assistant",
          content:
            "**Overtime Payroll Forecast - Next Month**\n\n**Projected OT Hours:** 1,247 hours\n**Estimated OT Cost:** $89,384\n\n**Breakdown by Department:**\n• **Field Operations:** $52,450 (735 hours)\n• **Project Management:** $18,900 (135 hours)\n• **Estimating:** $8,400 (60 hours)\n• **Safety:** $5,600 (40 hours)\n• **Quality Control:** $4,034 (277 hours)\n\n**Key Factors:**\n• 3 major projects entering critical phases\n• Weather delays from previous month\n• Holiday season impact (Thanksgiving)\n• New safety protocols requiring additional training\n\n**Recommendations:**\n• Consider temporary staffing for peak periods\n• Review project schedules for optimization\n• Monitor weather forecasts for planning\n• Implement overtime approval workflow",
          timestamp: new Date(Date.now() - 840000),
        },
      ],
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      id: "turnover-rate",
      title: "What's the turnover rate in the past year?",
      messages: [
        {
          id: "7",
          type: "user",
          content: "What's the turnover rate in the past year?",
          timestamp: new Date(Date.now() - 1200000),
        },
        {
          id: "8",
          type: "assistant",
          content:
            "**Annual Turnover Rate Analysis**\n\n**Overall Turnover Rate:** 12.3%\n**Industry Average:** 15.2%\n\n**Breakdown by Department:**\n• **Field Operations:** 8.7% (Below average)\n• **Project Management:** 14.2% (Average)\n• **Estimating:** 18.5% (Above average)\n• **Safety:** 6.3% (Excellent retention)\n• **Quality Control:** 11.8% (Average)\n• **Administrative:** 16.9% (Above average)\n\n**Key Insights:**\n• **Voluntary Separations:** 78% of total turnover\n• **Involuntary Separations:** 22% of total turnover\n• **Peak Departure Months:** March, September\n• **Average Tenure:** 4.2 years\n\n**Top Reasons for Departure:**\n1. Career advancement opportunities (35%)\n2. Relocation (28%)\n3. Retirement (18%)\n4. Performance issues (12%)\n5. Personal reasons (7%)\n\n**Recommendations:**\n• Implement retention programs for estimating team\n• Review compensation packages\n• Enhance career development opportunities\n• Conduct exit interviews for better insights",
          timestamp: new Date(Date.now() - 1140000),
        },
      ],
      icon: <Users className="h-4 w-4" />,
      color: "bg-purple-500",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm here to help with your HR & Payroll questions! I can assist with job descriptions, compliance tracking, payroll forecasting, turnover analysis, and much more. What would you like to know?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const loadMockConversation = (conversation: MockConversation) => {
    setMessages(conversation.messages)
    setIsOpen(true)
  }

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative h-[600px] w-[400px] rounded-lg border bg-background shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Ask HBI</h3>
                  <p className="text-xs text-muted-foreground">HR & Payroll Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="border-b p-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {mockConversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="outline"
                    size="sm"
                    onClick={() => loadMockConversation(conversation)}
                    className="h-auto p-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${conversation.color} text-white`}
                      >
                        {conversation.icon}
                      </div>
                      <span className="text-xs">{conversation.title}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Ask me anything about HR & Payroll!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] items-start gap-2 ${
                          message.type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.type === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                          <Bot className="h-3 w-3" />
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.1s]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about HR & Payroll..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AskHBIChat
