// src/components/analysis/AnalysisInput.tsx
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AuditType } from '@uxaudit-pro/shared';
import { useAnalysis } from '../../hooks/useAnalysis';

export function AnalysisInput() {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { analyzeUrl, analyzeImage, loading, error, progress, clearError } = useAnalysis();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await analyzeUrl(url, AuditType.ACCESSIBILITY);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await analyzeImage(selectedFile, AuditType.ACCESSIBILITY);
  };

  return (
    <>
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to analyze"
                required
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze URL'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Button type="submit" disabled={!selectedFile || loading}>
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">{progress}% Complete</p>
        </div>
      )}
    </div>
    </>
  );
}