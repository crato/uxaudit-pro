"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPercentage = exports.formatNumber = exports.formatFileSize = exports.formatDate = void 0;
/**
 * Formats a date for display
 */
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
exports.formatDate = formatDate;
/**
 * Formats a file size in bytes to a human-readable string
 */
const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
};
exports.formatFileSize = formatFileSize;
/**
 * Formats a number with thousand separators
 */
const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};
exports.formatNumber = formatNumber;
/**
 * Formats a percentage
 */
const formatPercentage = (value) => {
    return `${Math.round(value * 100) / 100}%`;
};
exports.formatPercentage = formatPercentage;
