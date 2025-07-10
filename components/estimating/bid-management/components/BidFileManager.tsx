/**
 * @fileoverview Bid File Manager Component
 * @version 3.0.0
 * @description Comprehensive bid file management with folder tree, upload/download, and SharePoint integration
 */

"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Progress } from "../../../ui/progress"
import { ScrollArea } from "../../../ui/scroll-area"
import { useToast } from "../../../ui/use-toast"
import {
  FileText,
  Upload,
  Download,
  Folder,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet,
  FileArchive,
  FileVideo,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Share2,
  Trash2,
  Edit,
  Plus,
  ChevronRight,
  ChevronDown,
  Cloud,
  HardDrive,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react"
import { BidAttachment } from "../types/bid-management"

interface BidFileManagerProps {
  projectId: string
  packageId?: string
  allowedTypes?: string[]
  maxFileSize?: number
  className?: string
}

interface FileTreeNode {
  id: string
  name: string
  type: "folder" | "file"
  size?: number
  uploadedBy?: string
  uploadedDate?: string
  sharePointPath?: string
  children?: FileTreeNode[]
  parentId?: string
  isExpanded?: boolean
  mimeType?: string
}

// Mock file tree data
const mockFileTree: FileTreeNode[] = [
  {
    id: "folder-001",
    name: "Project Documents",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "file-001",
        name: "Project_Specifications.pdf",
        type: "file",
        size: 2457600,
        uploadedBy: "Sarah Chen",
        uploadedDate: "2025-01-25T10:30:00Z",
        sharePointPath: "/sites/projects/2525841/documents/Project_Specifications.pdf",
        mimeType: "application/pdf",
      },
      {
        id: "file-002",
        name: "Architectural_Drawings.dwg",
        type: "file",
        size: 15728640,
        uploadedBy: "Michael Rodriguez",
        uploadedDate: "2025-01-24T14:15:00Z",
        sharePointPath: "/sites/projects/2525841/documents/Architectural_Drawings.dwg",
        mimeType: "application/dwg",
      },
    ],
  },
  {
    id: "folder-002",
    name: "Bid Responses",
    type: "folder",
    isExpanded: false,
    children: [
      {
        id: "folder-003",
        name: "Ace Construction Co",
        type: "folder",
        children: [
          {
            id: "file-003",
            name: "Bid_Proposal_ACE_001.pdf",
            type: "file",
            size: 1245870,
            uploadedBy: "Mike Johnson",
            uploadedDate: "2025-01-25T16:45:00Z",
            mimeType: "application/pdf",
          },
          {
            id: "file-004",
            name: "Insurance_Certificate.pdf",
            type: "file",
            size: 425123,
            uploadedBy: "Mike Johnson",
            uploadedDate: "2025-01-25T16:50:00Z",
            mimeType: "application/pdf",
          },
        ],
      },
      {
        id: "folder-004",
        name: "Superior Builders LLC",
        type: "folder",
        children: [
          {
            id: "file-005",
            name: "Bid_Proposal_SBL_001.xlsx",
            type: "file",
            size: 987654,
            uploadedBy: "Lisa Anderson",
            uploadedDate: "2025-01-26T11:20:00Z",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      },
    ],
  },
  {
    id: "folder-005",
    name: "Addenda",
    type: "folder",
    isExpanded: false,
    children: [
      {
        id: "file-006",
        name: "Addendum_001.pdf",
        type: "file",
        size: 156789,
        uploadedBy: "Sarah Chen",
        uploadedDate: "2025-01-28T13:00:00Z",
        sharePointPath: "/sites/projects/2525841/addenda/Addendum_001.pdf",
        mimeType: "application/pdf",
      },
    ],
  },
]

const BidFileManager: React.FC<BidFileManagerProps> = ({
  projectId,
  packageId,
  allowedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".dwg", ".jpg", ".png"],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  className = "",
}) => {
  const { toast } = useToast()
  const [fileTree, setFileTree] = useState<FileTreeNode[]>(mockFileTree)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Get file icon based on mime type
  const getFileIcon = (mimeType?: string, type?: string) => {
    if (type === "folder") return Folder
    if (!mimeType) return File

    if (mimeType.includes("pdf")) return FileText
    if (mimeType.includes("image")) return Image
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return FileSpreadsheet
    if (mimeType.includes("video")) return FileVideo
    if (mimeType.includes("zip") || mimeType.includes("archive")) return FileArchive
    return FileText
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
      return nodes.map((node) => {
        if (node.id === folderId) {
          return { ...node, isExpanded: !node.isExpanded }
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) }
        }
        return node
      })
    }
    setFileTree(updateTree(fileTree))
  }

  // Get flattened file list for table view
  const getFlatFileList = useMemo(() => {
    const flattenTree = (nodes: FileTreeNode[], path: string[] = []): (FileTreeNode & { path: string[] })[] => {
      let result: (FileTreeNode & { path: string[] })[] = []

      nodes.forEach((node) => {
        const currentPath = [...path, node.name]
        result.push({ ...node, path: currentPath })

        if (node.type === "folder" && node.isExpanded && node.children) {
          result = result.concat(flattenTree(node.children, currentPath))
        }
      })

      return result
    }

    const flattened = flattenTree(fileTree)

    // Filter by search query
    if (searchQuery) {
      return flattened.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return flattened
  }, [fileTree, searchQuery])

  // Handle file selection
  const handleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload Complete",
            description: `${files.length} file(s) uploaded successfully.`,
          })
          setShowUploadDialog(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  // Handle download
  const handleDownload = (file: FileTreeNode) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}...`,
    })
  }

  // Render file tree
  const renderFileTree = (nodes: FileTreeNode[], level = 0) => {
    return nodes.map((node) => {
      const IconComponent = getFileIcon(node.mimeType, node.type)

      return (
        <div key={node.id} style={{ marginLeft: `${level * 20}px` }}>
          <div
            className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedFiles.includes(node.id) ? "bg-blue-50 dark:bg-blue-950" : ""
            }`}
            onClick={() => {
              if (node.type === "folder") {
                toggleFolder(node.id)
              } else {
                handleFileSelection(node.id)
              }
            }}
          >
            {node.type === "folder" && (
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                {node.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}
            {node.type === "file" && <div className="w-4" />}
            <IconComponent className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{node.name}</span>
            {node.type === "file" && (
              <span className="text-xs text-muted-foreground ml-auto">{formatFileSize(node.size || 0)}</span>
            )}
          </div>

          {node.type === "folder" && node.isExpanded && node.children && (
            <div>{renderFileTree(node.children, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card
        className={`transition-colors ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              File Manager
              <Badge variant="secondary" className="ml-2">
                {getFlatFileList.filter((f) => f.type === "file").length} files
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedFiles.length === 0}
                onClick={() => {
                  const selectedFile = getFlatFileList.find((f) => f.id === selectedFiles[0])
                  if (selectedFile) handleDownload(selectedFile)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="tree" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tree">Tree View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="tree" className="space-y-4">
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-blue-950 bg-opacity-90 z-10">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-600 font-medium">Drop files here to upload</p>
                    </div>
                  </div>
                )}
                <div className="space-y-1">{renderFileTree(fileTree)}</div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFlatFileList.map((file) => {
                    const IconComponent = getFileIcon(file.mimeType, file.type)
                    return (
                      <TableRow key={file.id}>
                        <TableCell>
                          {file.type === "file" && (
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleFileSelection(file.id)}
                              className="rounded border-gray-300"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{file.name}</span>
                            {file.sharePointPath && (
                              <Badge variant="outline" className="text-xs">
                                <Cloud className="h-3 w-3 mr-1" />
                                SharePoint
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{file.type}</Badge>
                        </TableCell>
                        <TableCell>{file.size ? formatFileSize(file.size) : "-"}</TableCell>
                        <TableCell>{file.uploadedBy || "-"}</TableCell>
                        <TableCell>{file.uploadedDate ? formatDate(file.uploadedDate) : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {file.type === "file" && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept={allowedTypes.join(",")}
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files)
                  }
                }}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Allowed types: {allowedTypes.join(", ")} | Max size: {formatFileSize(maxFileSize)}
              </p>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BidFileManager
