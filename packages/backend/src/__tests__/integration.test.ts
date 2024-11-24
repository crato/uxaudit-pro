import { 
  UserRole, 
  SubscriptionPlan, 
  AuditType, 
  AuditSource, 
  IssueSeverity,
  AuditIssue
} from '@uxaudit-pro/shared';
import { User } from '../models/user';
import { Analysis } from '../models/analysis';
import { createCrudHandlers } from '../utils/crud';

describe('Integration Tests', () => {
  const userCrud = createCrudHandlers(User);
  const analysisCrud = createCrudHandlers(Analysis);

  test('should handle pagination of analyses', async () => {
    // Create multiple analyses
    const createAnalysis = async (index: number) => {
      const testIssue = {
        id: `issue-${Date.now()}-${index}`,
        title: `Test Issue ${index}`,
        description: 'Test Description',
        severity: IssueSeverity.MEDIUM,
        category: 'UX',
        impact: 'Medium',
        effort: 'Low',
        recommendations: ['Fix the issue'],
        createdAt: new Date()
      };

      const analysisData = {
        projectId: `project-${Date.now()}-${index}`,
        auditType: AuditType.BASIC,
        source: AuditSource.URL,
        sourceUrl: `https://example.com/${index}`,
        issues: [testIssue],
        summary: {
          criticalCount: 0,
          highCount: 0,
          mediumCount: 1,
          lowCount: 0,
          infoCount: 0,
          totalScore: 85
        },
        metadata: {
          startedAt: new Date(),
          completedAt: new Date(),
          duration: 1000
        }
      };

      return analysisCrud.create(analysisData);
    };

    // Create analyses sequentially to ensure order
    for (let i = 0; i < 3; i++) {
      await createAnalysis(i);
    }

    // Wait a moment for writes to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify total count
    const totalCount = await Analysis.countDocuments();
    expect(totalCount).toBe(3);

    // Test first page
    const firstPage = await analysisCrud.findWithPagination(
      {}, 
      { 
        page: 1, 
        limit: 2,
        sort: { createdAt: -1 }
      }
    );
    
    expect(firstPage.data.length).toBe(2);
    expect(firstPage.total).toBe(3);
    expect(firstPage.hasNext).toBe(true);

    // Test second page
    const secondPage = await analysisCrud.findWithPagination(
      {}, 
      { 
        page: 2, 
        limit: 2,
        sort: { createdAt: -1 }
      }
    );

    expect(secondPage.data.length).toBe(1);
    expect(secondPage.total).toBe(3);
    expect(secondPage.hasNext).toBe(false);
  });

  test('should create and link user with analysis', async () => {
    // Create user
    const userData = {
      auth0Id: `test|${Date.now()}`,
      email: `test.${Date.now()}@example.com`,
      name: 'Test User',
      role: UserRole.MEMBER,
      subscription: {
        plan: SubscriptionPlan.FREE,
        startDate: new Date(),
        isActive: true,
        features: []
      },
      preferences: {
        emailNotifications: true,
        theme: 'light' as const,
        language: 'en'
      },
      usage: {
        analysisCount: 0,
        lastLoginAt: new Date(),
        projectsCount: 0
      }
    };

    const user = await userCrud.create(userData);

    // Create analysis linked to user
    const testIssue = {
      id: `issue-${Date.now()}`,
      title: 'Test Issue',
      description: 'Test Description',
      severity: IssueSeverity.MEDIUM,
      category: 'UX',
      impact: 'Medium',
      effort: 'Low',
      recommendations: ['Fix the issue'],
      createdAt: new Date()
    };

    const analysisData = {
      projectId: `project-${Date.now()}`,
      auditType: AuditType.BASIC,
      source: AuditSource.URL,
      sourceUrl: 'https://example.com',
      issues: [testIssue],
      summary: {
        criticalCount: 0,
        highCount: 0,
        mediumCount: 1,
        lowCount: 0,
        infoCount: 0,
        totalScore: 85
      },
      metadata: {
        startedAt: new Date(),
        completedAt: new Date(),
        duration: 1000
      }
    };

    const analysis = await analysisCrud.create(analysisData);

    // Update user's analysis count
    const updatedUser = await userCrud.updateById(user._id, {
      usage: {
        ...user.usage,
        analysisCount: user.usage.analysisCount + 1
      }
    });

    expect(updatedUser?.usage.analysisCount).toBe(1);
    expect(analysis.projectId).toBeTruthy();
  });
});