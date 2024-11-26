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
exports.Analysis = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shared_1 = require("@uxaudit-pro/shared");
const analysisSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true },
    auditType: {
        type: String,
        enum: Object.values(shared_1.AuditType),
        required: true
    },
    source: {
        type: String,
        enum: Object.values(shared_1.AuditSource),
        required: true
    },
    sourceUrl: String,
    issues: [{
            _id: false, // Disable automatic _id for subdocuments
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            severity: {
                type: String,
                enum: Object.values(shared_1.IssueSeverity),
                required: true
            },
            category: { type: String, required: true },
            location: String,
            screenshot: String,
            recommendations: { type: [String], required: true },
            wcagGuideline: String,
            impact: { type: String, required: true },
            effort: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }],
    summary: {
        criticalCount: { type: Number, default: 0 },
        highCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        lowCount: { type: Number, default: 0 },
        infoCount: { type: Number, default: 0 },
        totalScore: { type: Number, required: true },
        accessibilityScore: Number,
        usabilityScore: Number,
        performanceScore: Number
    },
    metadata: {
        startedAt: { type: Date, required: true },
        completedAt: { type: Date, required: true },
        duration: { type: Number, required: true },
        analyzedPages: Number,
        totalElements: Number
    }
}, {
    timestamps: true
});
// Add indexes
analysisSchema.index({ projectId: 1, createdAt: -1 });
analysisSchema.index({ auditType: 1 });
exports.Analysis = mongoose_1.default.model('Analysis', analysisSchema);
