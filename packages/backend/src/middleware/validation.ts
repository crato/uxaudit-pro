import { Request, Response, NextFunction } from 'express';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { APIError } from '@uxaudit-pro/shared';

export const validateAnalysisInput = (req: Request, res: Response, next: NextFunction) => {
  const { type, projectId } = req.body;

  // Validate audit type
  if (!type || !Object.values(AuditType).includes(type)) {
    throw new APIError(400, 'Invalid audit type', {
      validTypes: Object.values(AuditType)
    });
  }

  // Validate project ID if provided
  if (projectId && typeof projectId !== 'string') {
    throw new APIError(400, 'Invalid project ID');
  }

  // URL-specific validation
  if (req.path.includes('/analyze/url')) {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      throw new APIError(400, 'URL is required');
    }

    try {
      new URL(url);
    } catch (error) {
      throw new APIError(400, 'Invalid URL format');
    }
  }

  // Image-specific validation
  if (req.path.includes('/analyze/image')) {
    if (!req.file) {
      throw new APIError(400, 'Image file is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw new APIError(400, 'Invalid image format', {
        allowed: allowedMimeTypes
      });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new APIError(400, 'Image file too large', {
        maxSize: '5MB'
      });
    }
  }

  next();
};