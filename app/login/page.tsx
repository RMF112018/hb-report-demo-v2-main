"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingWrapper } from "@/components/ui/loading-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  ChevronDown,
  Monitor,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { PresentationCarousel } from "@/components/presentation/PresentationCarousel"
import { slides } from "@/components/presentation/slide-definitions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const [presentationMode, setPresentationMode] = useState(false)
  const { login, isLoading: authIsLoading, isClient } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { startTour, isTourAvailable, resetTourState } = useTour()

  // Clear presentation mode and Intel tour trigger on page load for clean start
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("presentationMode")
      localStorage.removeItem("triggerIntelTour")
      // Uncomment the line below to reset the Intel tour for testing
      // localStorage.removeItem("intelTourCompleted")
    }
  }, [])

  // Check for showPresentation query parameter to trigger presentation carousel
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const showPresentation = urlParams.get("showPresentation")

      if (showPresentation === "true") {
        console.log("🎠 DISABLED: Presentation carousel trigger from query parameter")
        // DISABLED: Automatic presentation mode trigger
        // localStorage.setItem("presentationMode", "true")
        // setPresentationMode(true)

        // Clean up the URL parameter
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
      }
    }
  }, [])

  // Show loading screen during SSR/hydration
  if (!isClient || authIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track project performance with live dashboards and comprehensive insights",
      highlight: "20% faster decisions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly coordinate across all project stakeholders and teams",
      highlight: "30% better communication",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSO integration and full compliance",
      highlight: "SOC 2 Type II certified",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Zap,
      title: "Automated Reporting",
      description: "Generate comprehensive reports and insights with a single click",
      highlight: "Save 5+ hours weekly",
      color: "from-orange-500 to-red-500",
    },
  ]

  const benefits = [
    "Reduce project delays by 5-10%",
    "Increase team productivity by 20-30%",
    "Real-time project visibility",
    "Automated compliance tracking",
    "Integrated cost management",
    "Advanced risk analytics",
  ]

  const demoAccounts = [
    {
      key: "presentation",
      label: "Presentation",
      email: "demo.presenter@hedrickbrothers.com",
      icon: Monitor,
      redirectTo: "/main-app",
    },
    {
      key: "executive",
      label: "Executive",
      email: "john.smith@hedrickbrothers.com",
      icon: Monitor,
      redirectTo: "/main-app",
    },
    {
      key: "project-executive",
      label: "Project Executive",
      email: "sarah.johnson@hedrickbrothers.com",
      icon: Users,
      redirectTo: "/main-app",
    },
    {
      key: "project-manager",
      label: "Project Manager",
      email: "mike.davis@hedrickbrothers.com",
      icon: BarChart3,
      redirectTo: "/main-app",
    },
    {
      key: "estimator",
      label: "Estimator",
      email: "john.doe@hedrickbrothers.com",
      icon: Zap,
      redirectTo: "/main-app",
    },
    {
      key: "admin",
      label: "IT Administrator",
      email: "markey.mark@hedrickbrothers.com",
      icon: Shield,
      redirectTo: "/main-app",
    },
    {
      key: "hr-payroll",
      label: "HR & Payroll Manager",
      email: "lisa.rodriguez@hedrickbrothers.com",
      icon: UserCheck,
      redirectTo: "/main-app",
    },
  ]

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    if (typeof window !== "undefined") {
      handleResize() // Initial size
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  // Auto-start tour and welcome message for new visitors
  useEffect(() => {
    if (typeof window !== "undefined" && isTourAvailable && isClient) {
      try {
        // Check if user has disabled tours permanently
        const hasDisabledTours = localStorage.getItem("hb-tour-available") === "false"

        if (hasDisabledTours) {
          console.log("Tours disabled by user preference")
          return
        }

        // Session-based tracking to ensure one-time display
        const hasShownWelcome = sessionStorage.getItem("hb-welcome-shown")
        const hasShownTour = sessionStorage.getItem("hb-tour-shown-login-demo-accounts")

        console.log("Tour auto-start check:", {
          isTourAvailable,
          hasShownWelcome,
          hasShownTour,
          hasDisabledTours,
        })

        // Show welcome toast once per session
        if (!hasShownWelcome) {
          setTimeout(() => {
            toast({
              title: "Welcome to HB Report Demo! 👋",
              description: "Interactive tours are available to help you explore the platform.",
              duration: 6000,
            })
            sessionStorage.setItem("hb-welcome-shown", "true")
          }, 1000)
        }

        // Auto-start login tour once per session
        if (!hasShownTour) {
          setTimeout(() => {
            console.log("Auto-starting login tour...")
            startTour("login-demo-accounts", true) // true indicates auto-start
          }, 3000)
        }
      } catch (error) {
        console.error("Error with storage access:", error)
      }
    }
  }, [isTourAvailable, startTour, toast, isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      const { redirectTo } = await login(email, password)

      // Check if this is a presentation user and trigger Intel tour
      const demoUsers = [
        { email: "demo.presenter@hedrickbrothers.com", role: "presentation" },
        { email: "john.smith@hedrickbrothers.com", role: "executive" },
        { email: "sarah.johnson@hedrickbrothers.com", role: "project-executive" },
        { email: "mike.davis@hedrickbrothers.com", role: "project-manager" },
        { email: "john.doe@hedrickbrothers.com", role: "estimator" },
        { email: "markey.mark@hedrickbrothers.com", role: "admin" },
        { email: "lisa.rodriguez@hedrickbrothers.com", role: "hr-payroll" },
      ]

      const loggedInUser = demoUsers.find((u) => u.email === email)
      if (loggedInUser?.role === "presentation") {
        // DISABLED: Automatic Intel tour trigger
        // localStorage.setItem("triggerIntelTour", Date.now().toString())
        // localStorage.removeItem("intelTourCompleted")
        console.log("🎬 Login: Intel Tour flags disabled for presentation user")
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to HB Report Platform.",
      })
      router.push(redirectTo)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials. Please check your email and password."
      setLoginError(errorMessage)
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true)
    toast({
      title: "SSO Authentication",
      description: `Redirecting to ${provider} login portal...`,
    })

    setTimeout(() => {
      setIsLoading(false)
      router.push("/main-app") // Updated redirect
    }, 2000)
  }

  const handleDemoLogin = async (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email)
    setPassword("demo123")
    setShowDemoAccounts(false)
    setLoginError("")
    setIsLoading(true)

    try {
      await login(account.email, "demo123")

      // Special handling for presentation account
      if (account.key === "presentation") {
        // DISABLED: Automatic presentation mode trigger
        // localStorage.setItem("presentationMode", "true")
        // setPresentationMode(true)
        console.log("🎬 Demo Login: Presentation mode disabled for presentation account")
        toast({
          title: `Welcome to HB Intel`,
          description: `Presentation mode disabled - use manual triggers from sidebar menu`,
        })
        router.push("/main-app")
      } else {
        toast({
          title: `Welcome, ${account.label}`,
          description: `You're logged in as a demo ${account.label}.`,
        })
        router.push(account.redirectTo)
      }
    } catch (error) {
      toast({
        title: "Demo login failed",
        description: "Please try again or check your demo credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresentationComplete = () => {
    localStorage.removeItem("presentationMode")
    // DISABLED: Automatic Intel tour trigger
    // localStorage.setItem("triggerIntelTour", Date.now().toString())
    // localStorage.removeItem("intelTourCompleted")
    setPresentationMode(false)
    console.log("🎬 Presentation Complete: Intel Tour flags disabled for transition to main app")
    router.push("/main-app")
  }

  const CurrentFeatureIcon = features[currentFeature].icon
  const isSmallScreen = windowSize.width < 768
  const isMediumScreen = windowSize.width >= 768 && windowSize.width < 1024
  const isLargeScreen = windowSize.width >= 1024
  const isExtraLargeScreen = windowSize.width >= 1280
  const isMobile = windowSize.width < 480
  const isTablet = windowSize.width >= 480 && windowSize.width < 1024

  return (
    // Force light mode for the entire login page, regardless of global theme
    <div className="login-page-container">
      {/* Presentation Carousel - renders above login UI when in presentation mode */}
      {presentationMode && <PresentationCarousel slides={slides} onComplete={handlePresentationComplete} />}

      <style jsx global>{`
        .login-page-container {
          --background: 0 0% 100%;
          --foreground: 0 0% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 3.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 0 0% 3.9%;
          --primary: 0 0% 9%;
          --primary-foreground: 0 0% 98%;
          --secondary: 0 0% 96.1%;
          --secondary-foreground: 0 0% 9%;
          --muted: 0 0% 96.1%;
          --muted-foreground: 0 0% 45.1%;
          --accent: 0 0% 96.1%;
          --accent-foreground: 0 0% 9%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 89.8%;
          --input: 0 0% 89.8%;
          --ring: 0 0% 3.9%;
        }
        .login-page-container * {
          color-scheme: light;
        }

        /* Enhanced visual feedback animations */
        .login-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .login-form input:focus {
          transform: scale(1.01);
        }

        /* Improved button states */
        .login-form button {
          position: relative;
          overflow: hidden;
        }

        .login-form button:before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .login-form button:hover:before {
          left: 100%;
        }

        /* Enhanced focus states for accessibility */
        .login-form *:focus-visible {
          outline: 2px solid #003087;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(0, 48, 135, 0.1);
        }
      `}</style>
      <div
        className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative"
        role="main"
        aria-label="Login Page"
      >
        {/* Responsive Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        {/* Animated floating elements - responsive scaling */}
        <div
          className="absolute bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{
            top: Math.max(windowSize.height * 0.15, 60),
            left: Math.max(windowSize.width * 0.05, 20),
            width: Math.min(Math.max(windowSize.width * 0.08, 40), 80),
            height: Math.min(Math.max(windowSize.width * 0.08, 40), 80),
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"
          style={{
            top: Math.max(windowSize.height * 0.25, 80),
            right: Math.max(windowSize.width * 0.1, 30),
            width: Math.min(Math.max(windowSize.width * 0.12, 60), 120),
            height: Math.min(Math.max(windowSize.width * 0.12, 60), 120),
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bg-orange-200 rounded-full opacity-20 animate-pulse delay-2000"
          style={{
            bottom: Math.max(windowSize.height * 0.15, 60),
            left: Math.max(windowSize.width * 0.08, 25),
            width: Math.min(Math.max(windowSize.width * 0.06, 30), 60),
            height: Math.min(Math.max(windowSize.width * 0.06, 30), 60),
          }}
          aria-hidden="true"
        />

        <div className="h-full flex">
          {/* Left Side - Branding & Features (Hidden on mobile) */}
          {!isSmallScreen && (
            <div
              className="bg-gradient-to-br from-[#003087] via-[#1e3a8a] to-[#1e40af] text-white relative overflow-hidden flex flex-col"
              style={{
                width: isMediumScreen ? "45%" : isLargeScreen ? "60%" : "50%",
                padding: `${Math.max(windowSize.height * 0.04, 24)}px ${Math.max(windowSize.width * 0.02, 16)}px`,
              }}
              aria-label="Platform Features and Benefits"
            >
              {/* Enhanced Background Pattern */}
              <div
                className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]"
                aria-hidden="true"
              />
              <div
                className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/6 translate-x-1/6"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/6 -translate-x-1/6"
                aria-hidden="true"
              />

              {/* Header - Responsive sizing */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="bg-white p-2 sm:p-2 lg:p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <Building2
                      className={`text-[#003087] ${isLargeScreen ? "h-8 w-8" : isMediumScreen ? "h-7 w-7" : "h-6 w-6"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4">
                    <h1
                      className={`font-bold tracking-tight ${
                        isLargeScreen ? "text-2xl" : isMediumScreen ? "text-xl" : "text-lg"
                      }`}
                    >
                      Hedrick Brothers Construction
                    </h1>
                    <p className={`text-blue-200 font-medium ${isLargeScreen ? "text-sm" : "text-xs"}`}>
                      presents HB Intel
                    </p>
                    <p className={`text-blue-100 font-normal ${isLargeScreen ? "text-base" : "text-sm"}`}>
                      A Construction Enterprise Solution
                    </p>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white mb-2 sm:mb-3 lg:mb-4 px-2 sm:px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium">
                    ✨ Now in Beta
                  </Badge>
                  <h2
                    className={`font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent ${
                      isLargeScreen
                        ? "text-3xl xl:text-4xl 2xl:text-5xl"
                        : isMediumScreen
                        ? "text-2xl lg:text-3xl"
                        : "text-xl lg:text-2xl"
                    } animate-in slide-in-from-left-4 duration-1000`}
                  >
                    Build Smarter with Dynamic Project Solutions
                  </h2>
                  <p
                    className={`text-blue-100 leading-relaxed ${
                      isLargeScreen
                        ? "text-lg xl:text-xl max-w-lg"
                        : isMediumScreen
                        ? "text-base max-w-md"
                        : "text-sm max-w-sm"
                    }`}
                  >
                    Streamline operations, boost productivity, and deliver projects on time with our comprehensive
                    analytics platform.
                  </p>
                </div>
              </div>

              {/* Feature Showcase - Flexible height */}
              <div className="relative z-10 flex-1 flex items-center min-h-0">
                <div className="w-full">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 xl:p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex items-start mb-3 sm:mb-4 lg:mb-6">
                      <div
                        className={`bg-gradient-to-r ${features[currentFeature].color} p-2 sm:p-3 lg:p-4 rounded-xl mr-3 sm:mr-4 lg:mr-6 transform transition-transform duration-300 hover:rotate-6`}
                      >
                        <CurrentFeatureIcon
                          className={`text-white ${isLargeScreen ? "h-8 w-8" : isMediumScreen ? "h-7 w-7" : "h-6 w-6"}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-bold mb-2 ${
                            isLargeScreen ? "text-2xl" : isMediumScreen ? "text-lg lg:text-xl" : "text-base lg:text-lg"
                          }`}
                        >
                          {features[currentFeature].title}
                        </h3>
                        <p
                          className={`text-blue-200 leading-relaxed mb-3 ${
                            isLargeScreen ? "text-lg" : isMediumScreen ? "text-sm lg:text-base" : "text-xs lg:text-sm"
                          }`}
                        >
                          {features[currentFeature].description}
                        </p>
                        <div className="inline-flex items-center bg-green-500/20 text-green-300 px-2 sm:px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                          <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" aria-hidden="true" />
                          {features[currentFeature].highlight}
                        </div>
                      </div>
                    </div>

                    {/* Feature indicators */}
                    <div
                      className="flex space-x-2 sm:space-x-2 lg:space-x-3 mt-4 sm:mt-6 lg:mt-8"
                      role="tablist"
                      aria-label="Feature Indicators"
                    >
                      {features.map((_, index) => (
                        <button
                          key={index}
                          role="tab"
                          aria-selected={index === currentFeature}
                          aria-controls={`feature-panel-${index}`}
                          className={`h-2 rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                            index === currentFeature
                              ? "w-6 sm:w-8 lg:w-12 bg-white shadow-lg"
                              : "w-2 sm:w-2 lg:w-3 bg-white/40 hover:bg-white/60"
                          }`}
                          onClick={() => setCurrentFeature(index)}
                          aria-label={`Show feature ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits List - Responsive grid */}
              <div className="relative z-10 flex-shrink-0 mt-4 sm:mt-6 lg:mt-8" aria-label="Why teams choose HB Report">
                <h3
                  className={`font-bold mb-3 sm:mb-4 lg:mb-6 ${
                    isLargeScreen ? "text-xl" : isMediumScreen ? "text-lg" : "text-base"
                  }`}
                >
                  Why teams choose HB Report:
                </h3>
                <div className={`grid gap-2 sm:gap-2 lg:gap-4 ${isLargeScreen ? "grid-cols-2" : "grid-cols-1"}`}>
                  {benefits.slice(0, isLargeScreen ? 6 : 4).map((benefit, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="bg-green-500/20 p-1 rounded-full mr-2 sm:mr-2 lg:mr-3 group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400" aria-hidden="true" />
                      </div>
                      <span
                        className={`text-blue-100 group-hover:text-white transition-colors ${
                          isLargeScreen ? "text-sm" : isMediumScreen ? "text-xs" : "text-xs"
                        }`}
                      >
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Login Form */}
          <div
            className={`flex items-center justify-center relative ${
              isSmallScreen ? "w-full" : isMediumScreen ? "w-[55%]" : "w-[40%]"
            }`}
            style={{
              padding: `${Math.max(windowSize.height * 0.02, 12)}px ${Math.max(windowSize.width * 0.02, 12)}px`,
            }}
            aria-label="Login Form Section"
          >
            <ScrollArea className="h-full w-full">
              <div className="flex items-center justify-center min-h-full py-2 sm:py-4">
                <div className="w-full max-w-md mx-auto px-2 sm:px-4">
                  {/* Mobile Header */}
                  {isSmallScreen && (
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <div className="bg-gradient-to-r from-[#003087] to-[#1e3a8a] p-2 sm:p-3 rounded-2xl shadow-xl">
                          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#003087] to-[#1e3a8a] bg-clip-text text-transparent mb-1">
                        Hedrick Brothers Construction
                      </h1>
                      <p className="text-gray-600 font-medium text-xs sm:text-sm mb-1">presents HB Intel</p>
                      <p className="text-gray-500 font-normal text-xs">A Construction Enterprise Solution</p>
                    </div>
                  )}

                  <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm login-card !bg-white !text-gray-900 !border-gray-200 relative overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,48,135,0.03),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,58,138,0.03),transparent_50%)]" />
                    <div className="relative z-10">
                      <CardHeader className="text-center pb-3 sm:pb-4 lg:pb-6 !bg-white">
                        <CardTitle
                          className={`font-bold bg-gradient-to-r from-[#003087] via-[#1e3a8a] to-[#1e40af] bg-clip-text text-transparent mb-2 sm:mb-3 ${
                            isSmallScreen ? "text-xl sm:text-2xl" : "text-2xl lg:text-3xl"
                          } tracking-tight`}
                        >
                          Welcome Back
                        </CardTitle>
                        <CardDescription
                          className={`text-gray-600 leading-relaxed font-medium ${
                            isSmallScreen ? "text-xs sm:text-sm" : "text-base"
                          } max-w-sm mx-auto`}
                        >
                          Sign in to access your construction analytics dashboard
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <form
                          onSubmit={handleSubmit}
                          className="space-y-3 sm:space-y-4 lg:space-y-5 login-form"
                          aria-label="User Login Form"
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center"
                            >
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your work email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value)
                                if (loginError) setLoginError("")
                              }}
                              className="h-10 sm:h-11 lg:h-12 !border-2 !border-gray-200 focus:!border-[#003087] focus:!ring-[#003087] transition-all duration-200 !bg-white !text-gray-900 focus-visible:!ring-2 focus-visible:!ring-[#003087] focus-visible:!ring-offset-2"
                              required
                              aria-required="true"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="password"
                              className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center"
                            >
                              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
                              Password
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                if (loginError) setLoginError("")
                              }}
                              className="h-10 sm:h-11 lg:h-12 !border-2 !border-gray-200 focus:!border-[#003087] focus:!ring-[#003087] transition-all duration-200 !bg-white !text-gray-900 focus-visible:!ring-2 focus-visible:!ring-[#003087] focus-visible:!ring-offset-2"
                              required
                              aria-required="true"
                            />
                          </div>

                          {/* Error Message Display */}
                          {loginError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
                              <p className="text-sm text-red-700 flex items-center">
                                <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {loginError}
                              </p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full h-10 sm:h-11 lg:h-12 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:from-[#E55A2B] hover:to-[#D14D20] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading}
                            aria-label={isLoading ? "Signing in..." : "Sign In"}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <Loader2 className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
                                Signing in...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                Sign In
                                <ArrowRight
                                  className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </Button>
                        </form>

                        {/* SSO Options */}
                        <div className="space-y-3 sm:space-y-3 lg:space-y-4" aria-label="Single Sign-On Options">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-3 text-gray-600 font-semibold">Or continue with</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <Button
                              variant="outline"
                              onClick={() => handleSSOLogin("Okta")}
                              disabled={isLoading}
                              className="h-9 sm:h-10 lg:h-11 !border-2 !border-gray-200 hover:!bg-gray-50 hover:!border-gray-300 transition-all duration-200 font-medium text-xs sm:text-sm !bg-white !text-gray-900"
                              aria-label="Login with Okta"
                            >
                              {isLoading ? (
                                <Loader2
                                  className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin text-gray-600"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-600" aria-hidden="true" />
                              )}
                              Okta
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleSSOLogin("Azure AD")}
                              disabled={isLoading}
                              className="h-9 sm:h-10 lg:h-11 !border-2 !border-gray-200 hover:!bg-gray-50 hover:!border-gray-300 transition-all duration-200 font-medium text-xs sm:text-sm !bg-white !text-gray-900"
                              aria-label="Login with Azure AD"
                            >
                              {isLoading ? (
                                <Loader2
                                  className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin text-gray-600"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-600" aria-hidden="true" />
                              )}
                              Azure AD
                            </Button>
                          </div>
                        </div>

                        {/* Demo Accounts - Collapsible */}
                        <div className="space-y-3 sm:space-y-3 lg:space-y-4" aria-label="Demo Accounts Section">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-3 text-gray-600 font-semibold">Demo Accounts</span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                            className="w-full h-9 sm:h-10 lg:h-11 !border-2 !border-blue-200 !text-blue-700 hover:!bg-blue-50 hover:!border-blue-300 transition-all duration-200 font-medium !bg-white"
                            aria-expanded={showDemoAccounts}
                            aria-controls="demo-accounts-list"
                            aria-label="Toggle demo accounts list"
                            data-tour="demo-accounts-toggle"
                          >
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" aria-hidden="true" />
                            Try Demo Accounts
                            <ChevronDown
                              className={`h-3 w-3 sm:h-4 sm:w-4 ml-2 transition-transform duration-200 text-blue-600 ${
                                showDemoAccounts ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </Button>

                          {showDemoAccounts && (
                            <div
                              id="demo-accounts-list"
                              className="space-y-2 animate-in slide-in-from-top-2 duration-200"
                              data-tour="demo-accounts-list"
                            >
                              {demoAccounts.map((account) => {
                                const IconComponent = account.icon
                                return (
                                  <Button
                                    key={account.key}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDemoLogin(account)}
                                    disabled={isLoading}
                                    className="w-full h-auto p-2 sm:p-3 text-left !border !border-blue-100 !text-blue-700 hover:!bg-blue-50 hover:!border-blue-200 transition-all duration-200 flex items-center justify-start !bg-white"
                                    aria-label={`Login as ${account.label} demo account`}
                                  >
                                    <IconComponent
                                      className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0 text-blue-600"
                                      aria-hidden="true"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-xs sm:text-sm truncate text-blue-700">
                                        {account.label}
                                      </div>
                                      <div className="text-xs text-blue-600 opacity-75 truncate">{account.email}</div>
                                    </div>
                                  </Button>
                                )
                              })}
                            </div>
                          )}
                        </div>

                        {/* Footer Links */}
                        <div
                          className="space-y-2 sm:space-y-3 text-center text-xs sm:text-sm"
                          aria-label="Account Links"
                        >
                          <Link
                            href="/forgot-password"
                            className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                          >
                            Forgot your password?
                          </Link>
                          <div className="text-gray-600">
                            {"Don't have an account? "}
                            <Link
                              href="/signup"
                              className="text-[#003087] hover:text-[#002066] hover:underline font-semibold transition-colors"
                            >
                              Request Access
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Trust Indicators */}
                  <div className="mt-4 sm:mt-6 lg:mt-8 text-center" aria-label="Trust Indicators">
                    <p className="text-xs sm:text-xs lg:text-sm text-gray-600 mb-2 sm:mb-2 lg:mb-3 font-medium">
                      Trusted by construction teams nationwide
                    </p>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-500">
                      <span className="flex items-center bg-gray-50 px-1 sm:px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                        <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" aria-hidden="true" />
                        <span className="text-xs sm:text-xs lg:text-sm">SOC 2 Compliant</span>
                      </span>
                      <span className="flex items-center bg-gray-50 px-1 sm:px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                        <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600" aria-hidden="true" />
                        <span className="text-xs sm:text-xs lg:text-sm">99.9% Uptime</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
