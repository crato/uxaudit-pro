import { UserProfile, UserRole } from '../types/user';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const hasPermission = (
  user: UserProfile,
  requiredRole: UserRole
): boolean => {
  const roleHierarchy = {
    [UserRole.ADMIN]: 4,
    [UserRole.OWNER]: 3,
    [UserRole.MEMBER]: 2,
    [UserRole.VIEWER]: 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};