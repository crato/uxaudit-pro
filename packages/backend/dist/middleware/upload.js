"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
// Configure storage
const storage = multer_1.default.memoryStorage();
// Valid image types
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Configure file filter
const fileFilter = (req, file, cb) => {
    if (!VALID_MIME_TYPES.includes(file.mimetype)) {
        cb(new errors_1.APIError(400, 'Invalid file type', {
            allowedTypes: VALID_MIME_TYPES
        }));
        return;
    }
    cb(null, true);
};
// Create multer instance with configuration
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    }
});
