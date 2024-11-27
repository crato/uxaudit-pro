"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("../services/analysis/engine");
const shared_1 = require("@uxaudit-pro/shared");
async function verifyContrast() {
    try {
        const engine = engine_1.analysisEngine;
        const result = await engine.submitAnalysis({
            source: shared_1.AuditSource.URL,
            content: 'https://example.com',
            type: shared_1.AuditType.ACCESSIBILITY, // Using enum value instead of string
            projectId: 'test'
        });
        console.log('Contrast analysis result:', result);
    }
    catch (error) {
        console.error('Contrast verification failed:', error);
        process.exit(1);
    }
}
verifyContrast();
