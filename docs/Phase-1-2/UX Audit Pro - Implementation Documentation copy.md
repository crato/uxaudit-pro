# UX Audit Pro - Implementation Documentation / Phases 1 & 2: Core Types, Utilities, and Database Setup

### Phase 1: Core Types and Utilities
#### 1. Project Structure
```
packages/shared/
├── src/
│   ├── types/
│   │   ├── audit.ts       (Audit related types)
│   │   ├── user.ts        (User management types)
│   │   └── project.ts     (Project structure types)
│   ├── utils/
│   │   ├── validation.ts  (Validation utilities)
│   │   ├── formatting.ts  (Formatting utilities)
│   │   └── errors.ts      (Error handling)
│   └── index.ts           (Main exports)
```

#### 2. Core Type Definitions
##### Audit Types
- `AuditType` enum: Basic, Comprehensive, Conversion, Accessibility, Design System
- `AuditSource` enum: URL, Figma, Image, PDF
- `IssueSeverity` enum: Critical, High, Medium, Low, Info
- `AuditIssue` interface: Issue details including severity, recommendations
- `AuditResult` interface: Complete analysis results structure

##### User Management Types
- `UserRole` enum: Admin, Owner, Member, Viewer
- `SubscriptionPlan` enum: Free, Basic, Owner, Agency, Enterprise
- `UserProfile` interface: Complete user profile with subscription and preferences

##### Project Types
- `ProjectStatus` enum: Active, Archived, Deleted
- `Project` interface: Project configuration and metadata
- `Organization` interface: Team/organization structure

#### 3. Utility Functions
##### Validation
- `isValidEmail`: Email format validation
- `hasPermission`: Role-based permission checking

##### Formatting
- `formatDate`: Consistent date formatting
- `formatFileSize`: Human-readable file sizes
- `formatNumber`: Number formatting with separators

##### Error Handling
- `APIError` class: Standardized API error handling
- `ValidationError` class: Input validation errors
- `ErrorCode` enum: Standard error codes

### Phase 2: Database Setup
#### 1. Project Structure
```
packages/backend/
├── src/
│   ├── models/
│   │   ├── user.ts        (User model)
│   │   ├── analysis.ts    (Analysis model)
│   │   └── index.ts       (Model exports)
│   ├── utils/
│   │   ├── database.ts    (Connection management)
│   │   └── crud.ts        (CRUD operations)
│   ├── config/
│   │   └── env.ts         (Environment configuration)
│   └── __tests__/
│       ├── setup.ts       (Test setup)
│       ├── database.test.ts
│       └── crud.test.ts
```

#### 2. Database Models
##### User Model
- Implements `UserProfile` interface from Phase 1
- Includes indexes for `auth0Id`, `email`
- Handles subscription and usage tracking

##### Analysis Model
- Implements `AuditResult` interface from Phase 1
- Includes indexes for efficient querying
- Manages relationship with projects

#### 3. Database Utilities
##### Connection Management
- Singleton pattern for database connection
- Environment-based configuration
- Connection event handling
- Graceful shutdown support

##### CRUD Operations
- Generic `CrudOperations<T>` class
- Type-safe database operations
- Pagination support
- Error handling integration

#### 4. Testing Infrastructure
##### Test Setup
- MongoDB Memory Server for testing
- Automatic cleanup between tests
- Isolation of test cases

##### Test Coverage
- Database connection tests
- CRUD operation tests
- Integration tests
- Pagination tests

### Integration Points
1. Type Safety
   - All database models use Phase 1 types
   - CRUD operations maintain type safety
   - Error handling uses shared error types

2. Validation
   - Models validate against shared types
   - Utilities use shared validation functions
   - Error handling uses shared error classes

3. Error Handling
   - Consistent error format using `APIError`
   - Type-safe error responses
   - Proper error propagation

### Usage Examples
```typescript
// Creating a user
const userCrud = createCrudHandlers(User);
const user = await userCrud.create({
  auth0Id: 'auth0|123',
  email: 'user@example.com',
  role: UserRole.MEMBER,
  // ... other fields
});

// Creating an analysis
const analysisCrud = createCrudHandlers(Analysis);
const analysis = await analysisCrud.create({
  projectId: 'project-id',
  auditType: AuditType.BASIC,
  // ... other fields
});

// Pagination
const results = await analysisCrud.findWithPagination(
  { auditType: AuditType.BASIC },
  { page: 1, limit: 10 }
);
```

### Next Steps
1. API Routes Implementation
2. Authentication Integration
3. Frontend Components
4. Figma Plugin Development

### Key Features
- Type-safe database operations
- Comprehensive error handling
- Efficient database queries
- Scalable architecture
- Testable components
- Maintainable codebase