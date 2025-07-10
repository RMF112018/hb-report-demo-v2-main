import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SharePointFilesTabProps {
  bidPackageId: string
  bidPackageName: string
}

export const SharePointFilesTab: React.FC<SharePointFilesTabProps> = ({ bidPackageId, bidPackageName }) => {
  const [selectedFolder, setSelectedFolder] = useState("submissions")

  return (
    <div className="space-y-6">
      {/* SharePoint Integration Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.5,2.5h7C20.9,2.5,22,3.6,22,5v14c0,1.4-1.1,2.5-2.5,2.5h-15C3.1,21.5,2,20.4,2,19V5c0-1.4,1.1-2.5,2.5-2.5H12.5z M12.5,8h7C20.3,8,21,8.7,21,9.5S20.3,11,19.5,11h-7C11.7,11,11,10.3,11,9.5S11.7,8,12.5,8z M12.5,13h7c0.8,0,1.5,0.7,1.5,1.5S20.3,16,19.5,16h-7c-0.8,0-1.5-0.7-1.5-1.5S11.7,13,12.5,13z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">SharePoint Document Library</h3>
            <p className="text-sm text-muted-foreground">
              Microsoft Graph API Integration • {bidPackageName} Bid Package
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Connected
          </Badge>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Upload Files
          </Button>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            New Folder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Folder Structure */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Folder Structure</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted cursor-pointer">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-sm font-medium">📁 {bidPackageName}</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted cursor-pointer">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm">📄 Specifications</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted cursor-pointer">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm">📋 Proposals</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      3
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted cursor-pointer">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm">📑 Drawings</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 px-2 rounded bg-blue-50 border-l-2 border-blue-600 cursor-pointer dark:bg-blue-900 dark:border-blue-400">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm font-medium">📤 Submissions</span>
                    <Badge variant="default" className="text-xs ml-auto">
                      1
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-muted cursor-pointer">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-sm">💬 Communications</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graph API Status */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Microsoft Graph API</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Connection Status</span>
                <Badge variant="outline" className="text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Sync</span>
                <span className="text-xs">2 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">API Version</span>
                <span className="text-xs">v1.0</span>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                View Permissions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - File List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base">Submissions Folder</CardTitle>
                <CardDescription className="text-sm">/{bidPackageName}/Submissions • SharePoint Online</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mb-6 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag and drop files here</p>
                    <p className="text-xs text-muted-foreground">
                      Files uploaded here are automatically synced to SharePoint
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Upload Files
                    </Button>
                    <span className="text-xs text-muted-foreground">or</span>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                      Connect to OneDrive
                    </Button>
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 py-2 px-3 text-xs font-medium text-muted-foreground border-b">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-2">Modified</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-1">Shared</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Deatrick Engineering Associates File */}
                <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-muted/50 rounded-md items-center">
                  <div className="col-span-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Materials Testing Proposal - Deatrick Engineering.pdf</div>
                      <div className="text-xs text-muted-foreground">Proposal • $178,994.58</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">3/18/2025</div>
                  <div className="col-span-2 text-sm text-muted-foreground">2.4 MB</div>
                  <div className="col-span-1">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center text-xs text-white font-medium">
                        K
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center text-xs text-white font-medium">
                        W
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Specifications File */}
                <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-muted/50 rounded-md items-center">
                  <div className="col-span-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Testing Specifications.docx</div>
                      <div className="text-xs text-muted-foreground">Project requirements • Updated by W. Stan</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">3/15/2025</div>
                  <div className="col-span-2 text-sm text-muted-foreground">156 KB</div>
                  <div className="col-span-1">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-background flex items-center justify-center text-xs text-white font-medium">
                        S
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Addendum File */}
                <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-muted/50 rounded-md items-center">
                  <div className="col-span-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-orange-600 dark:text-orange-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Addendum #1 - Clarifications.pdf</div>
                      <div className="text-xs text-muted-foreground">Project clarification • Shared via link</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">3/16/2025</div>
                  <div className="col-span-2 text-sm text-muted-foreground">842 KB</div>
                  <div className="col-span-1">
                    <Badge variant="outline" className="text-xs">
                      <svg
                        className="w-3 h-3 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      Public
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* SharePoint Integration Footer */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.5,2.5h7C20.9,2.5,22,3.6,22,5v14c0,1.4-1.1,2.5-2.5,2.5h-15C3.1,21.5,2,20.4,2,19V5c0-1.4,1.1-2.5,2.5-2.5H12.5z" />
                      </svg>
                    </div>
                    <span>Synced with SharePoint Online</span>
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span>3 files • 3.4 MB total</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <svg
                        className="w-3 h-3 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                      Share Folder
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SharePointFilesTab
