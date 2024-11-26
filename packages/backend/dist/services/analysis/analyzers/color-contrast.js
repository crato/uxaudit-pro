"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorContrastAnalyzer = void 0;
const shared_1 = require("@uxaudit-pro/shared");
const jsdom_1 = require("jsdom");
class ColorContrastAnalyzer {
    async validate(input) {
        if (!input.content) {
            throw new shared_1.APIError(400, 'No content provided');
        }
        return true;
    }
    async process(input) {
        try {
            const colorPairs = await this.extractColors(input.content.toString());
            const issues = [];
            for (const pair of colorPairs) {
                const ratio = this.calculateContrastRatio(pair.foreground, pair.background);
                const wcagLevel = this.getWCAGLevel(ratio);
                if (wcagLevel === 'fail') {
                    issues.push({
                        type: 'contrast',
                        severity: 'critical',
                        message: `Contrast ratio ${ratio.toFixed(2)} fails WCAG guidelines`,
                        location: pair.location,
                        value: parseFloat(ratio.toFixed(2)),
                        recommendation: 'Increase contrast ratio to at least 4.5:1 for normal text'
                    });
                }
            }
            return {
                id: input.projectId,
                status: 'completed',
                result: { issues }
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new shared_1.APIError(500, `Color contrast analysis failed: ${message}`);
        }
    }
    async extractColors(html) {
        const pairs = [];
        const dom = new jsdom_1.JSDOM(html);
        const { document } = dom.window;
        // Get all elements
        const elements = document.querySelectorAll('*');
        elements.forEach((element, index) => {
            const styles = element.getAttribute('style');
            if (!styles)
                return;
            const colorMatch = styles.match(/color:\s*(#[0-9A-Fa-f]{6})/);
            const bgColorMatch = styles.match(/background-color:\s*(#[0-9A-Fa-f]{6})/);
            if (colorMatch && bgColorMatch) {
                pairs.push({
                    foreground: this.hexToRgb(colorMatch[1]),
                    background: this.hexToRgb(bgColorMatch[1]),
                    location: `element-${index + 1}`
                });
            }
        });
        return pairs;
    }
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }
    getRelativeLuminance(color) {
        const { r, g, b } = color;
        const [rs, gs, bs] = [r, g, b].map(c => {
            const sRGB = c / 255;
            return sRGB <= 0.03928
                ? sRGB / 12.92
                : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    calculateContrastRatio(fg, bg) {
        const l1 = this.getRelativeLuminance(fg);
        const l2 = this.getRelativeLuminance(bg);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    getWCAGLevel(ratio) {
        if (ratio >= 7)
            return 'AAA';
        if (ratio >= 4.5)
            return 'AA';
        return 'fail';
    }
}
exports.ColorContrastAnalyzer = ColorContrastAnalyzer;
