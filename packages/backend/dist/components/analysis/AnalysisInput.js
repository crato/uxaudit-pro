"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisInput = AnalysisInput;
// src/components/analysis/AnalysisInput.tsx
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const alert_1 = require("@/components/ui/alert");
const progress_1 = require("@/components/ui/progress");
const card_1 = require("@/components/ui/card");
const shared_1 = require("@uxaudit-pro/shared");
const useAnalysis_1 = require("../../hooks/useAnalysis");
function AnalysisInput() {
    const [url, setUrl] = (0, react_2.useState)('');
    const [selectedFile, setSelectedFile] = (0, react_2.useState)(null);
    const { analyzeUrl, analyzeImage, loading, error, progress, clearError } = (0, useAnalysis_1.useAnalysis)();
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim())
            return;
        await analyzeUrl(url, shared_1.AuditType.ACCESSIBILITY);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile)
            return;
        await analyzeImage(selectedFile, shared_1.AuditType.ACCESSIBILITY);
    };
    return (<>
    <div className="space-y-6">
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>URL Analysis</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input_1.Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL to analyze" required disabled={loading}/>
              <button_1.Button type="submit" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze URL'}
              </button_1.Button>
            </div>
          </form>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Image Analysis</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <input_1.Input type="file" accept="image/*" onChange={handleFileChange} disabled={loading}/>
            <button_1.Button type="submit" disabled={!selectedFile || loading}>
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button_1.Button>
          </form>
        </card_1.CardContent>
      </card_1.Card>

      {error && (<alert_1.Alert variant="destructive" className="mt-4">
          <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
        </alert_1.Alert>)}

      {loading && (<div className="space-y-2">
          <progress_1.Progress value={progress} className="w-full"/>
          <p className="text-sm text-gray-500 text-center">{progress}% Complete</p>
        </div>)}
    </div>
    </>);
}
