/**
 * Microsoft Graph API Service Layer - Enhanced with Teams Integration
 * -----------------------------------------------------------------
 * Comprehensive Microsoft 365 integration for enterprise customers:
 * - SharePoint document library operations
 * - Microsoft Teams messaging and channels
 * - Team management and member operations
 * - Microsoft Planner tasks integration
 * - Calendar and meetings integration
 * - Microsoft Project for the web integration
 *
 * Assumes global SSO authentication is handled elsewhere
 */

// =====================================================
// CORE GRAPH API TYPES
// =====================================================

export interface GraphUser {
  id: string
  displayName: string
  userPrincipalName: string
  mail?: string
  jobTitle?: string
  department?: string
  officeLocation?: string
  businessPhones?: string[]
  mobilePhone?: string
  preferredLanguage?: string
  "@odata.context"?: string
}

// =====================================================
// SHAREPOINT TYPES (EXISTING)
// =====================================================

export interface DriveItem {
  id: string
  name: string
  size?: number
  lastModifiedDateTime: string
  file?: {
    mimeType: string
    hashes?: {
      quickXorHash?: string
    }
  }
  folder?: {
    childCount: number
  }
  createdBy?: {
    user: {
      displayName: string
    }
  }
  lastModifiedBy?: {
    user: {
      displayName: string
    }
  }
  webUrl?: string
  downloadUrl?: string
  "@microsoft.graph.downloadUrl"?: string
}

export interface DriveItemsResponse {
  value: DriveItem[]
  "@odata.nextLink"?: string
}

export interface SharePointSite {
  id: string
  name: string
  displayName: string
  webUrl: string
}

export interface DocumentLibrary {
  id: string
  name: string
  displayName: string
  description?: string
  webUrl: string
  driveType: string
}

// =====================================================
// MICROSOFT TEAMS TYPES
// =====================================================

export interface Team {
  id: string
  displayName: string
  description?: string
  visibility: "public" | "private"
  webUrl: string
  createdDateTime: string
  classification?: string
  specialization?: string
  membershipType?: "standard" | "shared"
  tenantId?: string
}

export interface TeamMember {
  id: string
  displayName: string
  email: string
  roles: string[]
  userId: string
  tenantId?: string
}

export interface Channel {
  id: string
  displayName: string
  description?: string
  webUrl: string
  email?: string
  tenantId?: string
  createdDateTime: string
  membershipType: "standard" | "shared" | "private"
}

export interface ChatMessage {
  id: string
  messageType: "message" | "chatEvent" | "unknownFutureValue"
  createdDateTime: string
  lastModifiedDateTime?: string
  body: {
    content: string
    contentType: "text" | "html"
  }
  from: {
    user?: GraphUser
    application?: {
      id: string
      displayName: string
    }
  }
  attachments?: MessageAttachment[]
  mentions?: ChatMessageMention[]
  importance: "normal" | "high" | "urgent"
  subject?: string
  replyToId?: string
  channelIdentity?: {
    teamId: string
    channelId: string
  }
}

export interface MessageAttachment {
  id: string
  contentType: string
  contentUrl?: string
  content?: any
  name?: string
  thumbnailUrl?: string
}

export interface ChatMessageMention {
  id: number
  mentionText: string
  mentioned: {
    user?: GraphUser
  }
}

export interface Chat {
  id: string
  topic?: string
  createdDateTime: string
  lastUpdatedDateTime: string
  chatType: "oneOnOne" | "group" | "meeting" | "unknownFutureValue"
  webUrl?: string
  tenantId?: string
  members?: ChatMember[]
}

export interface ChatMember {
  id: string
  displayName: string
  email?: string
  roles: string[]
  userId: string
  tenantId?: string
}

// =====================================================
// MICROSOFT PLANNER TYPES
// =====================================================

export interface PlannerPlan {
  id: string
  title: string
  owner: string
  createdDateTime: string
  createdBy: {
    user: GraphUser
  }
  container?: {
    containerId: string
    type: string
    url: string
  }
}

export interface PlannerBucket {
  id: string
  name: string
  planId: string
  orderHint: string
}

export interface PlannerTask {
  id: string
  planId: string
  bucketId?: string
  title: string
  orderHint: string
  assigneePriority?: string
  percentComplete: number
  startDateTime?: string
  completedDateTime?: string
  dueDateTime?: string
  hasDescription: boolean
  previewType: string
  completedBy?: GraphUser
  referenceCount: number
  checklistItemCount: number
  activeChecklistItemCount: number
  conversationThreadId?: string
  priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  assignments: Record<string, PlannerAssignment>
  appliedCategories: Record<string, boolean>
  createdBy: GraphUser
  createdDateTime: string
}

