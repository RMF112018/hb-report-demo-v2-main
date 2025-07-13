"use client"

import React, { useState, useMemo } from "react"
import { useSharePointDocs } from "@/hooks/useSharePointDocs"
import { formatFileSize, getFileIcon, type DriveItem } from "@/lib/msgraph"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Folder,
  FileText,
  Sheet,
  Presentation,
  Image,
  Video,
  Music,
  Download,
  ExternalLink,
  MoreVertical,
  Search,
  RefreshCw,
  Upload,
  Share2,
  Copy,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  List,
  Grid3X3,
  SortAsc,
  SortDesc,
  Info,
  FolderPlus,
  Filter,
  Settings,
  Eye,
  CheckSquare,
  Square,
} from "lucide-react"

interface SharePointLibraryViewerProps {
  projectId?: string
  projectName?: string
  projectData?: any
  className?: string
}

/**
 * SharePoint Library Viewer Component
 * ----------------------------------
 * Displays project documents from SharePoint with:
 * - File browsing and search
 * - Download functionality
 * - Modern table interface
 * - Light/dark mode support
 */
export const SharePointLibraryViewer: React.FC<SharePointLibraryViewerProps> = ({
  projectId,
  projectName,
  projectData,
  className = "",
}) => {
  const { documents, loading, error, refresh, downloadDocument, searchDocuments } = useSharePointDocs(projectId)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState<"list" | "grid">("list")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  // Determine default folder based on project stage
  const getDefaultFolder = () => {
    if (projectData?.project_stage_name === "Construction") {
      return "Root"
    }
    return "00-Est"
  }

  const [currentFolder, setCurrentFolder] = useState<string>(getDefaultFolder())

  // Set initial navigation history based on project stage
  const getInitialNavigation = () => {
    if (projectData?.project_stage_name === "Construction") {
      return {
        history: ["Root"],
        index: 0,
      }
    }
    return {
      history: ["Root", "00-Est"],
      index: 1,
    }
  }

  const initialNav = getInitialNavigation()
  const [navigationHistory, setNavigationHistory] = useState<string[]>(initialNav.history)
  const [historyIndex, setHistoryIndex] = useState(initialNav.index)
  const [showFilters, setShowFilters] = useState(false)

  // Mock bid package estimation folders data
  const mockEstimationFolders = useMemo(
    () => [
      {
        id: "folder-01-finaldeliver",
        name: "01 FinalDeliver",
        folder: { childCount: 15 },
        lastModifiedDateTime: "2025-01-06T10:30:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-02-biddoc",
        name: "02 BidDoc",
        folder: { childCount: 8 },
        lastModifiedDateTime: "2025-01-06T14:15:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-03-estsummary",
        name: "03 EstSummary",
        folder: { childCount: 12 },
        lastModifiedDateTime: "2025-01-06T09:45:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-04-qualifications",
        name: "04 Qualifications",
        folder: { childCount: 6 },
        lastModifiedDateTime: "2025-01-06T16:20:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-06-bidscopes",
        name: "06 Bid Scopes",
        folder: { childCount: 23 },
        lastModifiedDateTime: "2025-01-06T11:30:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-07-subproposal",
        name: "07 SubProposal",
        folder: { childCount: 18 },
        lastModifiedDateTime: "2025-01-06T13:10:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-08-takeoffs",
        name: "08 Takeoffs",
        folder: { childCount: 34 },
        lastModifiedDateTime: "2024-08-19T15:25:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-10-sitelogistics",
        name: "10 SiteLogistics",
        folder: { childCount: 7 },
        lastModifiedDateTime: "2024-08-19T12:40:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-12-projectturnover",
        name: "12 ProjectTurnover",
        folder: { childCount: 9 },
        lastModifiedDateTime: "2025-01-06T08:55:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
      {
        id: "folder-12-accounting",
        name: "12-Accounting",
        folder: { childCount: 14 },
        lastModifiedDateTime: "2025-01-06T17:30:00Z",
        lastModifiedBy: { user: { displayName: "Sarah Mitchell" } },
        size: 0,
        webUrl: "#",
      },
    ],
    []
  )

  // Override documents based on folder and project stage
  const getDisplayDocuments = React.useCallback(() => {
    // For Bidding projects or when explicitly in 00-Est folder, show estimation folders
    if (currentFolder === "00-Est") {
      return mockEstimationFolders
    }
    // For Construction projects at Root, or any other folder, show real documents
    return documents || []
  }, [currentFolder, documents, mockEstimationFolders])

  // Filter and sort documents based on search query and sort options
  const filteredDocuments = useMemo(() => {
    let docs = getDisplayDocuments()

    // Apply search filter
    if (searchQuery) {
      docs = docs.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort documents
    docs.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "modified":
          comparison = new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime()
          break
        case "size":
          comparison = (a.size || 0) - (b.size || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return docs
  }, [getDisplayDocuments, searchQuery, sortBy, sortOrder, currentFolder])

  // Get file icon component
  const getFileIconComponent = (document: DriveItem) => {
    const iconType = getFileIcon(document.file?.mimeType, !!document.folder)
    const iconClass = "h-4 w-4"

    switch (iconType) {
      case "folder":
        return <Folder className={`${iconClass} text-blue-500`} />
      case "file-text-2":
        return <FileText className={`${iconClass} text-blue-600`} />
      case "sheet":
        return <Sheet className={`${iconClass} text-green-600`} />
      case "presentation":
        return <Presentation className={`${iconClass} text-orange-600`} />
      case "file-text":
        return <FileText className={`${iconClass} text-red-600`} />
      case "image":
        return <Image className={`${iconClass} text-purple-600`} />
      case "video":
        return <Video className={`${iconClass} text-pink-600`} />
      case "audio":
        return <Music className={`${iconClass} text-indigo-600`} />
      default:
        return <FileText className={`${iconClass} text-gray-600`} />
    }
  }

  // Handle document download
  const handleDownload = async (document: DriveItem) => {
    if (document.folder) {
      // Demo: Navigate to estimation folder
      const newFolder = document.name
      const newHistory = [...navigationHistory.slice(0, historyIndex + 1), newFolder]
      setNavigationHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      setCurrentFolder(newFolder)

      // Show specific content based on folder type
      let folderDescription = ""
      switch (newFolder) {
        case "01 FinalDeliver":
          folderDescription = "Final deliverable documents including contracts, bonds, and project closeout materials"
          break
        case "02 BidDoc":
          folderDescription = "Bid documentation including specifications, drawings, and addenda"
          break
        case "03 EstSummary":
          folderDescription = "Estimation summary reports, cost breakdowns, and analysis documents"
          break
        case "04 Qualifications":
          folderDescription = "Contractor qualifications, certifications, and capability statements"
          break
        case "06 Bid Scopes":
          folderDescription = "Detailed scope documents for each trade and work package"
          break
        case "07 SubProposal":
          folderDescription = "Subcontractor proposals, quotes, and vendor responses"
          break
        case "08 Takeoffs":
          folderDescription = "Quantity takeoffs, measurements, and calculation worksheets"
          break
        case "10 SiteLogistics":
          folderDescription = "Site logistics plans, traffic control, and safety documentation"
          break
        case "12 ProjectTurnover":
          folderDescription = "Project turnover documentation and closeout procedures"
          break
        case "12-Accounting":
          folderDescription = "Project accounting files, cost tracking, and financial reports"
          break
        default:
          folderDescription = "Project documents and files"
      }

      alert(
        `Demo: Navigated to "${newFolder}"\n\n${folderDescription}\n\nIn a real implementation, this would load the folder contents with relevant documents.`
      )
      return
    }

    await downloadDocument(document.id)
  }

  // Handle external link opening
  const handleOpenExternal = (document: DriveItem) => {
    if (document.webUrl) {
      window.open(document.webUrl, "_blank")
    }
  }

  // Handle item selection
  const handleItemSelection = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems)
    if (selected) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(filteredDocuments.map((doc) => doc.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  // Handle bulk download
  const handleBulkDownload = async () => {
    for (const itemId of selectedItems) {
      await downloadDocument(itemId)
    }
  }

  // Handle sort change
  const handleSort = (column: "name" | "modified" | "size") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Handle navigation
  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentFolder(navigationHistory[historyIndex - 1])
    }
  }

  const handleNavigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentFolder(navigationHistory[historyIndex + 1])
    }
  }

  const handleNavigateUp = () => {
    if (currentFolder === "00-Est") {
      const newFolder = "Root"
      const newHistory = ["Root"]
      setNavigationHistory(newHistory)
      setHistoryIndex(0)
      setCurrentFolder(newFolder)
      alert("Demo: Navigated back to Root directory")
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Demo: Show success message
    const fileNames = Array.from(files)
      .map((f) => f.name)
      .join(", ")
    alert(`Demo: Files "${fileNames}" would be uploaded to ${currentFolder}`)

    // Reset input
    event.target.value = ""
    setShowUploadDialog(false)

    // Refresh documents (in real app, this would update the list)
    refresh()
  }

  // Handle bulk share
  const handleBulkShare = () => {
    const selectedDocs = filteredDocuments.filter((doc) => selectedItems.has(doc.id))
    const docNames = selectedDocs.map((doc) => doc.name).join(", ")
    alert(`Demo: Sharing "${docNames}" with team members`)
  }

  // Handle new folder creation
  const handleNewFolder = () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      alert(`Demo: Folder "${folderName}" would be created in ${currentFolder}`)
      refresh()
    }
  }

  // Handle file info
  const handleFileInfo = () => {
    if (selectedItems.size === 1) {
      const doc = filteredDocuments.find((d) => selectedItems.has(d.id))
      if (doc) {
        alert(
          `Demo: File Info for "${doc.name}"\n\nSize: ${
            doc.size ? formatFileSize(doc.size) : "Unknown"
          }\nModified: ${formatDate(doc.lastModifiedDateTime)}\nModified By: ${
            doc.lastModifiedBy?.user.displayName || "Unknown"
          }`
        )
      }
    } else {
      alert("Demo: Select exactly one item to view info")
    }
  }

  // Handle library settings
  const handleLibrarySettings = () => {
    alert("Demo: Library settings would open here\n\n• Permissions\n• Versioning\n• Content types\n• Column settings")
  }

  // Handle view options
  const handleViewOptions = () => {
    alert("Demo: View options would open here\n\n• Sort options\n• Group by\n• Filter pane\n• Column width")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="space-y-4 px-0">
        {/* Current Path Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
          <Folder className="h-4 w-4" />
          <span>SharePoint</span>
          <ChevronRight className="h-3 w-3" />
          <span>{projectName || "Project Files"}</span>
          {projectData?.project_stage_name && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-xs px-2 py-1 bg-muted/50 rounded">{projectData.project_stage_name}</span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{currentFolder}</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between gap-4 py-2 border-t border-border">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleNavigateBack} disabled={historyIndex <= 0} title="Back">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateForward}
              disabled={historyIndex >= navigationHistory.length - 1}
              title="Forward"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNavigateUp} disabled={currentFolder === "Root"} title="Up">
              <ChevronUp className="h-4 w-4" />
            </Button>

            {/* Current folder indicator */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Current:</span>
              <Badge variant="outline" className="text-xs">
                {currentFolder}
              </Badge>
            </div>

            <div className="h-4 w-px bg-border mx-2" />

            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload files"
              />
              <Button variant="ghost" size="sm" className="text-xs">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>

          {/* Selection & Actions */}
          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs">
                  {selectedItems.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDownload}
                  className="text-xs"
                  title="Download selected"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={handleBulkShare} className="text-xs" title="Share selected">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems(new Set())}
                  className="text-xs"
                  title="Clear selection"
                >
                  Clear
                </Button>
              </>
            )}

            <div className="h-4 w-px bg-border mx-2" />

            {/* View Controls */}
            <Button
              variant={selectedView === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedView("list")}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedView === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedView("grid")
                alert("Demo: Grid view would show thumbnail previews of documents")
              }}
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-border mx-2" />

            {/* Additional Actions */}
            <Button variant="ghost" size="sm" onClick={handleNewFolder} title="New folder">
              <FolderPlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFileInfo} title="File information">
              <Info className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" title="More options">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLibrarySettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Library Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewOptions}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Options
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Demo: Export to Excel functionality")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Demo: Create alert for library changes")}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Create Alert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-border p-4 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">File Type:</label>
                <select className="text-sm border border-border rounded-md px-2 py-1 bg-background">
                  <option value="">All</option>
                  <option value="folder">Folders</option>
                  <option value="document">Documents</option>
                  <option value="image">Images</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Modified:</label>
                <select className="text-sm border border-border rounded-md px-2 py-1 bg-background">
                  <option value="">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => alert("Demo: Filters applied")} className="text-xs">
                Apply Filters
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 px-0">
        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        )}

        {/* Documents Table */}
        {!loading && !error && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleSelectAll(selectedItems.size !== filteredDocuments.length)}
                    >
                      {selectedItems.size === filteredDocuments.length && filteredDocuments.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("modified")}
                    >
                      Modified
                      {sortBy === "modified" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Modified By</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("size")}
                    >
                      Size
                      {sortBy === "size" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="ml-1 h-3 w-3" />
                        ) : (
                          <SortDesc className="ml-1 h-3 w-3" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No documents match your search." : "No documents found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow
                      key={document.id}
                      className={`hover:bg-muted/50 cursor-pointer ${
                        selectedItems.has(document.id) ? "bg-muted/30" : ""
                      }`}
                      onClick={() => handleDownload(document)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleItemSelection(document.id, !selectedItems.has(document.id))}
                        >
                          {selectedItems.has(document.id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell>{getFileIconComponent(document)}</TableCell>

                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{document.name}</span>
                          {document.folder && (
                            <Badge variant="outline" className="text-xs">
                              {document.folder.childCount} items
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(document.lastModifiedDateTime)}
                        </div>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {document.lastModifiedBy?.user.displayName || "Unknown"}
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {document.size ? formatFileSize(document.size) : "-"}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(document)
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>

                            {document.webUrl && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenExternal(document)
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in SharePoint
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem disabled>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>

                            <DropdownMenuItem disabled>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer Info */}
        {!loading && !error && filteredDocuments.length > 0 && (
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>
              {filteredDocuments.length} {currentFolder === "00-Est" ? "estimation folder" : "document"}
              {filteredDocuments.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
              {currentFolder === "00-Est" && " in estimation directory"}
              {currentFolder === "Root" &&
                projectData?.project_stage_name === "Construction" &&
                " in construction project"}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                SharePoint Connected
              </Badge>
              {currentFolder === "00-Est" && (
                <Badge variant="secondary" className="text-xs">
                  Estimation Workspace
                </Badge>
              )}
              {currentFolder === "Root" && projectData?.project_stage_name === "Construction" && (
                <Badge variant="secondary" className="text-xs">
                  Construction Documents
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
