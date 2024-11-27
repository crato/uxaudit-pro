import mongoose, { Schema, Document } from 'mongoose';
import { AuditResult, AuditType, AuditSource, IssueSeverity } from '@uxaudit-pro/shared';

export interface AnalysisDocument extends Omit<AuditResult, 'id'>, Document {}

const analysisSchema = new Schema<AnalysisDocument>({
  projectId: { type: String, required: true },
  auditType: { 
    type: String,
    enum: Object.values(AuditType),
    required: true 
  },
  source: { 
    type: String,
    enum: Object.values(AuditSource),
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
      enum: Object.values(IssueSeverity),
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

export const Analysis = mongoose.model<AnalysisDocument>('Analysis', analysisSchema);