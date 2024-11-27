import multer from 'multer';
import { Request } from 'express';
import { APIError } from '../utils/errors';

// Configure storage
const storage = multer.memoryStorage();

// Valid image types
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!VALID_MIME_TYPES.includes(file.mimetype)) {
    cb(new APIError(400, 'Invalid file type', {
      allowedTypes: VALID_MIME_TYPES
    }));
    return;
  }
  cb(null, true);
};

// Create multer instance with configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
});