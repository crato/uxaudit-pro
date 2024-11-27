"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnalysis = useAnalysis;
// src/hooks/useAnalysis.ts
const react_1 = require("react");
const analysis_1 = require("../services/api/analysis");
function useAnalysis() {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [analysisId, setAnalysisId] = (0, react_1.useState)(null);
    const [results, setResults] = (0, react_1.useState)(null);
    const [progress, setProgress] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        let intervalId;
        const checkStatus = async () => {
            if (!analysisId)
                return;
            try {
                const status = await analysis_1.analysisApi.getAnalysisStatus(analysisId);
                if (status.status === 'completed') {
                    setResults(status.result);
                    setLoading(false);
                    setAnalysisId(null);
                    setProgress(100);
                }
                else if (status.status === 'failed') {
                    throw new Error(status.error || 'Analysis failed');
                }
                else {
                    setProgress(status.status === 'processing' ? 50 : 25);
                }
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
                setAnalysisId(null);
            }
        };
        if (analysisId) {
            intervalId = setInterval(checkStatus, 2000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [analysisId]);
    const analyzeUrl = async (url, type) => {
        setLoading(true);
        setError(null);
        setResults(null);
        setProgress(0);
        try {
            const response = await analysis_1.analysisApi.submitUrlAnalysis(url, type);
            setAnalysisId(response.id);
        }
        catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    const analyzeImage = async (image, type) => {
        setLoading(true);
        setError(null);
        setResults(null);
        setProgress(0);
        try {
            const response = await analysis_1.analysisApi.submitImageAnalysis(image, type);
            setAnalysisId(response.id);
        }
        catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    return {
        analyzeUrl,
        analyzeImage,
        loading,
        error,
        results,
        progress,
        clearError: () => setError(null),
        clearResults: () => setResults(null)
    };
}
