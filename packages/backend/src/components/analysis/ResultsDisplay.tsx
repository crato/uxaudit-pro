import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResultsDisplayProps {
  results: {
    issues: Array<{
      type: string;
      severity: 'critical' | 'warning' | 'info';
      message: string;
      location?: string;
      recommendation?: string;
    }>;
  };
  onClear: () => void;
}

export function ResultsDisplay({ results, onClear }: ResultsDisplayProps) {
  const severityCount = {
    critical: results.issues.filter(i => i.severity === 'critical').length,
    warning: results.issues.filter(i => i.severity === 'warning').length,
    info: results.issues.filter(i => i.severity === 'info').length
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <div className="flex gap-4">
          <Badge variant="destructive">
            {severityCount.critical} Critical
          </Badge>
          <Badge variant="warning">
            {severityCount.warning} Warnings
          </Badge>
          <Badge variant="secondary">
            {severityCount.info} Info
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.issues.map((issue, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <Badge className={
                  issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {issue.severity}
                </Badge>
                <h3 className="mt-2 font-medium">{issue.message}</h3>
                {issue.location && (
                  <p className="mt-2 text-sm text-gray-600">
                    Location: {issue.location}
                  </p>
                )}
                {issue.recommendation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm">{issue.recommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button onClick={onClear} variant="outline">
            Clear Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}