export interface PlannerAssignment {
  assignedBy: GraphUser
  assignedDateTime: string
  orderHint: string
}

export interface PlannerTaskDetails {
  id: string
  description?: string
  previewType: string
  references: Record<string, PlannerExternalReference>
  checklist: Record<string, PlannerChecklistItem>
}

export interface PlannerExternalReference {
  alias: string
  type: string
  previewPriority: string
  lastModifiedBy: GraphUser
  lastModifiedDateTime: string
}

export interface PlannerChecklistItem {
  title: string
  isChecked: boolean
  orderHint: string
  lastModifiedBy: GraphUser
  lastModifiedDateTime: string
}

// =====================================================
// CALENDAR TYPES
// =====================================================

export interface CalendarEvent {
  id: string
  subject: string
  body: {
    contentType: "text" | "html"
    content: string
  }
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: {
    displayName: string
    address?: any
  }
  attendees: EventAttendee[]
  organizer: {
    emailAddress: {
      name: string
      address: string
    }
  }
  webLink: string
  onlineMeetingUrl?: string
  isOnlineMeeting: boolean
  onlineMeetingProvider?: string
  importance: "low" | "normal" | "high"
  sensitivity: "normal" | "personal" | "private" | "confidential"
  showAs: "free" | "tentative" | "busy" | "oof" | "workingElsewhere" | "unknown"
  type: "singleInstance" | "occurrence" | "exception" | "seriesMaster"
  createdDateTime: string
  lastModifiedDateTime: string
  categories: string[]
}

export interface EventAttendee {
  type: "required" | "optional" | "resource"
  status: {
    response: "none" | "organizer" | "tentativelyAccepted" | "accepted" | "declined" | "notResponded"
    time: string
  }
  emailAddress: {
    name: string
    address: string
  }
}

// =====================================================
// PROJECT TYPES
// =====================================================

export interface ProjectRoadmap {
  id: string
  name: string
  description?: string
  createdDateTime: string
  lastModifiedDateTime: string
  owner: GraphUser
}

export interface ProjectTask {
  id: string
  name: string
  notes?: string
  startDate?: string
  targetDate?: string
  completionDate?: string
  priority: number
  progress: number
  effort?: number
  remainingWork?: number
  assignments: ProjectAssignment[]
  dependsOn: string[]
  createdDateTime: string
  lastModifiedDateTime: string
}

export interface ProjectAssignment {
  userId: string
  displayName: string
  units: number
}

// =====================================================
// RESPONSE WRAPPER TYPES
// =====================================================

export interface GraphResponse<T> {
  value: T[]
  "@odata.context"?: string
  "@odata.nextLink"?: string
  "@odata.count"?: number
}

// =====================================================
// CONSTRUCTION PROJECT MOCK DATA
// =====================================================

