import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAnalysis } from '@/hooks/useAnalysis';
import { AuditType } from '@uxaudit-pro/shared';

export function AnalysisForm() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { analyzeUrl, analyzeImage, loading, error, progress } = useAnalysis();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await analyzeUrl(url, AuditType.ACCESSIBILITY);
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await analyzeImage(file, AuditType.ACCESSIBILITY);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter website URL to analyze"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? 'Analyzing...' : 'Analyze URL'}
            </Button>
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
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !file}>
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-gray-500">
            {progress}% Complete
          </p>
        </div>
      )}
    </div>
  );
}