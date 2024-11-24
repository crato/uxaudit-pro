"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe('Utility Functions', () => {
    test('validates email addresses correctly', () => {
        expect((0, __1.isValidEmail)('test@example.com')).toBe(true);
        expect((0, __1.isValidEmail)('invalid-email')).toBe(false);
    });
    test('formats dates correctly', () => {
        const date = new Date('2024-01-01T12:00:00');
        expect((0, __1.formatDate)(date)).toMatch(/Jan 1, 2024/);
    });
    test('checks permissions correctly', () => {
        const adminUser = {
            id: '1',
            auth0Id: 'auth0|123',
            email: 'admin@example.com',
            name: 'Admin User',
            role: __1.UserRole.ADMIN,
            subscription: {
                plan: __1.SubscriptionPlan.ENTERPRISE, // Fixed: Using enum value instead of string
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
        expect((0, __1.hasPermission)(adminUser, __1.UserRole.MEMBER)).toBe(true);
        expect((0, __1.hasPermission)(adminUser, __1.UserRole.ADMIN)).toBe(true);
    });
});
