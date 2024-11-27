// src/hooks/useAnalysis.ts
import { useState, useEffect } from 'react';
import { AuditType } from '@uxaudit-pro/shared';

interface AnalysisResult {
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

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const analyzeUrl = async (url: string, type: AuditType) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type })
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const result = await response.json();
      setResults(result);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (file: File, type: AuditType) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/analyze/image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image analysis failed. Please try again.');
      }

      const result = await response.json();
      setResults(result);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeUrl,
    analyzeImage,
    loading,
    error,
    results,
    progress,
    clearError: () => setError(null),
    clearResults: () => setResults(null)
  };
}