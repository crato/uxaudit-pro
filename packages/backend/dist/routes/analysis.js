"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rate_limit_1 = require("../middleware/rate-limit");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const analysisController = __importStar(require("../controllers/analysis"));
const router = (0, express_1.Router)();
// Analysis submission endpoints
router.post('/analyze/url', rate_limit_1.rateLimitMiddleware, validation_1.validateAnalysisInput, analysisController.analyzeUrl);
router.post('/analyze/image', rate_limit_1.rateLimitMiddleware, upload_1.upload.single('image'), validation_1.validateAnalysisInput, analysisController.analyzeImage);
// Analysis status and results endpoints
router.get('/analysis/:id', rate_limit_1.authenticatedLimiter, analysisController.getAnalysis);
router.get('/analysis/:id/status', rate_limit_1.authenticatedLimiter, analysisController.getAnalysisStatus);
// Results management endpoints
router.get('/analysis', rate_limit_1.authenticatedLimiter, analysisController.listAnalyses);
router.get('/analysis/:id/export', rate_limit_1.authenticatedLimiter, analysisController.exportAnalysis);
exports.default = router;
