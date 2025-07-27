"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Download,
  FileText,
  FileSpreadsheet,
  Settings,
  Calendar,
  Filter,
  Check,
  X,
  RefreshCw,
  Share,
  Mail,
  Link,
  Eye,
  Save,
  Folder,
  Archive,
  Upload,
  ClipboardList,
  BarChart3,
  PieChart,
  Users,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  MessageSquare,
  Award,
  Building,
  Zap,
  Activity,
  Database,
  Package,
  Globe,
  Printer,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  ExternalLink,
  HelpCircle,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Columns,
  Table,
  Layout,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  Calculator,
  ShoppingCart,
  Tag,
  Bookmark,
  Flag,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Flame,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  CameraOff,
  Camera,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Repeat,
  Shuffle,
  Music,
  Headphones,
  Speaker,
  Radio,
  Disc,
  Film,
  Tv,
  Dices,
  Puzzle,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Wand,
  Wand2,
  Paintbrush,
  Paintbrush2,
  Pipette,
  Pen,
  PenTool,
  Pencil,
  PencilRuler,
  Ruler,
  Compass,
  Shapes,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Spline,
  Anchor,
  Lasso,
  Move,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Focus,
  Crosshair,
  Navigation,
  Navigation2,
  Map,
  MapPin,
  MapPinOff,
  Route,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Fuel,
  Battery,
  BatteryLow,
  Plug,
  PlugZap,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  BluetoothOff,
  Antenna,
  Satellite,
  Radar,
  Rss,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Nfc,
  Usb,
  HardDrive,
  HardHat,
  Wrench,
  Hammer,
  Drill,
  Scissors,
  Axe,
  Pickaxe,
  Shovel,
  Shirt,
  Glasses,
  Watch,
  Bandage,
  Pill,
  Syringe,
  Stethoscope,
  Thermometer,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardX,
  Notebook,
  NotebookPen,
  NotebookTabs,
  Book,
  BookOpen,
  BookCopy,
  BookCheck,
  BookX,
  BookPlus,
  BookMinus,
  BookMarked,
  Library,
  School,
  GraduationCap,
  University,
  Backpack,
  Briefcase,
  ShoppingBag,
  Gift,
  Ribbon,
  Cake,
  Cookie,
  Candy,
  Lollipop,
  Pizza,
  Sandwich,
  Popcorn,
  Donut,
  Croissant,
  Egg,
  Fish,
  Snail,
  Turtle,
  Bird,
  Rabbit,
  Squirrel,
  Cat,
  Dog,
  Bug,
  Worm,
  Flower,
  Flower2,
  Cherry,
  Apple,
  Banana,
  Grape,
  Carrot,
  Clover,
  Sword,
  Bell,
  Ghost,
} from "lucide-react"

interface ExportConfig {
  format: "pdf" | "excel" | "word" | "json" | "csv" | "html" | "xml"
  includeScoring: boolean
  includeComments: boolean
  includeRecommendations: boolean
  includeIssues: boolean
  includeAttachments: boolean
  includeImages: boolean
  includeCharts: boolean
  includeHistory: boolean
  includeMetadata: boolean
  templateStyle: "standard" | "detailed" | "summary" | "executive"
  orientation: "portrait" | "landscape"
  pageSize: "A4" | "A3" | "Letter" | "Legal" | "Tabloid"
  quality: "draft" | "standard" | "high" | "print"
  compression: boolean
  watermark: boolean
  pageNumbers: boolean
  tableOfContents: boolean
  appendices: boolean
  coverPage: boolean
  customTitle?: string
  customSubtitle?: string
  customNotes?: string
  dateRange?: {
    start?: string
    end?: string
  }
  filters?: {
    status?: string[]
    priority?: string[]
    reviewer?: string[]
    stage?: string[]
    scoreRange?: {
      min: number
      max: number
    }
  }
  groupBy?: "reviewer" | "stage" | "date" | "score" | "priority"
  sortBy?: "date" | "score" | "priority" | "reviewer" | "stage"
  sortOrder?: "asc" | "desc"
  maxRecords?: number
  includeSubreports?: boolean
  customFields?: string[]
  branding?: {
    logo?: boolean
    companyName?: string
    colors?: {
      primary?: string
      secondary?: string
      accent?: string
    }
  }
}

interface ExportProgress {
  stage: string
  progress: number
  message: string
  error?: string
}

