"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Ruler,
  Square,
  Circle,
  Type,
  PenTool,
  Layers,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Undo,
  Redo,
  Grid,
  Maximize,
  Minimize,
  Brain,
  Sparkles,
  Target,
  Scan,
  Zap,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Triangle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface DrawingMarkup {
  id: string
  type: "measurement" | "area" | "text" | "line" | "circle" | "ai-detected"
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  length?: number
  angle?: number
  text?: string
  color?: string
  confidence?: number
  aiCategory?: string
  measurements?: {
    length?: number
    width?: number
    height?: number
    area?: number
    volume?: number
  }
  estimatedCost?: number
  csiCode?: string
}

interface AIAnalysisResult {
  id: string
  type: "window" | "door" | "wall" | "fixture" | "opening" | "trim" | "electrical"
  description: string
  measurements: {
    length?: number
    width?: number
    height?: number
    area?: number
    volume?: number
  }
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  estimatedCost?: number
  csiCode?: string
  suggestions?: string[]
}

interface DrawingViewerProps {
  onTakeoffAdd?: (takeoffData: any) => void
  projectId?: string
}

export default function DrawingViewer({ onTakeoffAdd, projectId }: DrawingViewerProps) {
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // State management
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(
    "/drawings/A-415_Interior Elev. - Primary Bedroom.pdf"
  )
  const [markups, setMarkups] = useState<DrawingMarkup[]>([])
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [aiAnalysisResults, setAiAnalysisResults] = useState<AIAnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showAiResults, setShowAiResults] = useState(true)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  // Mock AI analysis results for demo
  const mockAiResults: AIAnalysisResult[] = [
    {
      id: "ai-1",
      type: "window",
      description: "Double-hung window with trim",
      measurements: { width: 48, height: 60, area: 20 },
      confidence: 0.94,
      boundingBox: { x: 150, y: 200, width: 120, height: 150 },
      estimatedCost: 850,
      csiCode: "08511",
      suggestions: ["Consider energy-efficient glazing", "Verify rough opening dimensions"],
    },
    {
      id: "ai-2",
      type: "door",
      description: "Interior door with frame and casing",
      measurements: { width: 32, height: 80, area: 17.8 },
      confidence: 0.91,
      boundingBox: { x: 300, y: 180, width: 80, height: 200 },
      estimatedCost: 320,
      csiCode: "08211",
      suggestions: ["Standard pre-hung unit", "Coordinate with millwork"],
    },
    {
      id: "ai-3",
      type: "fixture",
      description: "Built-in wardrobe/closet system",
      measurements: { width: 96, height: 84, area: 56 },
      confidence: 0.87,
      boundingBox: { x: 400, y: 150, width: 160, height: 180 },
      estimatedCost: 2400,
      csiCode: "06410",
      suggestions: ["Custom millwork required", "Coordinate electrical for lighting"],
    },
    {
      id: "ai-4",
      type: "electrical",
      description: "Wall outlet locations",
      measurements: { width: 4, height: 4, area: 0.1 },
      confidence: 0.82,
      boundingBox: { x: 180, y: 320, width: 20, height: 20 },
      estimatedCost: 85,
      csiCode: "26050",
      suggestions: ["Verify outlet height per code", "Consider GFCI requirements"],
    },
    {
      id: "ai-5",
      type: "wall",
      description: "Interior partition wall with drywall finish",
      measurements: { length: 144, height: 108, area: 108 },
      confidence: 0.89,
      boundingBox: { x: 100, y: 100, width: 300, height: 20 },
      estimatedCost: 650,
      csiCode: "09250",
      suggestions: ["Standard 2x4 framing", "Coordinate with mechanical/electrical"],
    },
    {
      id: "ai-6",
      type: "trim",
      description: "Base molding and door/window casing",
      measurements: { length: 420, height: 5.5, area: 16 },
      confidence: 0.93,
      boundingBox: { x: 120, y: 350, width: 350, height: 15 },
      estimatedCost: 480,
      csiCode: "06220",
      suggestions: ["Paint-grade MDF trim", "Miter joints at corners"],
    },
    {
      id: "ai-7",
      type: "opening",
      description: "Arch opening between spaces",
      measurements: { width: 72, height: 84, area: 42 },
      confidence: 0.85,
      boundingBox: { x: 500, y: 160, width: 90, height: 170 },
      estimatedCost: 420,
      csiCode: "06100",
      suggestions: ["Verify structural requirements", "Custom arch detail required"],
    },
    {
      id: "ai-8",
      type: "fixture",
      description: "Ceiling light fixture location",
      measurements: { width: 24, height: 24, area: 4 },
      confidence: 0.88,
      boundingBox: { x: 320, y: 80, width: 30, height: 30 },
      estimatedCost: 180,
      csiCode: "26510",
      suggestions: ["Coordinate with ceiling layout", "Consider dimming controls"],
    },
  ]

  // Initialize with mock data
  useEffect(() => {
    setTimeout(() => {
      setAiAnalysisResults(mockAiResults)
    }, 1000)
  }, [])

  // Simulate AI analysis
  const simulateAiAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setAnalysisProgress(i)
    }

    setAiAnalysisResults(mockAiResults)
    setIsAnalyzing(false)

    toast({
      title: "AI Analysis Complete",
      description: `Found ${mockAiResults.length} construction elements with measurements and cost estimates.`,
    })
  }, [toast])

  // Handle adding AI results to takeoff
  const handleAddToTakeoff = useCallback(
    (result: AIAnalysisResult) => {
      const takeoffData = {
        id: `takeoff-${Date.now()}`,
        csiCode: result.csiCode || "00000",
        description: result.description,
        type: "count" as const,
        measurements: result.measurements,
        unitCost: result.estimatedCost || 0,
        quantity: 1,
        unit: "EA",
        notes: `AI-detected with ${(result.confidence * 100).toFixed(0)}% confidence`,
        aiGenerated: true,
      }

      onTakeoffAdd?.(takeoffData)

      toast({
        title: "Added to Takeoff",
        description: `${result.description} added to takeoff list`,
      })
    },
    [onTakeoffAdd, toast]
  )

  // Export AI results
  const handleExportResults = useCallback(() => {
    const exportData = {
      drawing: "A-415_Interior Elev. - Primary Bedroom",
      analysisDate: new Date().toISOString(),
      totalElements: aiAnalysisResults.length,
      totalEstimatedCost: aiAnalysisResults.reduce((sum, result) => sum + (result.estimatedCost || 0), 0),
      results: aiAnalysisResults,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-takeoff-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [aiAnalysisResults])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case "window":
        return <Grid className="h-4 w-4" />
      case "door":
        return <Square className="h-4 w-4" />
      case "wall":
        return <ArrowRight className="h-4 w-4" />
      case "fixture":
        return <Lightbulb className="h-4 w-4" />
      case "electrical":
        return <Zap className="h-4 w-4" />
      case "trim":
        return <Ruler className="h-4 w-4" />
      case "opening":
        return <Circle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-50 border-green-200"
    if (confidence >= 0.8) return "text-blue-600 bg-blue-50 border-blue-200"
    return "text-yellow-600 bg-yellow-50 border-yellow-200"
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Drawing Viewer - Primary Bedroom Interior Elevation</h2>
        </div>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Drawing
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-white dark:bg-gray-900">
        <Button variant="outline" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Select value={zoom.toString()} onValueChange={(value) => setZoom(parseInt(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="125">125%</SelectItem>
            <SelectItem value="150">150%</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm">
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm">
          <Ruler className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm">
          <Type className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm">
          <PenTool className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant={showAiResults ? "default" : "outline"}
          size="sm"
          onClick={() => setShowAiResults(!showAiResults)}
        >
          <Brain className="h-4 w-4 mr-1" />
          Default
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Drawing Area */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
          {/* PDF Viewer */}
          <div className="w-full h-full relative">
            {currentDrawing ? (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <iframe
                  src={`/drawings/A-415_Interior Elev. - Primary Bedroom.pdf#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH`}
                  width="100%"
                  height="100%"
                  style={{ border: "none", minHeight: "600px" }}
                  title="PDF Drawing Viewer"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Primary Bedroom Interior Elevation</h3>
                    <p className="text-sm text-gray-500 mb-4">A-415_Interior Elev. - Primary Bedroom.pdf</p>
                    <p className="text-xs text-gray-400 mb-4">
                      This drawing contains the interior elevation view of the primary bedroom
                    </p>
                    <p className="text-xs text-blue-600 mb-4">
                      AI has detected 8 construction elements with measurements and costs
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </iframe>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Drawing Loaded</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload a PDF, DWG, or image file to begin</p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Drawing
                  </Button>
                </div>
              </div>
            )}

            {/* AI Overlay */}
            {showAiResults && aiAnalysisResults.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {aiAnalysisResults.map((result) => (
                  <div
                    key={result.id}
                    className="absolute border-2 border-blue-500 bg-blue-500/10 rounded pointer-events-auto cursor-pointer hover:bg-blue-500/20 transition-colors"
                    style={{
                      left: `${(result.boundingBox.x / 800) * 100}%`,
                      top: `${(result.boundingBox.y / 600) * 100}%`,
                      width: `${(result.boundingBox.width / 800) * 100}%`,
                      height: `${(result.boundingBox.height / 600) * 100}%`,
                    }}
                    onClick={() => setSelectedElement(result.id)}
                  >
                    <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {result.description} ({(result.confidence * 100).toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI-Generated Takeoff Elements Panel */}
        <div className="w-80 border-l bg-white dark:bg-gray-900 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                AI-Generated Takeoff Elements ({aiAnalysisResults.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportResults}
                disabled={aiAnalysisResults.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="h-4 w-4 animate-pulse text-blue-600" />
                  <span className="text-sm">Analyzing drawing...</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}

            {!isAnalyzing && aiAnalysisResults.length === 0 && (
              <div className="text-center py-8">
                <Button onClick={simulateAiAnalysis} className="mb-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run HBI Analysis
                </Button>
                <p className="text-sm text-gray-500">AI will identify construction elements, measurements, and costs</p>
              </div>
            )}
          </div>

          {aiAnalysisResults.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiAnalysisResults.map((result) => (
                <Card
                  key={result.id}
                  className={`cursor-pointer transition-all ${
                    selectedElement === result.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedElement(selectedElement === result.id ? null : result.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getElementIcon(result.type)}
                        <div>
                          <CardTitle className="text-sm">{result.description}</CardTitle>
                          <Badge variant="outline" className={`text-xs mt-1 ${getConfidenceColor(result.confidence)}`}>
                            {(result.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {result.csiCode}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {result.measurements.width && <div>Width: {result.measurements.width}"</div>}
                      {result.measurements.height && <div>Height: {result.measurements.height}"</div>}
                      {result.measurements.length && <div>Length: {result.measurements.length}"</div>}
                      {result.measurements.area && <div>Area: {result.measurements.area} sf</div>}
                    </div>

                    {result.estimatedCost && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Est. Cost:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(result.estimatedCost)}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToTakeoff(result)
                        }}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Add to Takeoff
                      </Button>
                    </div>

                    {selectedElement === result.id && result.suggestions && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-xs font-medium mb-1">AI Suggestions:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {result.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
