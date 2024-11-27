// File: packages/backend/src/services/analysis/engine/__tests__/engine.test.ts
import { AnalysisEngine, analysisEngine } from '../index';
import { ProcessorInput, InputProcessor } from '../types';
import { AuditSource, AuditType } from '@uxaudit-pro/shared';
import { APIError } from '@uxaudit-pro/shared';

describe('AnalysisEngine', () => {
  let engine: AnalysisEngine;
  let mockProcessor: jest.Mocked<InputProcessor>;

  beforeEach(() => {
    mockProcessor = {
      validate: jest.fn(),
      process: jest.fn()
    };
    engine = new AnalysisEngine();
  });

  test('should register processor', () => {
    engine.registerProcessor(AuditSource.URL, mockProcessor);
    expect(engine).toBeDefined();
  });

  test('should handle analysis submission', async () => {
    engine.registerProcessor(AuditSource.URL, mockProcessor);
    mockProcessor.validate.mockResolvedValue(true);
    mockProcessor.process.mockResolvedValue({
      id: 'test',
      status: 'completed'
    });

    const input: ProcessorInput = {
      projectId: 'test',
      source: AuditSource.URL,
      content: 'https://example.com',
      type: AuditType.ACCESSIBILITY
    };

    const result = await engine.submitAnalysis(input);
    expect(result.status).toBe('completed');
  });

  test('should handle invalid input', async () => {
    engine.registerProcessor(AuditSource.URL, mockProcessor);
    mockProcessor.validate.mockResolvedValue(false);

    const input: ProcessorInput = {
      projectId: 'test',
      source: AuditSource.URL,
      content: '',
      type: AuditType.ACCESSIBILITY
    };

    await expect(engine.submitAnalysis(input)).rejects.toThrow(APIError);
  });
});