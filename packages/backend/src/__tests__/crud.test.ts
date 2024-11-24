import { User } from '../models/user';
import { createCrudHandlers } from '../utils/crud';
import { UserRole, SubscriptionPlan } from '@uxaudit-pro/shared';

describe('CRUD Operations Tests', () => {
  const userCrud = createCrudHandlers(User);

  const createUniqueUserData = (identifier: string) => ({
    auth0Id: `test|${identifier}-${Date.now()}`,
    email: `test.${identifier}-${Date.now()}@example.com`,
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
  });

  test('should create a new user', async () => {
    const userData = createUniqueUserData('create');
    const user = await userCrud.create(userData);
    expect(user.email).toBe(userData.email);
  });

  test('should find user by id', async () => {
    const userData = createUniqueUserData('find');
    const created = await userCrud.create(userData);
    const found = await userCrud.findById(created._id.toString());
    expect(found?.email).toBe(userData.email);
  });

  test('should update user', async () => {
    const userData = createUniqueUserData('update');
    const created = await userCrud.create(userData);
    
    const updatedData = { name: 'Updated Name' };
    const updated = await userCrud.updateById(created._id.toString(), updatedData);
    
    expect(updated).toBeTruthy();
    expect(updated?.name).toBe('Updated Name');
  });

  test('should delete user', async () => {
    const userData = createUniqueUserData('delete');
    const created = await userCrud.create(userData);
    
    const deleted = await userCrud.deleteById(created._id.toString());
    expect(deleted).toBe(true);
    
    const found = await userCrud.findById(created._id.toString());
    expect(found).toBeNull();
  });

  test('should paginate results', async () => {
    // Create test users sequentially
    for (let i = 0; i < 3; i++) {
      const userData = createUniqueUserData(`page${i}`);
      await userCrud.create(userData);
    }

    // Wait for a moment to ensure all writes are complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify total count
    const totalUsers = await User.countDocuments();
    expect(totalUsers).toBe(3);

    // Test first page
    const firstPage = await userCrud.findWithPagination(
      {}, 
      { page: 1, limit: 2, sort: { createdAt: -1 } }
    );

    expect(firstPage.data.length).toBe(2);
    expect(firstPage.total).toBe(3);
    expect(firstPage.hasNext).toBe(true);

    // Test second page
    const secondPage = await userCrud.findWithPagination(
      {}, 
      { page: 2, limit: 2, sort: { createdAt: -1 } }
    );

    expect(secondPage.data.length).toBe(1);
    expect(secondPage.total).toBe(3);
    expect(secondPage.hasNext).toBe(false);
  });
});