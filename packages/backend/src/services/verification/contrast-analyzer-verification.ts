// File: packages/backend/src/services/verification/contrast-analyzer-verification.ts
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { AnalysisEngine } from '../analysis/engine';
import { ColorContrastAnalyzer } from '../analysis/analyzers/color-contrast';
import { Analysis } from '../../models/analysis';
import { connectDatabase } from '../../utils/database';


export class ContrastAnalyzerVerification {
  private engine: AnalysisEngine;
  private analyzer: ColorContrastAnalyzer;

  constructor() {
    this.engine = new AnalysisEngine();
    this.analyzer = new ColorContrastAnalyzer();
    this.engine.registerProcessor(AuditSource.URL, this.analyzer);
  }

  async verify() {
    try {
      // Connect to database
      await connectDatabase();
      
      console.log('Running analysis on example.com...');
      
      // Test with a real URL
      const result = await this.engine.submitAnalysis({
        projectId: 'manual-test',
        source: AuditSource.URL,
        content: 'https://example.com',
        type: AuditType.ACCESSIBILITY
      });
      
      console.log('Analysis completed:');
      console.log(JSON.stringify(result, null, 2));
      
      // Check database for results
      const analysis = await Analysis.findOne({ projectId: 'manual-test' });
      console.log('\nStored in database:', analysis ? 'Yes' : 'No');
      
      return { success: true, result, analysis };
    } catch (error) {
      console.error('Verification failed:', error);
      return { success: false, error };
    }
  }
}