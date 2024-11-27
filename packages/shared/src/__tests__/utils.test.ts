import { 
  isValidEmail, 
  formatDate, 
  hasPermission, 
  UserRole, 
  UserProfile,
  SubscriptionPlan 
} from '../';

describe('Utility Functions', () => {
  test('validates email addresses correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  test('formats dates correctly', () => {
    const date = new Date('2024-01-01T12:00:00');
    expect(formatDate(date)).toMatch(/Jan 1, 2024/);
  });

  test('checks permissions correctly', () => {
    const adminUser: UserProfile = {
      id: '1',
      auth0Id: 'auth0|123',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      subscription: {
        plan: SubscriptionPlan.ENTERPRISE,  // Fixed: Using enum value instead of string
        startDate: new Date(),
        isActive: true,
        features: []
      },
      usage: {
        analysisCount: 0,
        lastLoginAt: new Date(),
        projectsCount: 0
      },
      preferences: {
        emailNotifications: true,
        theme: 'light',
        language: 'en'
      }
    };

    expect(hasPermission(adminUser, UserRole.MEMBER)).toBe(true);
    expect(hasPermission(adminUser, UserRole.ADMIN)).toBe(true);
  });
});