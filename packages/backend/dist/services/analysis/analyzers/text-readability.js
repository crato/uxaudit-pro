"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextReadabilityAnalyzer = void 0;
const shared_1 = require("@uxaudit-pro/shared");
const jsdom_1 = require("jsdom");
class TextReadabilityAnalyzer {
    constructor() {
        this.minFontSize = 12; // Minimum recommended font size in pixels
        this.headerSizes = {
            h1: 32,
            h2: 24,
            h3: 20,
            h4: 18,
            h5: 16,
            h6: 14
        };
    }
    async validate(input) {
        if (!input.content) {
            throw new shared_1.APIError(400, 'No content provided');
        }
        return true;
    }
    async process(input) {
        try {
            const textElements = await this.extractTextElements(input.content.toString());
            const issues = [];
            // Check font sizes
            this.checkFontSizes(textElements, issues);
            // Check heading hierarchy
            this.checkHeadingHierarchy(textElements, issues);
            return {
                id: input.projectId,
                status: 'completed',
                result: { issues }
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new shared_1.APIError(500, `Text readability analysis failed: ${message}`);
        }
    }
    async extractTextElements(html) {
        const elements = [];
        const dom = new jsdom_1.JSDOM(html);
        const { document } = dom.window;
        // Query all text-containing elements
        const textNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
        textNodes.forEach((element, index) => {
            // Extract font size from style attribute
            const styleAttr = element.getAttribute('style') || '';
            const fontSizeMatch = styleAttr.match(/font-size:\s*(\d+)px/);
            const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 16; // Default to 16px
            elements.push({
                text: element.textContent || '',
                fontSize,
                elementType: element.tagName.toLowerCase(),
                location: `element-${index + 1}`
            });
        });
        return elements;
    }
    checkFontSizes(elements, issues) {
        elements.forEach(element => {
            if (element.fontSize < this.minFontSize) {
                issues.push({
                    type: 'font-size',
                    severity: 'critical',
                    message: `Font size ${element.fontSize}px is below minimum recommended size of ${this.minFontSize}px`,
                    location: element.location,
                    value: element.fontSize,
                    recommendation: `Increase font size to at least ${this.minFontSize}px for better readability`
                });
            }
        });
    }
    checkHeadingHierarchy(elements, issues) {
        const headings = elements.filter(e => /^h[1-6]$/.test(e.elementType));
        let lastHeadingLevel = 0;
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.elementType.charAt(1));
            if (currentLevel - lastHeadingLevel > 1) {
                issues.push({
                    type: 'heading-hierarchy',
                    severity: 'warning',
                    message: `Heading hierarchy skips level ${lastHeadingLevel + 1}`,
                    location: heading.location,
                    recommendation: 'Maintain sequential heading hierarchy for better document structure'
                });
            }
            lastHeadingLevel = currentLevel;
        });
    }
}
exports.TextReadabilityAnalyzer = TextReadabilityAnalyzer;
