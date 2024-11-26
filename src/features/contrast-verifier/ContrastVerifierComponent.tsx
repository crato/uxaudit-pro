import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorValue } from '@uxaudit-pro/shared';

export const ContrastVerifierComponent = () => {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [result, setResult] = useState(null);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const getRelativeLuminance = (color) => {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const calculateContrastRatio = () => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    
    const l1 = getRelativeLuminance(fg);
    const l2 = getRelativeLuminance(bg);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    const wcagLevel = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail';
    
    setResult({
      ratio: ratio.toFixed(2),
      wcagLevel,
      passes: wcagLevel !== 'fail'
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Color Contrast Verification Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Foreground Color (Text)</label>
          <Input
            type="color"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            className="h-10"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Background Color</label>
          <Input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="h-10"
          />
        </div>

        <Button onClick={calculateContrastRatio} className="w-full">
          Calculate Contrast
        </Button>

        {result && (
          <div 
            className="mt-4 p-4 rounded"
            style={{
              backgroundColor: background,
              color: foreground
            }}
          >
            <p className="text-lg font-bold">Sample Text</p>
            <div className="mt-2 space-y-1">
              <p>Contrast Ratio: {result.ratio}</p>
              <p>WCAG Level: {result.wcagLevel}</p>
              <p>Status: {result.passes ? '✅ Passes' : '❌ Fails'} WCAG Guidelines</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContrastVerifier;