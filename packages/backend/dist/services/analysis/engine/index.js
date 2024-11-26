"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisEngine = exports.AnalysisEngine = void 0;
const shared_1 = require("@uxaudit-pro/shared");
const shared_2 = require("@uxaudit-pro/shared");
const color_contrast_1 = require("../analyzers/color-contrast");
const text_readability_1 = require("../analyzers/text-readability");
const component_spacing_1 = require("../analyzers/component-spacing");
const image_analyzer_1 = require("../analyzers/image-analyzer");
class DefaultTaskQueue {
    constructor() {
        this.tasks = new Map();
        this.maxConcurrent = 5;
        this.running = 0;
    }
    async add(task) {
        const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.tasks.set(id, {
            id,
            status: 'pending',
            progress: 0
        });
        while (this.running >= this.maxConcurrent) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.running++;
        try {
            const result = await task();
            this.tasks.set(id, { ...result, id });
            return id;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.tasks.set(id, {
                id,
                status: 'failed',
                error: errorMessage
            });
            throw error;
        }
        finally {
            this.running--;
        }
    }
    getStatus(id) {
        return this.tasks.get(id);
    }
}
class AnalysisEngine {
    constructor(taskQueue) {
        this.processors = new Map();
        this.taskQueue = taskQueue || new DefaultTaskQueue();
    }
    static getInstance(taskQueue) {
        if (!AnalysisEngine.instance) {
            AnalysisEngine.instance = new AnalysisEngine(taskQueue);
            AnalysisEngine.instance.initialize();
        }
        return AnalysisEngine.instance;
    }
    initialize() {
        // Register all analyzers
        this.registerProcessor(shared_1.AuditSource.URL, new color_contrast_1.ColorContrastAnalyzer());
        this.registerProcessor(shared_1.AuditSource.URL, new text_readability_1.TextReadabilityAnalyzer());
        this.registerProcessor(shared_1.AuditSource.URL, new component_spacing_1.ComponentSpacingAnalyzer());
        this.registerProcessor(shared_1.AuditSource.IMAGE, new image_analyzer_1.ImageAnalyzer());
    }
    registerProcessor(source, processor) {
        this.processors.set(source, processor);
    }
    async submitAnalysis(input) {
        const processor = this.processors.get(input.source);
        if (!processor) {
            throw new shared_2.APIError(400, `No processor registered for source: ${input.source}`);
        }
        const isValid = await processor.validate(input);
        if (!isValid) {
            throw new shared_2.APIError(400, 'Invalid input for analysis');
        }
        const taskId = await this.taskQueue.add(async () => {
            return processor.process(input);
        });
        return this.taskQueue.getStatus(taskId);
    }
    async getAnalysisStatus(taskId) {
        return this.taskQueue.getStatus(taskId);
    }
    // Helper method to get processor (useful for testing)
    getProcessor(source) {
        return this.processors.get(source);
    }
}
exports.AnalysisEngine = AnalysisEngine;
// Export singleton instance
exports.analysisEngine = AnalysisEngine.getInstance();
