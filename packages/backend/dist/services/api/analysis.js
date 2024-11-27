"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisApi = exports.AnalysisAPI = void 0;
class AnalysisAPI {
    constructor() {
        this.baseUrl = '/api/analyze';
    }
    async submitUrlAnalysis(url, type, projectId) {
        try {
            const response = await fetch(`${this.baseUrl}/url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, type, projectId }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Analysis failed');
            }
            return response.json();
        }
        catch (error) {
            throw new Error(`URL analysis failed: ${error.message}`);
        }
    }
    async submitImageAnalysis(image, type, projectId) {
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('type', type);
            if (projectId) {
                formData.append('projectId', projectId);
            }
            const response = await fetch(`${this.baseUrl}/image`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Analysis failed');
            }
            return response.json();
        }
        catch (error) {
            throw new Error(`Image analysis failed: ${error.message}`);
        }
    }
    async getAnalysisStatus(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/status`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch status');
            }
            return response.json();
        }
        catch (error) {
            throw new Error(`Status check failed: ${error.message}`);
        }
    }
}
exports.AnalysisAPI = AnalysisAPI;
exports.analysisApi = new AnalysisAPI();
