"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnalysisPage;
// src/pages/analysis/index.tsx
const react_1 = __importDefault(require("react"));
const AnalysisInput_1 = require("@/components/analysis/AnalysisInput");
const ResultsDisplay_1 = require("@/components/analysis/ResultsDisplay");
const useAnalysis_1 = require("@/hooks/useAnalysis");
function AnalysisPage() {
    const { results, clearResults } = (0, useAnalysis_1.useAnalysis)();
    return (<>
    <div className="container mx-auto py-8 space-y-8">
      
      <h1 className="text-2xl font-bold">UX Analysis</h1>
      
      <AnalysisInput_1.AnalysisInput />

      {results && (<ResultsDisplay_1.ResultsDisplay results={results} onClear={clearResults}/>)}

    </div>
    </>);
}
