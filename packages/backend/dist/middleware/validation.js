"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalysisInput = void 0;
const shared_1 = require("@uxaudit-pro/shared");
const shared_2 = require("@uxaudit-pro/shared");
const validateAnalysisInput = (req, res, next) => {
    const { type, projectId } = req.body;
    // Validate audit type
    if (!type || !Object.values(shared_1.AuditType).includes(type)) {
        throw new shared_2.APIError(400, 'Invalid audit type', {
            validTypes: Object.values(shared_1.AuditType)
        });
    }
    // Validate project ID if provided
    if (projectId && typeof projectId !== 'string') {
        throw new shared_2.APIError(400, 'Invalid project ID');
    }
    // URL-specific validation
    if (req.path.includes('/analyze/url')) {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            throw new shared_2.APIError(400, 'URL is required');
        }
        try {
            new URL(url);
        }
        catch (error) {
            throw new shared_2.APIError(400, 'Invalid URL format');
        }
    }
    // Image-specific validation
    if (req.path.includes('/analyze/image')) {
        if (!req.file) {
            throw new shared_2.APIError(400, 'Image file is required');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            throw new shared_2.APIError(400, 'Invalid image format', {
                allowed: allowedMimeTypes
            });
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            throw new shared_2.APIError(400, 'Image file too large', {
                maxSize: '5MB'
            });
        }
    }
    next();
};
exports.validateAnalysisInput = validateAnalysisInput;
