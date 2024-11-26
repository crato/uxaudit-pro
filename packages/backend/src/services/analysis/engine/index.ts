import { AuditSource } from '@uxaudit-pro/shared';
import { ProcessorInput, ProcessorResult, InputProcessor, TaskQueue } from './types';
import { APIError } from '@uxaudit-pro/shared';
import { ColorContrastAnalyzer } from '../analyzers/color-contrast';
import { TextReadabilityAnalyzer } from '../analyzers/text-readability';
import { ComponentSpacingAnalyzer } from '../analyzers/component-spacing';
import { ImageAnalyzer } from '../analyzers/image-analyzer';

class DefaultTaskQueue implements TaskQueue {
  private tasks: Map<string, ProcessorResult> = new Map();
  private maxConcurrent: number = 5;
  private running: number = 0;

  async add(task: () => Promise<ProcessorResult>): Promise<string> {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.tasks.set(id, {
      id,
      status: 'pending',
      progress: 0
    });

    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.running++;
    
    try {
      const result = await task();
      this.tasks.set(id, { ...result, id });
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.tasks.set(id, {
        id,
        status: 'failed',
        error: errorMessage
      });
      throw error;
    } finally {
      this.running--;
    }
  }

  getStatus(id: string): ProcessorResult | undefined {
    return this.tasks.get(id);
  }
}

export class AnalysisEngine {
  private static instance: AnalysisEngine;
  private processors: Map<AuditSource, InputProcessor> = new Map();
  private taskQueue: TaskQueue;

  private constructor(taskQueue?: TaskQueue) {
    this.taskQueue = taskQueue || new DefaultTaskQueue();
  }

  public static getInstance(taskQueue?: TaskQueue): AnalysisEngine {
    if (!AnalysisEngine.instance) {
      AnalysisEngine.instance = new AnalysisEngine(taskQueue);
      AnalysisEngine.instance.initialize();
    }
    return AnalysisEngine.instance;
  }

  public initialize(): void {
    // Register all analyzers
    this.registerProcessor(AuditSource.URL, new ColorContrastAnalyzer());
    this.registerProcessor(AuditSource.URL, new TextReadabilityAnalyzer());
    this.registerProcessor(AuditSource.URL, new ComponentSpacingAnalyzer());

     this.registerProcessor(AuditSource.IMAGE, new ImageAnalyzer());
  }

  registerProcessor(source: AuditSource, processor: InputProcessor) {
    this.processors.set(source, processor);
  }

  async submitAnalysis(input: ProcessorInput): Promise<ProcessorResult> {
    const processor = this.processors.get(input.source);
    
    if (!processor) {
      throw new APIError(400, `No processor registered for source: ${input.source}`);
    }

    const isValid = await processor.validate(input);
    if (!isValid) {
      throw new APIError(400, 'Invalid input for analysis');
    }

    const taskId = await this.taskQueue.add(async () => {
      return processor.process(input);
    });

    return this.taskQueue.getStatus(taskId)!;
  }

  async getAnalysisStatus(taskId: string): Promise<ProcessorResult | undefined> {
    return this.taskQueue.getStatus(taskId);
  }

  // Helper method to get processor (useful for testing)
  getProcessor(source: AuditSource): InputProcessor | undefined {
    return this.processors.get(source);
  }
}

// Export singleton instance
export const analysisEngine = AnalysisEngine.getInstance();