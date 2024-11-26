// src/services/api/analysis.ts
import { AuditType, AuditSource } from '@uxaudit-pro/shared';

interface AnalysisRequest {
  url?: string;
  image?: File;
  type: AuditType;
  projectId?: string;
}

interface AnalysisResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    issues: Array<{
      type: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      location?: string;
      value?: number;
      recommendation?: string;
    }>;
  };
  error?: string;
}

export class AnalysisAPI {
  private baseUrl = '/api/analyze';

  async submitUrlAnalysis(url: string, type: AuditType, projectId?: string): Promise<AnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type, projectId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      return response.json();
    } catch (error) {
      throw new Error(`URL analysis failed: ${error.message}`);
    }
  }

  async submitImageAnalysis(image: File, type: AuditType, projectId?: string): Promise<AnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('type', type);
      if (projectId) {
        formData.append('projectId', projectId);
      }

      const response = await fetch(`${this.baseUrl}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      return response.json();
    } catch (error) {
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  async getAnalysisStatus(id: string): Promise<AnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch status');
      }

      return response.json();
    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`);
    }
  }
}

export const analysisApi = new AnalysisAPI();