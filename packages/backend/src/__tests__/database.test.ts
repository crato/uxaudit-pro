import { db } from '../utils/database';
import { User } from '../models/user';
import { UserRole, SubscriptionPlan } from '@uxaudit-pro/shared';

describe('Database Tests', () => {
  test('should connect to database', () => {
    expect(db.getConnection().readyState).toBe(1);
  });

  test('should create and retrieve a user', async () => {
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

    const user = new User(userData);
    await user.save();

    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeTruthy();
    expect(savedUser?.email).toBe(userData.email);
  });
});