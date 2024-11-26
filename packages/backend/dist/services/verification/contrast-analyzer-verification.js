"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// File: packages/backend/src/services/verification/contrast-analyzer-verification.ts
const shared_1 = require("@uxaudit-pro/shared");
const color_contrast_1 = require("../analysis/analyzers/color-contrast");
const database_1 = require("../../utils/database");
describe('Color Contrast Analyzer Verification', () => {
    beforeAll(async () => {
        // Use the Database singleton to connect
        await database_1.db.connect();
    });
    afterAll(async () => {
        // Properly disconnect after tests
        await database_1.db.disconnect();
    });
    it('should analyze color contrast correctly', async () => {
        const analyzer = new color_contrast_1.ColorContrastAnalyzer();
        const result = await analyzer.process({
            source: shared_1.AuditSource.URL,
            content: 'https://example.com',
            type: shared_1.AuditType.ACCESSIBILITY,
            projectId: 'test-project'
        });
        expect(result).toBeDefined();
        expect(result.status).toBe('completed');
    });
});