// Mock data for development - Construction project folder structure
const mockDocuments: DriveItem[] = [
  {
    id: "folder-00",
    name: "00-Est",
    lastModifiedDateTime: "2024-01-15T10:30:00Z",
    folder: {
      childCount: 24,
    },
    createdBy: {
      user: {
        displayName: "Estimating Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Sarah Wilson",
      },
    },
  },
  {
    id: "folder-01",
    name: "01-Owner",
    lastModifiedDateTime: "2024-01-20T14:45:00Z",
    folder: {
      childCount: 18,
    },
    createdBy: {
      user: {
        displayName: "Project Manager",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Mike Johnson",
      },
    },
  },
  {
    id: "folder-02",
    name: "02-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0,
    },
    createdBy: {
      user: {
        displayName: "System",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "System",
      },
    },
  },
  {
    id: "folder-03",
    name: "03-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0,
    },
    createdBy: {
      user: {
        displayName: "System",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "System",
      },
    },
  },
  {
    id: "folder-04",
    name: "04-Permit",
    lastModifiedDateTime: "2024-01-25T11:30:00Z",
    folder: {
      childCount: 12,
    },
    createdBy: {
      user: {
        displayName: "Permits Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Alex Chen",
      },
    },
  },
  {
    id: "folder-05",
    name: "05-TestingInspect",
    lastModifiedDateTime: "2024-01-28T16:20:00Z",
    folder: {
      childCount: 31,
    },
    createdBy: {
      user: {
        displayName: "Quality Control",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Tom Brown",
      },
    },
  },
  {
    id: "folder-06",
    name: "06-Meeting",
    lastModifiedDateTime: "2024-01-30T13:45:00Z",
    folder: {
      childCount: 47,
    },
    createdBy: {
      user: {
        displayName: "Project Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Emily Davis",
      },
    },
  },
  {
    id: "folder-07",
    name: "07-RFI",
    lastModifiedDateTime: "2024-01-29T10:15:00Z",
    folder: {
      childCount: 23,
    },
    createdBy: {
      user: {
        displayName: "Project Manager",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "John Smith",
      },
    },
  },
  {
    id: "folder-08",
    name: "08-Safety",
    lastModifiedDateTime: "2024-01-31T08:30:00Z",
    folder: {
      childCount: 15,
    },
    createdBy: {
      user: {
        displayName: "Safety Officer",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Mark Davis",
      },
    },
  },
  {
    id: "folder-09",
    name: "09-DailyReport",
    lastModifiedDateTime: "2024-02-01T17:45:00Z",
    folder: {
      childCount: 89,
    },
    createdBy: {
      user: {
        displayName: "Field Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Lisa Garcia",
      },
    },
  },
  {
    id: "folder-10",
    name: "10-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0,
    },
    createdBy: {
      user: {
        displayName: "System",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "System",
      },
    },
  },
  {
    id: "folder-11",
    name: "11-Schedule",
    lastModifiedDateTime: "2024-01-30T14:20:00Z",
    folder: {
      childCount: 8,
    },
    createdBy: {
      user: {
        displayName: "Scheduling Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "David Miller",
      },
    },
  },
  {
    id: "folder-12",
    name: "12-Accounting",
    lastModifiedDateTime: "2024-01-31T16:30:00Z",
    folder: {
      childCount: 52,
    },
    createdBy: {
      user: {
        displayName: "Accounting Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Jennifer Wilson",
      },
    },
  },
  {
    id: "folder-13",
    name: "13-ChangeOrder",
    lastModifiedDateTime: "2024-01-28T11:45:00Z",
    folder: {
      childCount: 7,
    },
    createdBy: {
      user: {
        displayName: "Project Manager",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Mike Johnson",
      },
    },
  },
  {
    id: "folder-14",
    name: "14-Subcontractor",
    lastModifiedDateTime: "2024-01-29T15:10:00Z",
    folder: {
      childCount: 34,
    },
    createdBy: {
      user: {
        displayName: "Procurement Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Robert Chen",
      },
    },
  },
  {
    id: "folder-15",
    name: "15-Submittal",
    lastModifiedDateTime: "2024-01-30T09:25:00Z",
    folder: {
      childCount: 67,
    },
    createdBy: {
      user: {
        displayName: "Project Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Sarah Wilson",
      },
    },
  },
  {
    id: "folder-16",
    name: "16-DrawSpecPic",
    lastModifiedDateTime: "2024-01-27T12:40:00Z",
    folder: {
      childCount: 156,
    },
    createdBy: {
      user: {
        displayName: "Design Team",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Alex Chen",
      },
    },
  },
  {
    id: "folder-17",
    name: "17-Closeout",
    lastModifiedDateTime: "2024-01-26T10:55:00Z",
    folder: {
      childCount: 3,
    },
    createdBy: {
      user: {
        displayName: "Project Manager",
      },
    },
    lastModifiedBy: {
      user: {
        displayName: "Tom Brown",
      },
    },
  },
]

class MicrosoftGraphService {
  private static instance: MicrosoftGraphService
  private baseUrl = "https://graph.microsoft.com/v1.0"
  private accessToken: string | null = null

  private constructor() {}

  static getInstance(): MicrosoftGraphService {
    if (!MicrosoftGraphService.instance) {
      MicrosoftGraphService.instance = new MicrosoftGraphService()
    }
    return MicrosoftGraphService.instance
  }

  /**
   * Set the access token for Graph API calls
   * In production, this would be handled by the global SSO system
   */
  setAccessToken(token: string) {
    this.accessToken = token
  }

