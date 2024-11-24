export declare enum UserRole {
    ADMIN = "admin",
    OWNER = "owner",
    MEMBER = "member",
    VIEWER = "viewer"
}
export declare enum SubscriptionPlan {
    FREE = "free",
    BASIC = "basic",
    OWNER = "owner",
    AGENCY = "agency",
    ENTERPRISE = "enterprise"
}
export interface UserProfile {
    id: string;
    auth0Id: string;
    email: string;
    name: string;
    picture?: string;
    role: UserRole;
    subscription: {
        plan: SubscriptionPlan;
        startDate: Date;
        endDate?: Date;
        isActive: boolean;
        features: string[];
    };
    organization?: {
        id: string;
        name: string;
        role: UserRole;
    };
    preferences: {
        emailNotifications: boolean;
        theme: 'light' | 'dark' | 'system';
        language: string;
    };
    usage: {
        analysisCount: number;
        lastLoginAt: Date;
        projectsCount: number;
    };
}
