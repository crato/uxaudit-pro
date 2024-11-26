// src/pages/analysis/index.tsx
import React from 'react';
import { useState } from 'react';
import { AnalysisInput } from '@/components/analysis/AnalysisInput';
import { ResultsDisplay } from '@/components/analysis/ResultsDisplay';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function AnalysisPage() {
  const { results, clearResults } = useAnalysis();

  return (
    <>
    <div className="container mx-auto py-8 space-y-8">
      
      <h1 className="text-2xl font-bold">UX Analysis</h1>
      
      <AnalysisInput />

      {results && ( <ResultsDisplay 
        results={results} 
        onClear={clearResults}
        /> 
       )}

    </div>
    </>
  )
  
}