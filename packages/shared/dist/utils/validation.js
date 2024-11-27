"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.isValidEmail = void 0;
const user_1 = require("../types/user");
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const hasPermission = (user, requiredRole) => {
    const roleHierarchy = {
        [user_1.UserRole.ADMIN]: 4,
        [user_1.UserRole.OWNER]: 3,
        [user_1.UserRole.MEMBER]: 2,
        [user_1.UserRole.VIEWER]: 1
    };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
exports.hasPermission = hasPermission;