  /**
   * Get headers for Graph API requests
   */
  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<GraphUser> {
    try {
      if (!this.accessToken) {
        // Return mock data for development
        return {
          id: "mock-user-id",
          displayName: "John Doe",
          userPrincipalName: "john.doe@company.com",
        }
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting current user:", error)
      throw error
    }
  }

  /**
   * Get SharePoint sites
   */
  async getSites(): Promise<SharePointSite[]> {
    try {
      if (!this.accessToken) {
        // Return mock data for development
        return [
          {
            id: "mock-site-id",
            name: "Projects",
            displayName: "Project Documents",
            webUrl: "https://company.sharepoint.com/sites/projects",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/sites?search=*`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get sites: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting sites:", error)
      throw error
    }
  }

  /**
   * Get document libraries for a site
   */
  async getDocumentLibraries(siteId: string): Promise<DocumentLibrary[]> {
    try {
      if (!this.accessToken) {
        // Return mock data for development
        return [
          {
            id: "mock-library-id",
            name: "Documents",
            displayName: "Project Documents",
            description: "Main project document library",
            webUrl: "https://company.sharepoint.com/sites/projects/documents",
            driveType: "documentLibrary",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/drives`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get document libraries: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting document libraries:", error)
      throw error
    }
  }

  /**
   * Get documents from a drive/library
   */
  async getDocuments(driveId: string, folderId?: string): Promise<DriveItemsResponse> {
    try {
      if (!this.accessToken) {
        // Return mock data for development
        return {
          value: mockDocuments,
        }
      }

      const endpoint = folderId
        ? `${this.baseUrl}/drives/${driveId}/items/${folderId}/children`
        : `${this.baseUrl}/drives/${driveId}/root/children`

      const response = await fetch(endpoint, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get documents: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting documents:", error)
      throw error
    }
  }

  /**
   * Get project-specific documents
   * This could be enhanced to filter by project metadata or folder structure
   */
  async getProjectDocuments(projectId: string): Promise<DriveItem[]> {
    try {
      // In a real implementation, you might:
      // 1. Search for documents with project metadata
      // 2. Navigate to a project-specific folder
      // 3. Use SharePoint search to find project-related documents

      if (!this.accessToken) {
        // Return all mock documents for development (project-specific folder structure)
        return mockDocuments
      }

      // Example: Search for documents in a project-specific folder
      const sites = await this.getSites()
      const projectSite = sites.find((site) => site.name.toLowerCase().includes("project"))

      if (!projectSite) {
        return []
      }

      const libraries = await this.getDocumentLibraries(projectSite.id)
      const mainLibrary = libraries.find((lib) => lib.name === "Documents")

      if (!mainLibrary) {
        return []
      }

      const documents = await this.getDocuments(mainLibrary.id)
      return documents.value
    } catch (error) {
      console.error("Error getting project documents:", error)
      return []
    }
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(driveId: string, itemId: string): Promise<string> {
    try {
      if (!this.accessToken) {
        // Return mock download URL for development
        return `https://company.sharepoint.com/sites/projects/documents/download/${itemId}`
      }

      const response = await fetch(
        `${this.baseUrl}/drives/${driveId}/items/${itemId}?$select=@microsoft.graph.downloadUrl`,
        {
          headers: this.getHeaders(),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to get download URL: ${response.statusText}`)
      }

      const data = await response.json()
      return data["@microsoft.graph.downloadUrl"]
    } catch (error) {
      console.error("Error getting download URL:", error)
      throw error
    }
  }

  /**
   * Upload a file to SharePoint
   */
  async uploadFile(driveId: string, fileName: string, fileContent: ArrayBuffer): Promise<DriveItem> {
    try {
      if (!this.accessToken) {
        throw new Error("Upload not supported in development mode")
      }

      const response = await fetch(`${this.baseUrl}/drives/${driveId}/root:/${fileName}:/content`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/octet-stream",
        },
        body: fileContent,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  // =====================================================
  // MICROSOFT TEAMS INTEGRATION
  // =====================================================

  /**
   * Get teams for the current user
   */
  async getMyTeams(): Promise<Team[]> {
    try {
      if (!this.accessToken) {
        // Return mock teams for development
        return [
          {
            id: "project-team-001",
            displayName: "Riverside Plaza Project",
            description: "Team for Riverside Plaza construction project coordination",
            visibility: "private",
            webUrl: "https://teams.microsoft.com/l/team/project-team-001",
            createdDateTime: "2024-01-01T00:00:00Z",
            classification: "Project",
            membershipType: "standard",
          },
          {
            id: "estimating-team",
            displayName: "Estimating & Preconstruction",
            description: "Collaboration space for estimating and preconstruction activities",
            visibility: "private",
            webUrl: "https://teams.microsoft.com/l/team/estimating-team",
            createdDateTime: "2023-12-01T00:00:00Z",
            classification: "Department",
            membershipType: "standard",
          },
          {
            id: "safety-team",
            displayName: "Safety & Quality Control",
            description: "Safety coordination and quality control discussions",
            visibility: "private",
            webUrl: "https://teams.microsoft.com/l/team/safety-team",
            createdDateTime: "2023-11-15T00:00:00Z",
            classification: "Department",
            membershipType: "standard",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/me/joinedTeams`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get teams: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting teams:", error)
      throw error
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      if (!this.accessToken) {
        // Return mock team members
        return [
          {
            id: "member-001",
            displayName: "John Smith",
            email: "john.smith@company.com",
            roles: ["owner"],
            userId: "user-001",
          },
          {
            id: "member-002",
            displayName: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            roles: ["member"],
            userId: "user-002",
          },
          {
            id: "member-003",
            displayName: "Mike Wilson",
            email: "mike.wilson@company.com",
            roles: ["member"],
            userId: "user-003",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/teams/${teamId}/members`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get team members: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting team members:", error)
      throw error
    }
  }

  /**
   * Get channels for a team
   */
  async getTeamChannels(teamId: string): Promise<Channel[]> {
    try {
      if (!this.accessToken) {
        // Return mock channels
        return [
          {
            id: "general-channel",
            displayName: "General",
            description: "General team discussions",
            webUrl: `https://teams.microsoft.com/l/channel/general/${teamId}`,
            createdDateTime: "2024-01-01T00:00:00Z",
            membershipType: "standard",
          },
          {
            id: "schedule-channel",
            displayName: "Schedule Updates",
            description: "Project schedule discussions and updates",
            webUrl: `https://teams.microsoft.com/l/channel/schedule/${teamId}`,
            createdDateTime: "2024-01-02T00:00:00Z",
            membershipType: "standard",
          },
          {
            id: "safety-channel",
            displayName: "Safety Alerts",
            description: "Safety-related communications",
            webUrl: `https://teams.microsoft.com/l/channel/safety/${teamId}`,
            createdDateTime: "2024-01-03T00:00:00Z",
            membershipType: "standard",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/teams/${teamId}/channels`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get channels: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting channels:", error)
      throw error
    }
  }

  /**
   * Get messages from a channel
   */
  async getChannelMessages(teamId: string, channelId: string): Promise<ChatMessage[]> {
    try {
      if (!this.accessToken) {
        // Return mock messages
        return [
          {
            id: "msg-001",
            messageType: "message",
            createdDateTime: "2024-01-30T10:00:00Z",
            body: {
              content: "Good morning team! Here's the status update for today's activities.",
              contentType: "text",
            },
            from: {
              user: {
                id: "user-001",
                displayName: "John Smith",
                userPrincipalName: "john.smith@company.com",
              },
            },
            importance: "normal",
            channelIdentity: {
              teamId: teamId,
              channelId: channelId,
            },
          },
          {
            id: "msg-002",
            messageType: "message",
            createdDateTime: "2024-01-30T10:15:00Z",
            body: {
              content: "The concrete pour scheduled for tomorrow is on track. Weather looks favorable.",
              contentType: "text",
            },
            from: {
              user: {
                id: "user-002",
                displayName: "Sarah Johnson",
                userPrincipalName: "sarah.johnson@company.com",
              },
            },
            importance: "normal",
            channelIdentity: {
              teamId: teamId,
              channelId: channelId,
            },
          },
          {
            id: "msg-003",
            messageType: "message",
            createdDateTime: "2024-01-30T10:30:00Z",
            body: {
              content: "⚠️ Safety reminder: Hard hats required in all active work zones. No exceptions.",
              contentType: "text",
            },
            from: {
              user: {
                id: "user-003",
                displayName: "Mike Wilson",
                userPrincipalName: "mike.wilson@company.com",
              },
            },
            importance: "high",
            channelIdentity: {
              teamId: teamId,
              channelId: channelId,
            },
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/teams/${teamId}/channels/${channelId}/messages`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting channel messages:", error)
      throw error
    }
  }

  /**
   * Send a message to a channel
   */
  async sendChannelMessage(
    teamId: string,
    channelId: string,
    content: string,
    importance: "normal" | "high" | "urgent" = "normal"
  ): Promise<ChatMessage> {
    try {
      if (!this.accessToken) {
        // Return mock response for development
        return {
          id: `msg-${Date.now()}`,
          messageType: "message",
          createdDateTime: new Date().toISOString(),
          body: {
            content: content,
            contentType: "text",
          },
          from: {
            user: {
              id: "current-user",
              displayName: "Current User",
              userPrincipalName: "current.user@company.com",
            },
          },
          importance: importance,
          channelIdentity: {
            teamId: teamId,
            channelId: channelId,
          },
        }
      }

      const messageBody = {
        body: {
          content: content,
          contentType: "text",
        },
        importance: importance,
      }

      const response = await fetch(`${this.baseUrl}/teams/${teamId}/channels/${channelId}/messages`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(messageBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  /**
   * Get user's chats
   */
  async getMyChats(): Promise<Chat[]> {
    try {
      if (!this.accessToken) {
        // Return mock chats
        return [
          {
            id: "chat-001",
            topic: "Project Coordination",
            createdDateTime: "2024-01-29T00:00:00Z",
            lastUpdatedDateTime: "2024-01-30T11:30:00Z",
            chatType: "group",
            webUrl: "https://teams.microsoft.com/l/chat/chat-001",
          },
          {
            id: "chat-002",
            topic: "Safety Discussion",
            createdDateTime: "2024-01-28T00:00:00Z",
            lastUpdatedDateTime: "2024-01-30T09:15:00Z",
            chatType: "oneOnOne",
            webUrl: "https://teams.microsoft.com/l/chat/chat-002",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/me/chats`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get chats: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting chats:", error)
      throw error
    }
  }

  // =====================================================
  // MICROSOFT PLANNER INTEGRATION
  // =====================================================

  /**
   * Get planner plans for a group/team
   */
  async getPlannerPlans(groupId: string): Promise<PlannerPlan[]> {
    try {
      if (!this.accessToken) {
        // Return mock plans
        return [
          {
            id: "plan-001",
            title: "Riverside Plaza Project Tasks",
            owner: groupId,
            createdDateTime: "2024-01-01T00:00:00Z",
            createdBy: {
              user: {
                id: "user-001",
                displayName: "John Smith",
                userPrincipalName: "john.smith@company.com",
              },
            },
            container: {
              containerId: groupId,
              type: "group",
              url: `https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner/_djb2_msteams_prefix_${groupId}`,
            },
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/groups/${groupId}/planner/plans`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get planner plans: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting planner plans:", error)
      throw error
    }
  }

  /**
   * Get tasks from a planner plan
   */
  async getPlannerTasks(planId: string): Promise<PlannerTask[]> {
    try {
      if (!this.accessToken) {
        // Return mock tasks
        return [
          {
            id: "task-001",
            planId: planId,
            bucketId: "bucket-001",
            title: "Complete foundation inspection",
            orderHint: "8585074653536706048",
            percentComplete: 0,
            startDateTime: "2024-01-30T08:00:00Z",
            dueDateTime: "2024-01-31T17:00:00Z",
            hasDescription: true,
            previewType: "automatic",
            referenceCount: 0,
            checklistItemCount: 3,
            activeChecklistItemCount: 3,
            priority: 5,
            assignments: {
              "user-002": {
                assignedBy: {
                  id: "user-001",
                  displayName: "John Smith",
                  userPrincipalName: "john.smith@company.com",
                },
                assignedDateTime: "2024-01-30T08:00:00Z",
                orderHint: "8585074653536706048",
              },
            },
            appliedCategories: {
              category1: true,
            },
            createdBy: {
              id: "user-001",
              displayName: "John Smith",
              userPrincipalName: "john.smith@company.com",
            },
            createdDateTime: "2024-01-30T08:00:00Z",
          },
          {
            id: "task-002",
            planId: planId,
            bucketId: "bucket-002",
            title: "Submit weekly progress report",
            orderHint: "8585074653536706049",
            percentComplete: 100,
            completedDateTime: "2024-01-29T16:30:00Z",
            hasDescription: false,
            previewType: "automatic",
            referenceCount: 0,
            checklistItemCount: 0,
            activeChecklistItemCount: 0,
            priority: 3,
            assignments: {
              "user-001": {
                assignedBy: {
                  id: "user-001",
                  displayName: "John Smith",
                  userPrincipalName: "john.smith@company.com",
                },
                assignedDateTime: "2024-01-25T08:00:00Z",
                orderHint: "8585074653536706049",
              },
            },
            appliedCategories: {},
            createdBy: {
              id: "user-001",
              displayName: "John Smith",
              userPrincipalName: "john.smith@company.com",
            },
            createdDateTime: "2024-01-25T08:00:00Z",
            completedBy: {
              id: "user-001",
              displayName: "John Smith",
              userPrincipalName: "john.smith@company.com",
            },
          },
          {
            id: "task-003",
            planId: planId,
            bucketId: "bucket-001",
            title: "Coordinate material delivery",
            orderHint: "8585074653536706050",
            percentComplete: 50,
            startDateTime: "2024-01-31T06:00:00Z",
            dueDateTime: "2024-02-02T12:00:00Z",
            hasDescription: true,
            previewType: "automatic",
            referenceCount: 1,
            checklistItemCount: 2,
            activeChecklistItemCount: 1,
            priority: 7,
            assignments: {
              "user-003": {
                assignedBy: {
                  id: "user-001",
                  displayName: "John Smith",
                  userPrincipalName: "john.smith@company.com",
                },
                assignedDateTime: "2024-01-30T10:00:00Z",
                orderHint: "8585074653536706050",
              },
            },
            appliedCategories: {
              category2: true,
            },
            createdBy: {
              id: "user-001",
              displayName: "John Smith",
              userPrincipalName: "john.smith@company.com",
            },
            createdDateTime: "2024-01-30T10:00:00Z",
          },
        ]
      }

      const response = await fetch(`${this.baseUrl}/planner/plans/${planId}/tasks`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get planner tasks: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting planner tasks:", error)
      throw error
    }
  }

  /**
   * Create a planner task
   */
  async createPlannerTask(
    planId: string,
    title: string,
    bucketId?: string,
    assigneeIds?: string[],
    dueDateTime?: string,
    priority?: number
  ): Promise<PlannerTask> {
    try {
      if (!this.accessToken) {
        // Return mock task for development
        const newTask: PlannerTask = {
          id: `task-${Date.now()}`,
          planId: planId,
          bucketId: bucketId || "bucket-001",
          title: title,
          orderHint: "8585074653536706051",
          percentComplete: 0,
          dueDateTime: dueDateTime,
          hasDescription: false,
          previewType: "automatic",
          referenceCount: 0,
          checklistItemCount: 0,
          activeChecklistItemCount: 0,
          priority: (priority !== undefined ? Math.min(9, Math.max(0, priority)) : 5) as
            | 0
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6
            | 7
            | 8
            | 9,
          assignments: {},
          appliedCategories: {},
          createdBy: {
            id: "current-user",
            displayName: "Current User",
            userPrincipalName: "current.user@company.com",
          },
          createdDateTime: new Date().toISOString(),
        }

        // Add assignments if provided
        if (assigneeIds) {
          assigneeIds.forEach((userId) => {
            newTask.assignments[userId] = {
              assignedBy: {
                id: "current-user",
                displayName: "Current User",
                userPrincipalName: "current.user@company.com",
              },
              assignedDateTime: new Date().toISOString(),
              orderHint: "8585074653536706051",
            }
          })
        }

        return newTask
      }

      const taskBody: any = {
        planId: planId,
        title: title,
        orderHint: " !",
        assignments: {},
      }

      if (bucketId) {
        taskBody.bucketId = bucketId
      }

      if (dueDateTime) {
        taskBody.dueDateTime = dueDateTime
      }

      if (priority !== undefined) {
        taskBody.priority = priority
      }

      if (assigneeIds) {
        assigneeIds.forEach((userId) => {
          taskBody.assignments[userId] = {
            orderHint: " !",
          }
        })
      }

      const response = await fetch(`${this.baseUrl}/planner/tasks`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(taskBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to create planner task: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating planner task:", error)
      throw error
    }
  }

  /**
   * Update planner task progress
   */
  async updatePlannerTaskProgress(taskId: string, percentComplete: number, etag: string): Promise<PlannerTask> {
    try {
      if (!this.accessToken) {
        // Return mock updated task
        return {
          id: taskId,
          planId: "plan-001",
          title: "Updated Task",
          orderHint: "8585074653536706048",
          percentComplete: percentComplete,
          hasDescription: false,
          previewType: "automatic",
          referenceCount: 0,
          checklistItemCount: 0,
          activeChecklistItemCount: 0,
          priority: 5,
          assignments: {},
          appliedCategories: {},
          createdBy: {
            id: "current-user",
            displayName: "Current User",
            userPrincipalName: "current.user@company.com",
          },
          createdDateTime: new Date().toISOString(),
        }
      }

      const response = await fetch(`${this.baseUrl}/planner/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          ...this.getHeaders(),
          "If-Match": etag,
        },
        body: JSON.stringify({
          percentComplete: percentComplete,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update planner task: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating planner task:", error)
      throw error
    }
  }

  // =====================================================
  // CALENDAR INTEGRATION
  // =====================================================

  /**
   * Get calendar events
   */
  async getCalendarEvents(startDateTime?: string, endDateTime?: string): Promise<CalendarEvent[]> {
    try {
      if (!this.accessToken) {
        // Return mock events
        return [
          {
            id: "event-001",
            subject: "Project Kickoff Meeting",
            body: {
              contentType: "text",
              content: "Initial project planning and team introductions",
            },
            start: {
              dateTime: "2024-01-31T09:00:00.0000000",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-31T10:30:00.0000000",
              timeZone: "America/New_York",
            },
            location: {
              displayName: "Conference Room A",
            },
            attendees: [
              {
                type: "required",
                status: {
                  response: "accepted",
                  time: "2024-01-30T14:00:00Z",
                },
                emailAddress: {
                  name: "John Smith",
                  address: "john.smith@company.com",
                },
              },
            ],
            organizer: {
              emailAddress: {
                name: "Project Manager",
                address: "pm@company.com",
              },
            },
            webLink: "https://outlook.office.com/calendar/event-001",
            isOnlineMeeting: true,
            onlineMeetingUrl: "https://teams.microsoft.com/l/meetup-join/event-001",
            onlineMeetingProvider: "teamsForBusiness",
            importance: "high",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            createdDateTime: "2024-01-25T08:00:00Z",
            lastModifiedDateTime: "2024-01-29T10:30:00Z",
            categories: ["Project", "Meeting"],
          },
          {
            id: "event-002",
            subject: "Safety Training Session",
            body: {
              contentType: "text",
              content: "Monthly safety training for all team members",
            },
            start: {
              dateTime: "2024-02-01T14:00:00.0000000",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-02-01T16:00:00.0000000",
              timeZone: "America/New_York",
            },
            location: {
              displayName: "Training Room",
            },
            attendees: [],
            organizer: {
              emailAddress: {
                name: "Safety Manager",
                address: "safety@company.com",
              },
            },
            webLink: "https://outlook.office.com/calendar/event-002",
            isOnlineMeeting: false,
            importance: "normal",
            sensitivity: "normal",
            showAs: "busy",
            type: "singleInstance",
            createdDateTime: "2024-01-20T08:00:00Z",
            lastModifiedDateTime: "2024-01-20T08:00:00Z",
            categories: ["Training", "Safety"],
          },
        ]
      }

      let url = `${this.baseUrl}/me/calendar/events`
      const params = []

      if (startDateTime) {
        params.push(`startDateTime=${startDateTime}`)
      }
      if (endDateTime) {
        params.push(`endDateTime=${endDateTime}`)
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`
      }

      const response = await fetch(url, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`Failed to get calendar events: ${response.statusText}`)
      }

      const data = await response.json()
      return data.value
    } catch (error) {
      console.error("Error getting calendar events:", error)
      throw error
    }
  }

  /**
   * Create a calendar event with Teams meeting
   */
  async createCalendarEvent(
    subject: string,
    start: string,
    end: string,
    attendeeEmails: string[],
    body?: string,
    isOnlineMeeting: boolean = true
  ): Promise<CalendarEvent> {
    try {
      if (!this.accessToken) {
        // Return mock event
        return {
          id: `event-${Date.now()}`,
          subject: subject,
          body: {
            contentType: "text",
            content: body || "",
          },
          start: {
            dateTime: start,
            timeZone: "America/New_York",
          },
          end: {
            dateTime: end,
            timeZone: "America/New_York",
          },
          attendees: attendeeEmails.map((email) => ({
            type: "required" as const,
            status: {
              response: "none" as const,
              time: new Date().toISOString(),
            },
            emailAddress: {
              name: email,
              address: email,
            },
          })),
          organizer: {
            emailAddress: {
              name: "Current User",
              address: "current.user@company.com",
            },
          },
          webLink: `https://outlook.office.com/calendar/event-${Date.now()}`,
          isOnlineMeeting: isOnlineMeeting,
          onlineMeetingUrl: isOnlineMeeting
            ? `https://teams.microsoft.com/l/meetup-join/event-${Date.now()}`
            : undefined,
          onlineMeetingProvider: isOnlineMeeting ? "teamsForBusiness" : undefined,
          importance: "normal",
          sensitivity: "normal",
          showAs: "busy",
          type: "singleInstance",
          createdDateTime: new Date().toISOString(),
          lastModifiedDateTime: new Date().toISOString(),
          categories: [],
        }
      }

      const eventBody = {
        subject: subject,
        body: {
          contentType: "text",
          content: body || "",
        },
        start: {
          dateTime: start,
          timeZone: "America/New_York",
        },
        end: {
          dateTime: end,
          timeZone: "America/New_York",
        },
        attendees: attendeeEmails.map((email) => ({
          type: "required",
          emailAddress: {
            address: email,
            name: email,
          },
        })),
        isOnlineMeeting: isOnlineMeeting,
      }

      const response = await fetch(`${this.baseUrl}/me/calendar/events`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(eventBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to create calendar event: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating calendar event:", error)
      throw error
    }
  }
}

// Export singleton instance
export const microsoftGraphService = MicrosoftGraphService.getInstance()

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getFileIcon = (mimeType?: string, isFolder?: boolean): string => {
  if (isFolder) return "folder"

  if (!mimeType) return "file"

  if (mimeType.includes("word")) return "file-text-2"
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "sheet"
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "presentation"
  if (mimeType.includes("pdf")) return "file-text"
  if (mimeType.includes("image")) return "image"
  if (mimeType.includes("video")) return "video"
  if (mimeType.includes("audio")) return "audio"

  return "file"
}
