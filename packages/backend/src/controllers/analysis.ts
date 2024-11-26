import { Request, Response, NextFunction } from 'express';
import { analysisEngine } from '../services/analysis/engine';
import { Analysis } from '../models/analysis';
import { AuditSource, APIError } from '@uxaudit-pro/shared';


export const analyzeUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, type, projectId } = req.body;
    
    const result = await analysisEngine.submitAnalysis({
      source: AuditSource.URL,
      content: url,
      type,
      projectId
    });

    res.status(202).json({
      id: result.id,
      status: result.status,
      message: 'Analysis submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Image upload

export const analyzeImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, projectId } = req.body;
    
    if (!req.file) {
      throw new APIError(400, 'No image file provided');
    }

    const result = await analysisEngine.submitAnalysis({
      source: AuditSource.IMAGE,
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
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const analysis = await Analysis.findById(id);
    if (!analysis) {
      throw new APIError(404, 'Analysis not found');
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

export const getAnalysisStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const status = await analysisEngine.getAnalysisStatus(id);
    if (!status) {
      throw new APIError(404, 'Analysis status not found');
    }

    res.json(status);
  } catch (error) {
    next(error);
  }
};

export const listAnalyses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, projectId } = req.query;
    
    const query = projectId ? { projectId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Analysis.countDocuments(query);

    res.json({
      analyses,
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const exportAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    
    const analysis = await Analysis.findById(id);
    if (!analysis) {
      throw new APIError(404, 'Analysis not found');
    }

    if (format === 'pdf') {
      // PDF export logic would go here
      throw new APIError(501, 'PDF export not yet implemented');
    }

    // Default to JSON export
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};