// File: packages/backend/src/services/analysis/analyzers/component-spacing.ts
import { InputProcessor, ProcessorInput, ProcessorResult } from '../engine/types';
import { APIError } from '@uxaudit-pro/shared';
import { JSDOM } from 'jsdom';

interface SpacingElement {
  type: string;
  margin: number[];
  padding: number[];
  location: string;
}

export class ComponentSpacingAnalyzer implements InputProcessor {
  private standardSpacing = [0, 4, 8, 16, 24, 32, 48]; // Standard spacing values in pixels

  async validate(input: ProcessorInput): Promise<boolean> {
    if (!input.content) {
      throw new APIError(400, 'No content provided');
    }
    return true;
  }

  async process(input: ProcessorInput): Promise<ProcessorResult> {
    try {
      const elements = await this.extractSpacingElements(input.content.toString());
      const issues: Array<{
        type: string;
        severity: 'critical' | 'warning' | 'info';
        message: string;
        location: string;
        value?: number;
        recommendation?: string;
      }> = [];

      this.checkSpacingConsistency(elements, issues);
      this.checkAlignment(elements, issues);

      return {
        id: input.projectId,
        status: 'completed',
        result: { issues }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new APIError(500, `Component spacing analysis failed: ${message}`);
    }
  }

  private parseSpacingValue(value: string): number {
    const match = value.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 0;
  }

  private async extractSpacingElements(html: string): Promise<SpacingElement[]> {
    const elements: SpacingElement[] = [];
    const dom = new JSDOM(html);
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

  private checkSpacingConsistency(elements: SpacingElement[], issues: any[]) {
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

  private checkAlignment(elements: SpacingElement[], issues: any[]) {
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