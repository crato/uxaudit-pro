"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentSpacingAnalyzer = void 0;
const shared_1 = require("@uxaudit-pro/shared");
const jsdom_1 = require("jsdom");
class ComponentSpacingAnalyzer {
    constructor() {
        this.standardSpacing = [0, 4, 8, 16, 24, 32, 48]; // Standard spacing values in pixels
    }
    async validate(input) {
        if (!input.content) {
            throw new shared_1.APIError(400, 'No content provided');
        }
        return true;
    }
    async process(input) {
        try {
            const elements = await this.extractSpacingElements(input.content.toString());
            const issues = [];
            this.checkSpacingConsistency(elements, issues);
            this.checkAlignment(elements, issues);
            return {
                id: input.projectId,
                status: 'completed',
                result: { issues }
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new shared_1.APIError(500, `Component spacing analysis failed: ${message}`);
        }
    }
    parseSpacingValue(value) {
        const match = value.match(/(\d+)px/);
        return match ? parseInt(match[1]) : 0;
    }
    async extractSpacingElements(html) {
        const elements = [];
        const dom = new jsdom_1.JSDOM(html);
        const { document } = dom.window;
        const allElements = document.querySelectorAll('*');
        allElements.forEach((element, index) => {
            const style = element.getAttribute('style') || '';
            // Handle shorthand margin
            let margins = [0, 0, 0, 0];
            const marginShorthand = style.match(/margin:\s*(\d+)px/);
            if (marginShorthand) {
                const value = parseInt(marginShorthand[1]);
                margins = [value, value, value, value];
            }
            // Handle shorthand padding
            let paddings = [0, 0, 0, 0];
            const paddingShorthand = style.match(/padding:\s*(\d+)px/);
            if (paddingShorthand) {
                const value = parseInt(paddingShorthand[1]);
                paddings = [value, value, value, value];
            }
            // Override with specific values if present
            ['top', 'right', 'bottom', 'left'].forEach((direction, i) => {
                const marginMatch = style.match(new RegExp(`margin-${direction}:\\s*(\\d+)px`));
                if (marginMatch) {
                    margins[i] = parseInt(marginMatch[1]);
                }
                const paddingMatch = style.match(new RegExp(`padding-${direction}:\\s*(\\d+)px`));
                if (paddingMatch) {
                    paddings[i] = parseInt(paddingMatch[1]);
                }
            });
            elements.push({
                type: element.tagName.toLowerCase(),
                margin: margins,
                padding: paddings,
                location: `element-${index + 1}`
            });
        });
        return elements;
    }
    checkSpacingConsistency(elements, issues) {
        elements.forEach(element => {
            // Check margins
            element.margin.forEach((value, index) => {
                if (value > 0 && !this.standardSpacing.includes(value)) {
                    const direction = ['top', 'right', 'bottom', 'left'][index];
                    issues.push({
                        type: 'spacing-consistency',
                        severity: 'warning',
                        message: `Non-standard margin-${direction} value: ${value}px`,
                        location: element.location,
                        value,
                        recommendation: `Use standard spacing values: ${this.standardSpacing.join(', ')}px`
                    });
                }
            });
            // Check paddings
            element.padding.forEach((value, index) => {
                if (value > 0 && !this.standardSpacing.includes(value)) {
                    const direction = ['top', 'right', 'bottom', 'left'][index];
                    issues.push({
                        type: 'spacing-consistency',
                        severity: 'warning',
                        message: `Non-standard padding-${direction} value: ${value}px`,
                        location: element.location,
                        value,
                        recommendation: `Use standard spacing values: ${this.standardSpacing.join(', ')}px`
                    });
                }
            });
        });
    }
    checkAlignment(elements, issues) {
        elements.forEach(element => {
            const [marginTop, marginRight, marginBottom, marginLeft] = element.margin;
            // Check for asymmetric margins
            if (marginLeft !== marginRight) {
                issues.push({
                    type: 'alignment',
                    severity: 'warning',
                    message: `Asymmetric horizontal margins: left=${marginLeft}px, right=${marginRight}px`,
                    location: element.location,
                    recommendation: 'Consider using consistent horizontal margins for better alignment'
                });
            }
        });
    }
}
exports.ComponentSpacingAnalyzer = ComponentSpacingAnalyzer;
