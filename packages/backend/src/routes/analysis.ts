import { Router } from 'express';
import { rateLimitMiddleware, authenticatedLimiter } from '../middleware/rate-limit';
import { validateAnalysisInput } from '../middleware/validation';
import { upload } from '../middleware/upload';
import * as analysisController from '../controllers/analysis';

const router = Router();

// Analysis submission endpoints
router.post(
  '/analyze/url',
  rateLimitMiddleware,
  validateAnalysisInput,
  analysisController.analyzeUrl
);


router.post(
  '/analyze/image',
  rateLimitMiddleware,
  upload.single('image'),
  validateAnalysisInput,
  analysisController.analyzeImage
);

// Analysis status and results endpoints
router.get(
  '/analysis/:id',
  authenticatedLimiter,
  analysisController.getAnalysis
);

router.get(
  '/analysis/:id/status',
  authenticatedLimiter,
  analysisController.getAnalysisStatus
);

// Results management endpoints
router.get(
  '/analysis',
  authenticatedLimiter,
  analysisController.listAnalyses
);

router.get(
  '/analysis/:id/export',
  authenticatedLimiter,
  analysisController.exportAnalysis
);

export default router;