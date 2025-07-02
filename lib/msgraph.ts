/**
 * Microsoft Graph API Service Layer
 * ---------------------------------
 * Handles SharePoint document library operations via Microsoft Graph API
 * Assumes global SSO authentication is handled elsewhere
 */

// Types for Microsoft Graph API responses
export interface GraphUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
}

export interface DriveItem {
  id: string;
  name: string;
  size?: number;
  lastModifiedDateTime: string;
  file?: {
    mimeType: string;
    hashes?: {
      quickXorHash?: string;
    };
  };
  folder?: {
    childCount: number;
  };
  createdBy?: {
    user: {
      displayName: string;
    };
  };
  lastModifiedBy?: {
    user: {
      displayName: string;
    };
  };
  webUrl?: string;
  downloadUrl?: string;
  "@microsoft.graph.downloadUrl"?: string;
}

export interface DriveItemsResponse {
  value: DriveItem[];
  "@odata.nextLink"?: string;
}

export interface SharePointSite {
  id: string;
  name: string;
  displayName: string;
  webUrl: string;
}

export interface DocumentLibrary {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  webUrl: string;
  driveType: string;
}

// Mock data for development - Construction project folder structure
const mockDocuments: DriveItem[] = [
  {
    id: "folder-00",
    name: "00-Est",
    lastModifiedDateTime: "2024-01-15T10:30:00Z",
    folder: {
      childCount: 24
    },
    createdBy: {
      user: {
        displayName: "Estimating Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Sarah Wilson"
      }
    }
  },
  {
    id: "folder-01",
    name: "01-Owner",
    lastModifiedDateTime: "2024-01-20T14:45:00Z",
    folder: {
      childCount: 18
    },
    createdBy: {
      user: {
        displayName: "Project Manager"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Mike Johnson"
      }
    }
  },
  {
    id: "folder-02",
    name: "02-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0
    },
    createdBy: {
      user: {
        displayName: "System"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "System"
      }
    }
  },
  {
    id: "folder-03",
    name: "03-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0
    },
    createdBy: {
      user: {
        displayName: "System"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "System"
      }
    }
  },
  {
    id: "folder-04",
    name: "04-Permit",
    lastModifiedDateTime: "2024-01-25T11:30:00Z",
    folder: {
      childCount: 12
    },
    createdBy: {
      user: {
        displayName: "Permits Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Alex Chen"
      }
    }
  },
  {
    id: "folder-05",
    name: "05-TestingInspect",
    lastModifiedDateTime: "2024-01-28T16:20:00Z",
    folder: {
      childCount: 31
    },
    createdBy: {
      user: {
        displayName: "Quality Control"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Tom Brown"
      }
    }
  },
  {
    id: "folder-06",
    name: "06-Meeting",
    lastModifiedDateTime: "2024-01-30T13:45:00Z",
    folder: {
      childCount: 47
    },
    createdBy: {
      user: {
        displayName: "Project Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Emily Davis"
      }
    }
  },
  {
    id: "folder-07",
    name: "07-RFI",
    lastModifiedDateTime: "2024-01-29T10:15:00Z",
    folder: {
      childCount: 23
    },
    createdBy: {
      user: {
        displayName: "Project Manager"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "John Smith"
      }
    }
  },
  {
    id: "folder-08",
    name: "08-Safety",
    lastModifiedDateTime: "2024-01-31T08:30:00Z",
    folder: {
      childCount: 15
    },
    createdBy: {
      user: {
        displayName: "Safety Officer"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Mark Davis"
      }
    }
  },
  {
    id: "folder-09",
    name: "09-DailyReport",
    lastModifiedDateTime: "2024-02-01T17:45:00Z",
    folder: {
      childCount: 89
    },
    createdBy: {
      user: {
        displayName: "Field Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Lisa Garcia"
      }
    }
  },
  {
    id: "folder-10",
    name: "10-{Blank}",
    lastModifiedDateTime: "2024-01-10T09:00:00Z",
    folder: {
      childCount: 0
    },
    createdBy: {
      user: {
        displayName: "System"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "System"
      }
    }
  },
  {
    id: "folder-11",
    name: "11-Schedule",
    lastModifiedDateTime: "2024-01-30T14:20:00Z",
    folder: {
      childCount: 8
    },
    createdBy: {
      user: {
        displayName: "Scheduling Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "David Miller"
      }
    }
  },
  {
    id: "folder-12",
    name: "12-Accounting",
    lastModifiedDateTime: "2024-01-31T16:30:00Z",
    folder: {
      childCount: 52
    },
    createdBy: {
      user: {
        displayName: "Accounting Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Jennifer Wilson"
      }
    }
  },
  {
    id: "folder-13",
    name: "13-ChangeOrder",
    lastModifiedDateTime: "2024-01-28T11:45:00Z",
    folder: {
      childCount: 7
    },
    createdBy: {
      user: {
        displayName: "Project Manager"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Mike Johnson"
      }
    }
  },
  {
    id: "folder-14",
    name: "14-Subcontractor",
    lastModifiedDateTime: "2024-01-29T15:10:00Z",
    folder: {
      childCount: 34
    },
    createdBy: {
      user: {
        displayName: "Procurement Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Robert Chen"
      }
    }
  },
  {
    id: "folder-15",
    name: "15-Submittal",
    lastModifiedDateTime: "2024-01-30T09:25:00Z",
    folder: {
      childCount: 67
    },
    createdBy: {
      user: {
        displayName: "Project Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Sarah Wilson"
      }
    }
  },
  {
    id: "folder-16",
    name: "16-DrawSpecPic",
    lastModifiedDateTime: "2024-01-27T12:40:00Z",
    folder: {
      childCount: 156
    },
    createdBy: {
      user: {
        displayName: "Design Team"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Alex Chen"
      }
    }
  },
  {
    id: "folder-17",
    name: "17-Closeout",
    lastModifiedDateTime: "2024-01-26T10:55:00Z",
    folder: {
      childCount: 3
    },
    createdBy: {
      user: {
        displayName: "Project Manager"
      }
    },
    lastModifiedBy: {
      user: {
        displayName: "Tom Brown"
      }
    }
  }
];

