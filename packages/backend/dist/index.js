"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const analysis_1 = __importDefault(require("./routes/analysis"));
const shared_1 = require("@uxaudit-pro/shared");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', analysis_1.default);
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    if (err instanceof shared_1.APIError) {
        res.status(err.statusCode).json({
            error: err.message,
            details: err.details
        });
        return;
    }
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
    return;
};
app.use(errorHandler);
// Start server
async function startServer() {
    try {
        await utils_1.db.connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
