import { useState, useEffect, useCallback } from 'react';
import { microsoftGraphService, type DriveItem } from '@/lib/msgraph';

export interface UseSharePointDocsReturn {
  documents: DriveItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  downloadDocument: (documentId: string) => Promise<string | null>;
  searchDocuments: (query: string) => DriveItem[];
}

/**
 * React Hook for SharePoint Document Management
 * --------------------------------------------
 * Provides a clean interface for managing SharePoint documents
 * with loading states, error handling, and search functionality
 */
export const useSharePointDocs = (projectId?: string): UseSharePointDocsReturn => {
  const [documents, setDocuments] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load documents from SharePoint
   */
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let docs: DriveItem[];
      
      if (projectId) {
        // Load project-specific documents
        docs = await microsoftGraphService.getProjectDocuments(projectId);
      } else {
        // Load all documents (fallback)
        const response = await microsoftGraphService.getDocuments('mock-library-id');
        docs = response.value;
      }
      
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading SharePoint documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Refresh documents
   */
  const refresh = useCallback(async () => {
    await loadDocuments();
  }, [loadDocuments]);

  /**
   * Download a document
   */
  const downloadDocument = useCallback(async (documentId: string): Promise<string | null> => {
    try {
      setError(null);
      const downloadUrl = await microsoftGraphService.getDownloadUrl('mock-library-id', documentId);
      
      // Open download URL in new tab/window
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        return downloadUrl;
      }
      
      return null;
    } catch (err) {
      console.error('Error downloading document:', err);
      setError(err instanceof Error ? err.message : 'Failed to download document');
      return null;
    }
  }, []);

  /**
   * Search documents by name or content
   */
  const searchDocuments = useCallback((query: string): DriveItem[] => {
    if (!query.trim()) {
      return documents;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.createdBy?.user.displayName.toLowerCase().includes(lowercaseQuery) ||
      doc.lastModifiedBy?.user.displayName.toLowerCase().includes(lowercaseQuery)
    );
  }, [documents]);

  // Load documents on mount or when projectId changes
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    loading,
    error,
    refresh,
    downloadDocument,
    searchDocuments,
  };
};

/**
 * Hook for managing document upload functionality
 */
export const useSharePointUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<DriveItem | null> => {
    try {
      setUploading(true);
      setUploadError(null);
      
      const arrayBuffer = await file.arrayBuffer();
      const result = await microsoftGraphService.uploadFile('mock-library-id', file.name, arrayBuffer);
      
      return result;
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadFile,
    uploading,
    uploadError,
  };
}; 