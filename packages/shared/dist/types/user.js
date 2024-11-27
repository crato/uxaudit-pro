"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["OWNER"] = "owner";
    UserRole["MEMBER"] = "member";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "free";
    SubscriptionPlan["BASIC"] = "basic";
    SubscriptionPlan["OWNER"] = "owner";
    SubscriptionPlan["AGENCY"] = "agency";
    SubscriptionPlan["ENTERPRISE"] = "enterprise";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
