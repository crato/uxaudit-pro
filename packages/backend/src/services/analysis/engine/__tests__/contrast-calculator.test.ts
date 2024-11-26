// File: packages/backend/src/services/analysis/analyzers/__tests__/contrast-calculator.test.ts
import { ContrastCalculator } from './contrast-calculator';

describe('ContrastCalculator', () => {
  const knownContrastPairs = [
    {
      name: 'Black on White',
      color1: '#000000', // Black
      color2: '#FFFFFF', // White
      expectedRatio: 21,
      expectedLevel: 'AAA'
    },
    {
      name: 'White on Gray',
      color1: '#FFFFFF', // White
      color2: '#808080', // Gray
      expectedRatio: 3.95,
      expectedLevel: 'fail'
    },
    {
      name: 'Blue on White',
      color1: '#0000FF', // Blue
      color2: '#FFFFFF', // White
      expectedRatio: 8.59,
      expectedLevel: 'AAA'
    }
  ];

  test.each(knownContrastPairs)(
    '$name should have correct contrast ratio and WCAG level',
    ({ color1, color2, expectedRatio, expectedLevel }) => {
      const rgb1 = ContrastCalculator.hexToRgb(color1);
      const rgb2 = ContrastCalculator.hexToRgb(color2);
      
      const ratio = ContrastCalculator.calculateContrastRatio(rgb1, rgb2);
      expect(ratio).toBeCloseTo(expectedRatio, 1);
      
      const level = ContrastCalculator.getWCAGLevel(ratio);
      expect(level).toBe(expectedLevel);
    }
  );
});

