"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsDisplay = ResultsDisplay;
// src/components/analysis/ResultsDisplay.tsx
const react_1 = __importDefault(require("react"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const severityColors = {
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
};
function ResultsDisplay({ results, onClear }) {
    const issueCount = {
        critical: results.issues.filter(i => i.severity === 'critical').length,
        warning: results.issues.filter(i => i.severity === 'warning').length,
        info: results.issues.filter(i => i.severity === 'info').length
    };
    return (<>
    <div className="space-y-6">
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Analysis Results</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex gap-4 mb-4">
            <badge_1.Badge className="bg-red-100 text-red-800">
              Critical: {issueCount.critical}
            </badge_1.Badge>
            <badge_1.Badge className="bg-yellow-100 text-yellow-800">
              Warnings: {issueCount.warning}
            </badge_1.Badge>
            <badge_1.Badge className="bg-blue-100 text-blue-800">
              Info: {issueCount.info}
            </badge_1.Badge>
          </div>

          <div className="space-y-4">
            {results.issues.map((issue, index) => (<card_1.Card key={index}>
                <card_1.CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <badge_1.Badge className={severityColors[issue.severity]}>
                        {issue.severity}
                      </badge_1.Badge>
                      <h3 className="mt-2 font-medium">{issue.message}</h3>
                    </div>
                  </div>
                  
                  {issue.location && (<p className="mt-2 text-sm text-gray-600">
                      Location: {issue.location}
                    </p>)}
                  
                  {issue.recommendation && (<div className="mt-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm">{issue.recommendation}</p>
                    </div>)}
                </card_1.CardContent>
              </card_1.Card>))}
          </div>

          <div className="mt-6 flex justify-end">
            <button_1.Button onClick={onClear} variant="outline">
              Clear Results
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>
    </>);
}
