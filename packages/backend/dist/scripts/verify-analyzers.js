"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@uxaudit-pro/shared");
const engine_1 = require("../services/analysis/engine");
async function verifyAnalyzers() {
    try {
        // Use the singleton instance
        const engine = engine_1.analysisEngine;
        // Use proper AuditType enum value
        const result = await engine.submitAnalysis({
            source: shared_1.AuditSource.URL,
            content: 'https://example.com',
            type: shared_1.AuditType.ACCESSIBILITY, // Using enum value instead of string
            projectId: 'test'
        });
        console.log('Analysis result:', result);
    }
    catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}
verifyAnalyzers();