interface ExportHistoryItem {
  id: string
  fileName: string
  format: string
  size: number
  createdAt: string
  downloadUrl: string
  config: ExportConfig
  status: "completed" | "failed" | "processing"
}

interface ConstructabilityReviewExportProps {
  reviewId?: string
  reviews?: any[]
  onExport?: (config: ExportConfig) => Promise<void>
  onDownload?: (url: string) => void
  className?: string
}

const ConstructabilityReviewExport: React.FC<ConstructabilityReviewExportProps> = ({
  reviewId,
  reviews = [],
  onExport,
  onDownload,
  className = "",
}) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: "pdf",
    includeScoring: true,
    includeComments: true,
    includeRecommendations: true,
    includeIssues: true,
    includeAttachments: false,
    includeImages: true,
    includeCharts: true,
    includeHistory: false,
    includeMetadata: true,
    templateStyle: "standard",
    orientation: "portrait",
    pageSize: "A4",
    quality: "standard",
    compression: true,
    watermark: false,
    pageNumbers: true,
    tableOfContents: true,
    appendices: false,
    coverPage: true,
    groupBy: "stage",
    sortBy: "date",
    sortOrder: "desc",
    maxRecords: 100,
    includeSubreports: false,
    customFields: [],
    branding: {
      logo: true,
      companyName: "HB Construction",
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F59E0B",
      },
    },
  })

  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const formatOptions = [
    {
      value: "pdf",
      label: "PDF Document",
      icon: FileText,
      description: "Portable Document Format - Best for sharing and printing",
    },
    {
      value: "excel",
      label: "Excel Spreadsheet",
      icon: FileSpreadsheet,
      description: "Microsoft Excel format - Best for data analysis",
    },
    {
      value: "word",
      label: "Word Document",
      icon: FileText,
      description: "Microsoft Word format - Best for editing and collaboration",
    },
    {
      value: "json",
      label: "JSON Data",
      icon: Database,
      description: "JavaScript Object Notation - Best for data integration",
    },
    {
      value: "csv",
      label: "CSV File",
      icon: FileSpreadsheet,
      description: "Comma-separated values - Best for simple data import",
    },
    { value: "html", label: "HTML Report", icon: Globe, description: "Web format - Best for online viewing" },
    {
      value: "xml",
      label: "XML Data",
      icon: Code,
      description: "Extensible Markup Language - Best for system integration",
    },
  ]

  const templateStyles = [
    { value: "standard", label: "Standard Report", description: "Comprehensive report with all sections" },
    { value: "detailed", label: "Detailed Analysis", description: "In-depth analysis with extended commentary" },
    { value: "summary", label: "Executive Summary", description: "High-level overview for executives" },
    { value: "executive", label: "Executive Dashboard", description: "Key metrics and insights only" },
  ]

  const pageSizes = [
    { value: "A4", label: "A4 (8.3 × 11.7 in)" },
    { value: "A3", label: "A3 (11.7 × 16.5 in)" },
    { value: "Letter", label: "Letter (8.5 × 11 in)" },
    { value: "Legal", label: "Legal (8.5 × 14 in)" },
    { value: "Tabloid", label: "Tabloid (11 × 17 in)" },
  ]

  const qualityOptions = [
    { value: "draft", label: "Draft", description: "Low quality, fast processing" },
    { value: "standard", label: "Standard", description: "Good quality, normal processing" },
    { value: "high", label: "High", description: "High quality, slower processing" },
    { value: "print", label: "Print Ready", description: "Highest quality, optimized for printing" },
  ]

  const handleExport = async () => {
    if (!onExport) return

    setIsExporting(true)
    setExportProgress({
      stage: "Initializing",
      progress: 0,
      message: "Preparing export...",
    })

    try {
      // Simulate export progress
      const stages = [
        { stage: "Collecting Data", progress: 20, message: "Gathering review data..." },
        { stage: "Processing Content", progress: 40, message: "Processing comments and recommendations..." },
        { stage: "Generating Charts", progress: 60, message: "Creating visualizations..." },
        { stage: "Formatting Document", progress: 80, message: "Applying formatting and styles..." },
        { stage: "Finalizing", progress: 100, message: "Export completed successfully!" },
      ]

      for (const stage of stages) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setExportProgress(stage)
      }

      await onExport(exportConfig)

      // Add to history
      const newExportItem: ExportHistoryItem = {
        id: Date.now().toString(),
        fileName: `constructability-review-${new Date().toISOString().split("T")[0]}.${exportConfig.format}`,
        format: exportConfig.format,
        size: Math.floor(Math.random() * 10000000) + 1000000, // Simulate file size
        createdAt: new Date().toISOString(),
        downloadUrl: "#",
        config: exportConfig,
        status: "completed",
      }

      setExportHistory((prev) => [newExportItem, ...prev])
    } catch (error) {
      setExportProgress({
        stage: "Error",
        progress: 0,
        message: "Export failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(null), 3000)
    }
  }

  const handleDownload = (item: ExportHistoryItem) => {
    onDownload?.(item.downloadUrl)
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
  }

  const updateConfig = (updates: Partial<ExportConfig>) => {
    setExportConfig((prev) => ({ ...prev, ...updates }))
  }

  const resetConfig = () => {
    setExportConfig({
      format: "pdf",
      includeScoring: true,
      includeComments: true,
      includeRecommendations: true,
      includeIssues: true,
      includeAttachments: false,
      includeImages: true,
      includeCharts: true,
      includeHistory: false,
      includeMetadata: true,
      templateStyle: "standard",
      orientation: "portrait",
      pageSize: "A4",
      quality: "standard",
      compression: true,
      watermark: false,
      pageNumbers: true,
      tableOfContents: true,
      appendices: false,
      coverPage: true,
      groupBy: "stage",
      sortBy: "date",
      sortOrder: "desc",
      maxRecords: 100,
      includeSubreports: false,
      customFields: [],
      branding: {
        logo: true,
        companyName: "HB Construction",
        colors: {
          primary: "#3B82F6",
          secondary: "#10B981",
          accent: "#F59E0B",
        },
      },
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Export Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive reports and export data in multiple formats
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Export Progress */}
      {exportProgress && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{exportProgress.stage}</span>
              <span className="text-sm text-muted-foreground">{exportProgress.progress}%</span>
            </div>
            <Progress value={exportProgress.progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">{exportProgress.message}</p>
            {exportProgress.error && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{exportProgress.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="format" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Format Tab */}
        <TabsContent value="format" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
              <CardDescription>Choose the format for your exported report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      exportConfig.format === format.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => updateConfig({ format: format.value as any })}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <format.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{format.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Style */}
          <Card>
            <CardHeader>
              <CardTitle>Template Style</CardTitle>
              <CardDescription>Select the report template and style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateStyles.map((style) => (
                  <div
                    key={style.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      exportConfig.templateStyle === style.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => updateConfig({ templateStyle: style.value as any })}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{style.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Options</CardTitle>
              <CardDescription>Choose what to include in your export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scoring"
                      checked={exportConfig.includeScoring}
                      onCheckedChange={(checked) => updateConfig({ includeScoring: !!checked })}
                    />
                    <Label htmlFor="scoring" className="text-sm font-medium">
                      Scoring & Analysis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="comments"
                      checked={exportConfig.includeComments}
                      onCheckedChange={(checked) => updateConfig({ includeComments: !!checked })}
                    />
                    <Label htmlFor="comments" className="text-sm font-medium">
                      Comments & Notes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommendations"
                      checked={exportConfig.includeRecommendations}
                      onCheckedChange={(checked) => updateConfig({ includeRecommendations: !!checked })}
                    />
                    <Label htmlFor="recommendations" className="text-sm font-medium">
                      Recommendations
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="issues"
                      checked={exportConfig.includeIssues}
                      onCheckedChange={(checked) => updateConfig({ includeIssues: !!checked })}
                    />
                    <Label htmlFor="issues" className="text-sm font-medium">
                      Issues & Concerns
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="attachments"
                      checked={exportConfig.includeAttachments}
                      onCheckedChange={(checked) => updateConfig({ includeAttachments: !!checked })}
                    />
                    <Label htmlFor="attachments" className="text-sm font-medium">
                      File Attachments
                    </Label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="images"
                      checked={exportConfig.includeImages}
                      onCheckedChange={(checked) => updateConfig({ includeImages: !!checked })}
                    />
                    <Label htmlFor="images" className="text-sm font-medium">
                      Images & Photos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="charts"
                      checked={exportConfig.includeCharts}
                      onCheckedChange={(checked) => updateConfig({ includeCharts: !!checked })}
                    />
                    <Label htmlFor="charts" className="text-sm font-medium">
                      Charts & Graphs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="history"
                      checked={exportConfig.includeHistory}
                      onCheckedChange={(checked) => updateConfig({ includeHistory: !!checked })}
                    />
                    <Label htmlFor="history" className="text-sm font-medium">
                      Review History
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="metadata"
                      checked={exportConfig.includeMetadata}
                      onCheckedChange={(checked) => updateConfig({ includeMetadata: !!checked })}
                    />
                    <Label htmlFor="metadata" className="text-sm font-medium">
                      Metadata & Audit Trail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subreports"
                      checked={exportConfig.includeSubreports}
                      onCheckedChange={(checked) => updateConfig({ includeSubreports: !!checked })}
                    />
                    <Label htmlFor="subreports" className="text-sm font-medium">
                      Sub-reports
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Title & Notes</CardTitle>
              <CardDescription>Add custom title and notes to your export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customTitle">Custom Title</Label>
                <Input
                  id="customTitle"
                  value={exportConfig.customTitle || ""}
                  onChange={(e) => updateConfig({ customTitle: e.target.value })}
                  placeholder="Enter custom title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customSubtitle">Custom Subtitle</Label>
                <Input
                  id="customSubtitle"
                  value={exportConfig.customSubtitle || ""}
                  onChange={(e) => updateConfig({ customSubtitle: e.target.value })}
                  placeholder="Enter custom subtitle..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customNotes">Custom Notes</Label>
                <Textarea
                  id="customNotes"
                  value={exportConfig.customNotes || ""}
                  onChange={(e) => updateConfig({ customNotes: e.target.value })}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Options</CardTitle>
              <CardDescription>Configure document layout and formatting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select
                    value={exportConfig.orientation}
                    onValueChange={(value: any) => updateConfig({ orientation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageSize">Page Size</Label>
                  <Select
                    value={exportConfig.pageSize}
                    onValueChange={(value: any) => updateConfig({ pageSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={exportConfig.quality} onValueChange={(value: any) => updateConfig({ quality: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((quality) => (
                        <SelectItem key={quality.value} value={quality.value}>
                          {quality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRecords">Max Records</Label>
                  <Input
                    id="maxRecords"
                    type="number"
                    value={exportConfig.maxRecords || ""}
                    onChange={(e) => updateConfig({ maxRecords: parseInt(e.target.value) || 100 })}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compression"
                      checked={exportConfig.compression}
                      onCheckedChange={(checked) => updateConfig({ compression: !!checked })}
                    />
                    <Label htmlFor="compression" className="text-sm font-medium">
                      Enable Compression
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="watermark"
                      checked={exportConfig.watermark}
                      onCheckedChange={(checked) => updateConfig({ watermark: !!checked })}
                    />
                    <Label htmlFor="watermark" className="text-sm font-medium">
                      Add Watermark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pageNumbers"
                      checked={exportConfig.pageNumbers}
                      onCheckedChange={(checked) => updateConfig({ pageNumbers: !!checked })}
                    />
                    <Label htmlFor="pageNumbers" className="text-sm font-medium">
                      Page Numbers
                    </Label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tableOfContents"
                      checked={exportConfig.tableOfContents}
                      onCheckedChange={(checked) => updateConfig({ tableOfContents: !!checked })}
                    />
                    <Label htmlFor="tableOfContents" className="text-sm font-medium">
                      Table of Contents
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="appendices"
                      checked={exportConfig.appendices}
                      onCheckedChange={(checked) => updateConfig({ appendices: !!checked })}
                    />
                    <Label htmlFor="appendices" className="text-sm font-medium">
                      Appendices
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="coverPage"
                      checked={exportConfig.coverPage}
                      onCheckedChange={(checked) => updateConfig({ coverPage: !!checked })}
                    />
                    <Label htmlFor="coverPage" className="text-sm font-medium">
                      Cover Page
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding Options */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize the appearance with your branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logo"
                  checked={exportConfig.branding?.logo}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      branding: { ...exportConfig.branding, logo: !!checked },
                    })
                  }
                />
                <Label htmlFor="logo" className="text-sm font-medium">
                  Include Company Logo
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={exportConfig.branding?.companyName || ""}
                  onChange={(e) =>
                    updateConfig({
                      branding: { ...exportConfig.branding, companyName: e.target.value },
                    })
                  }
                  placeholder="Enter company name..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={exportConfig.branding?.colors?.primary || "#3B82F6"}
                    onChange={(e) =>
                      updateConfig({
                        branding: {
                          ...exportConfig.branding,
                          colors: {
                            ...exportConfig.branding?.colors,
                            primary: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={exportConfig.branding?.colors?.secondary || "#10B981"}
                    onChange={(e) =>
                      updateConfig({
                        branding: {
                          ...exportConfig.branding,
                          colors: {
                            ...exportConfig.branding?.colors,
                            secondary: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input
                    id="accentColor"
                    type="color"
                    value={exportConfig.branding?.colors?.accent || "#F59E0B"}
                    onChange={(e) =>
                      updateConfig({
                        branding: {
                          ...exportConfig.branding,
                          colors: {
                            ...exportConfig.branding?.colors,
                            accent: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filters Tab */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Filters</CardTitle>
              <CardDescription>Filter which reviews to include in the export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateStart">Date Range - Start</Label>
                  <Input
                    id="dateStart"
                    type="date"
                    value={exportConfig.dateRange?.start || ""}
                    onChange={(e) =>
                      updateConfig({
                        dateRange: { ...exportConfig.dateRange, start: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateEnd">Date Range - End</Label>
                  <Input
                    id="dateEnd"
                    type="date"
                    value={exportConfig.dateRange?.end || ""}
                    onChange={(e) =>
                      updateConfig({
                        dateRange: { ...exportConfig.dateRange, end: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groupBy">Group By</Label>
                  <Select value={exportConfig.groupBy} onValueChange={(value: any) => updateConfig({ groupBy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="stage">Project Stage</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select value={exportConfig.sortBy} onValueChange={(value: any) => updateConfig({ sortBy: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select
                  value={exportConfig.sortOrder}
                  onValueChange={(value: any) => updateConfig({ sortOrder: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>View and download previous exports</CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No export history available</p>
                  <p className="text-xs">Your exported files will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {item.format === "pdf" ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : item.format === "excel" ? (
                            <FileSpreadsheet className="h-5 w-5 text-green-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()} • {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.status === "completed" ? "default" : "destructive"}>{item.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(item)}
                          disabled={item.status !== "completed"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={resetConfig}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const configStr = JSON.stringify(exportConfig, null, 2)
              navigator.clipboard.writeText(configStr)
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Config
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)} disabled={isExporting}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewMode} onOpenChange={setPreviewMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export Preview</DialogTitle>
            <DialogDescription>Preview of your export configuration</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Format</Label>
                <p className="font-medium">{exportConfig.format.toUpperCase()}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Template</Label>
                <p className="font-medium">{exportConfig.templateStyle}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Page Size</Label>
                <p className="font-medium">
                  {exportConfig.pageSize} ({exportConfig.orientation})
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quality</Label>
                <p className="font-medium">{exportConfig.quality}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Included Content</Label>
              <div className="flex flex-wrap gap-2">
                {exportConfig.includeScoring && <Badge variant="secondary">Scoring</Badge>}
                {exportConfig.includeComments && <Badge variant="secondary">Comments</Badge>}
                {exportConfig.includeRecommendations && <Badge variant="secondary">Recommendations</Badge>}
                {exportConfig.includeIssues && <Badge variant="secondary">Issues</Badge>}
                {exportConfig.includeAttachments && <Badge variant="secondary">Attachments</Badge>}
                {exportConfig.includeImages && <Badge variant="secondary">Images</Badge>}
                {exportConfig.includeCharts && <Badge variant="secondary">Charts</Badge>}
                {exportConfig.includeHistory && <Badge variant="secondary">History</Badge>}
                {exportConfig.includeMetadata && <Badge variant="secondary">Metadata</Badge>}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Document Options</Label>
              <div className="flex flex-wrap gap-2">
                {exportConfig.coverPage && <Badge variant="outline">Cover Page</Badge>}
                {exportConfig.tableOfContents && <Badge variant="outline">Table of Contents</Badge>}
                {exportConfig.pageNumbers && <Badge variant="outline">Page Numbers</Badge>}
                {exportConfig.watermark && <Badge variant="outline">Watermark</Badge>}
                {exportConfig.compression && <Badge variant="outline">Compressed</Badge>}
              </div>
            </div>

            {exportConfig.customTitle && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Custom Title</Label>
                <p className="font-medium">{exportConfig.customTitle}</p>
              </div>
            )}

            {exportConfig.customNotes && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Custom Notes</Label>
                <p className="text-sm">{exportConfig.customNotes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConstructabilityReviewExport
