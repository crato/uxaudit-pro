"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAnalysis = exports.listAnalyses = exports.getAnalysisStatus = exports.getAnalysis = exports.analyzeImage = exports.analyzeUrl = void 0;
const engine_1 = require("../services/analysis/engine");
const analysis_1 = require("../models/analysis");
const shared_1 = require("@uxaudit-pro/shared");
const analyzeUrl = async (req, res, next) => {
    try {
        const { url, type, projectId } = req.body;
        const result = await engine_1.analysisEngine.submitAnalysis({
            source: shared_1.AuditSource.URL,
            content: url,
            type,
            projectId
        });
        res.status(202).json({
            id: result.id,
            status: result.status,
            message: 'Analysis submitted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeUrl = analyzeUrl;
// Image upload
const analyzeImage = async (req, res, next) => {
    try {
        const { type, projectId } = req.body;
        if (!req.file) {
            throw new shared_1.APIError(400, 'No image file provided');
        }
        const result = await engine_1.analysisEngine.submitAnalysis({
            source: shared_1.AuditSource.IMAGE,
            content: req.file.buffer,
            type,
            projectId,
            metadata: {
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
        res.status(202).json({
            id: result.id,
            status: result.status,
            message: 'Image analysis submitted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeImage = analyzeImage;
const getAnalysis = async (req, res, next) => {
    try {
        const { id } = req.params;
        const analysis = await analysis_1.Analysis.findById(id);
        if (!analysis) {
            throw new shared_1.APIError(404, 'Analysis not found');
        }
        res.json(analysis);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysis = getAnalysis;
const getAnalysisStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const status = await engine_1.analysisEngine.getAnalysisStatus(id);
        if (!status) {
            throw new shared_1.APIError(404, 'Analysis status not found');
        }
        res.json(status);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysisStatus = getAnalysisStatus;
const listAnalyses = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, projectId } = req.query;
        const query = projectId ? { projectId } : {};
        const skip = (Number(page) - 1) * Number(limit);
        const analyses = await analysis_1.Analysis.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await analysis_1.Analysis.countDocuments(query);
        res.json({
            analyses,
            page: Number(page),
            limit: Number(limit),
            total
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listAnalyses = listAnalyses;
const exportAnalysis = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { format = 'json' } = req.query;
        const analysis = await analysis_1.Analysis.findById(id);
        if (!analysis) {
            throw new shared_1.APIError(404, 'Analysis not found');
        }
        if (format === 'pdf') {
            // PDF export logic would go here
            throw new shared_1.APIError(501, 'PDF export not yet implemented');
        }
        // Default to JSON export
        res.json(analysis);
    }
    catch (error) {
        next(error);
    }
};
exports.exportAnalysis = exportAnalysis;
