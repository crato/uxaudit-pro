// File: packages/backend/src/services/analysis/analyzers/__tests__/contrast-calculator.ts
import { ColorValue } from '@uxaudit-pro/shared';

export class ContrastCalculator {
  // Convert hex to RGB
  static hexToRgb(hex: string): ColorValue {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Calculate relative luminance
  static getRelativeLuminance(color: ColorValue): number {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Calculate contrast ratio
  static calculateContrastRatio(color1: ColorValue, color2: ColorValue): number {
    const l1 = this.getRelativeLuminance(color1);
    const l2 = this.getRelativeLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Get WCAG level
  static getWCAGLevel(ratio: number): 'AAA' | 'AA' | 'fail' {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }
}