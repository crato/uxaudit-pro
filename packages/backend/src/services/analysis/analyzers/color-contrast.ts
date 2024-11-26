// File: packages/backend/src/analysis/analyzers/color-contrast.ts
import { InputProcessor, ProcessorInput, ProcessorResult } from '../types/processor';
import { APIError } from '@uxaudit-pro/shared';
import { AnalyzerResult, ColorValue } from './types';


import { JSDOM } from 'jsdom';

interface ColorPair {
  foreground: ColorValue;
  background: ColorValue;
  location: string;
}

export class ColorContrastAnalyzer implements InputProcessor {
  async validate(input: ProcessorInput): Promise<boolean> {
    if (!input.content) {
      throw new APIError(400, 'No content provided');
    }
    return true;
  }

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    try {
      const colorPairs = await this.extractColors(input.content.toString());
      const issues: Array<{
        type: string;
        severity: 'critical' | 'warning' | 'info';
        message: string;
        location: string;
        value: number;
        recommendation?: string;
      }> = [];

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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new APIError(500, `Color contrast analysis failed: ${message}`);
    }
  }

  private async extractColors(html: string): Promise<ColorPair[]> {
    const pairs: ColorPair[] = [];
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // Get all elements
    const elements = document.querySelectorAll('*');
    
    elements.forEach((element, index) => {
      const styles = element.getAttribute('style');
      if (!styles) return;

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

  private hexToRgb(hex: string): ColorValue {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  private getRelativeLuminance(color: ColorValue): number {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private calculateContrastRatio(fg: ColorValue, bg: ColorValue): number {
    const l1 = this.getRelativeLuminance(fg);
    const l2 = this.getRelativeLuminance(bg);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getWCAGLevel(ratio: number): 'AAA' | 'AA' | 'fail' {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }
}