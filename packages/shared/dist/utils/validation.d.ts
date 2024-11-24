import { UserProfile, UserRole } from '../types/user';
export declare const isValidEmail: (email: string) => boolean;
export declare const hasPermission: (user: UserProfile, requiredRole: UserRole) => boolean;
