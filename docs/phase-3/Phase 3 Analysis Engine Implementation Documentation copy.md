# Phase 3: Analysis Engine Implementation Documentation

## Overview
This phase implements the core analysis engine that handles different types of inputs (URL, images) through a unified interface. The implementation includes a task queue system, input processors, and result aggregation.

## Directory Structure
```
packages/backend/src/
├── analysis/
│   ├── core/
│   │   └── analysis-engine.ts      # Main analysis engine implementation
│   ├── processors/
│   │   ├── url-processor.ts        # URL analysis processor
│   │   └── image-processor.ts      # Image analysis processor
│   ├── queue/
│   │   └── task-queue.ts          # Task queue management
│   └── types/
│       └── processor.ts           # Core interfaces and types
├── config/
│   └── env.ts                     # Environment configuration
└── utils/
    ├── database.ts               # Database utilities
    └── errors.ts                 # Error handling utilities
```

## Core Components

### 1. Task Queue (task-queue.ts)
The task queue manages asynchronous analysis tasks with the following features:

- **Concurrent Task Management**
  ```typescript
  private maxConcurrent: number;    // Maximum concurrent tasks
  private running: number;          // Currently running tasks
  ```

- **Task Status Tracking**
  ```typescript
  async add(task: () => Promise<ProcessorResult>): Promise<string>
  getStatus(id: string): ProcessorResult | undefined
  ```

- **Resource Management**
  - Automatic cleanup of completed tasks
  - Timeout handling
  - Error recovery

Usage Example:
```typescript
const taskQueue = new TaskQueue();
const taskId = await taskQueue.add(async () => {
  // Task implementation
  return result;
});
```

### 2. Processor Interface (processor.ts)
Defines the contract for all input processors:

```typescript
interface InputProcessor {
  validate(input: ProcessorInput): Promise<boolean>;
  process(input: ProcessorInput): Promise<ProcessorResult>;
  cleanup?(id: string): Promise<void>;
}
```

Key Types:
```typescript
interface ProcessorInput {
  projectId: string;
  source: AuditSource;
  content: string | Buffer;
  type: AuditType;
  maxSize?: number;
  options?: Record<string, unknown>;
}

interface ProcessorResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
}
```

### 3. Analysis Engine (analysis-engine.ts)
Coordinates the analysis process:

- **Processor Management**
  ```typescript
  private processors: Map<AuditSource, InputProcessor>;
  ```

- **Analysis Submission**
  ```typescript
  async submitAnalysis(input: ProcessorInput): Promise<ProcessorResult>
  ```

- **Status Tracking**
  ```typescript
  async getAnalysisStatus(id: string): Promise<ProcessorResult>
  ```

Usage Example:
```typescript
const engine = new AnalysisEngine();
const result = await engine.submitAnalysis({
  projectId: 'project-1',
  source: AuditSource.URL,
  content: 'https://example.com',
  type: AuditType.BASIC
});
```

## Integration Points

### 1. Database Integration
- Uses MongoDB models from Phase 2
- Stores analysis results and metadata
- Handles error states

```typescript
await Analysis.create({
  taskId: result.id,
  projectId: input.projectId,
  source: input.source,
  type: input.type,
  status: result.status,
  result: result.result
});
```

### 2. Error Handling
Standardized error handling using APIError:
```typescript
throw new APIError(400, 'Invalid input', details);
```

### 3. Configuration Management
Environment-based configuration:
```typescript
import { config } from '../../config/env';
const maxSize = config.analysis.maxImageSize;
```

## Usage in Future Phases

### Phase 4: Analysis Engine - Analyzers
- Extend `InputProcessor` interface for specific analyzers
- Use task queue for long-running analysis
- Store results using the established database patterns

### Phase 5: API Routes
- Use `AnalysisEngine` for handling analysis requests
- Implement status checking endpoints
- Handle result retrieval

### Phase 6: Frontend Components
- Display task progress using status endpoints
- Show analysis results in standardized format
- Handle different input types appropriately

## Testing
Core test cases include:

1. Task Queue Tests
```typescript
test('should handle concurrent tasks')
test('should respect max concurrent limit')
test('should handle task timeout')
```

2. Processor Tests
```typescript
test('should validate input correctly')
test('should process valid input')
test('should handle processing errors')
```

3. Integration Tests
```typescript
test('should complete full analysis pipeline')
test('should store results in database')
test('should handle multiple concurrent analyses')
```

## Error Handling Patterns
Standard error handling flow:
```typescript
try {
  const result = await processor.process(input);
  return result;
} catch (error) {
  if (error instanceof APIError) {
    throw error;
  }
  throw new APIError(500, 'Processing failed', error);
}
```

## Performance Considerations
1. Task Queue Limits
   - Configurable concurrent task limit
   - Memory management for large files
   - Timeout handling

2. Resource Management
   - Automatic cleanup of temporary files
   - Database connection pooling
   - Task queue monitoring

## Security Considerations
1. Input Validation
   - Size limits for uploads
   - Content type verification
   - URL validation

2. Resource Protection
   - Task isolation
   - Error containment
   - Rate limiting preparation

## Next Steps
1. Complete individual processor implementations
2. Add comprehensive test coverage
3. Implement monitoring and logging
4. Prepare for Phase 4 analyzer integration