class MicrosoftGraphService {
  private static instance: MicrosoftGraphService;
  private baseUrl = 'https://graph.microsoft.com/v1.0';
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): MicrosoftGraphService {
    if (!MicrosoftGraphService.instance) {
      MicrosoftGraphService.instance = new MicrosoftGraphService();
    }
    return MicrosoftGraphService.instance;
  }

  /**
   * Set the access token for Graph API calls
   * In production, this would be handled by the global SSO system
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Get headers for Graph API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
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
          userPrincipalName: "john.doe@company.com"
        };
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
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
            webUrl: "https://company.sharepoint.com/sites/projects"
          }
        ];
      }

      const response = await fetch(`${this.baseUrl}/sites?search=*`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get sites: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error getting sites:', error);
      throw error;
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
            driveType: "documentLibrary"
          }
        ];
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/drives`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get document libraries: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error getting document libraries:', error);
      throw error;
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
          value: mockDocuments
        };
      }

      const endpoint = folderId 
        ? `${this.baseUrl}/drives/${driveId}/items/${folderId}/children`
        : `${this.baseUrl}/drives/${driveId}/root/children`;

      const response = await fetch(endpoint, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get documents: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
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
        return mockDocuments;
      }

      // Example: Search for documents in a project-specific folder
      const sites = await this.getSites();
      const projectSite = sites.find(site => site.name.toLowerCase().includes('project'));
      
      if (!projectSite) {
        return [];
      }

      const libraries = await this.getDocumentLibraries(projectSite.id);
      const mainLibrary = libraries.find(lib => lib.name === 'Documents');
      
      if (!mainLibrary) {
        return [];
      }

      const documents = await this.getDocuments(mainLibrary.id);
      return documents.value;
    } catch (error) {
      console.error('Error getting project documents:', error);
      return [];
    }
  }

  /**
   * Get download URL for a document
   */
  async getDownloadUrl(driveId: string, itemId: string): Promise<string> {
    try {
      if (!this.accessToken) {
        // Return mock download URL for development
        return `https://company.sharepoint.com/sites/projects/documents/download/${itemId}`;
      }

      const response = await fetch(`${this.baseUrl}/drives/${driveId}/items/${itemId}?$select=@microsoft.graph.downloadUrl`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get download URL: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data["@microsoft.graph.downloadUrl"];
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  /**
   * Upload a file to SharePoint
   */
  async uploadFile(driveId: string, fileName: string, fileContent: ArrayBuffer): Promise<DriveItem> {
    try {
      if (!this.accessToken) {
        throw new Error('Upload not supported in development mode');
      }

      const response = await fetch(`${this.baseUrl}/drives/${driveId}/root:/${fileName}:/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: fileContent,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const microsoftGraphService = MicrosoftGraphService.getInstance();

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getFileIcon = (mimeType?: string, isFolder?: boolean): string => {
  if (isFolder) return 'folder';
  
  if (!mimeType) return 'file';
  
  if (mimeType.includes('word')) return 'file-text-2';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'sheet';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
  if (mimeType.includes('pdf')) return 'file-text';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('video')) return 'video';
  if (mimeType.includes('audio')) return 'audio';
  
  return 'file';
}; 