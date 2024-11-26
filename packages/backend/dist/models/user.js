"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shared_1 = require("@uxaudit-pro/shared");
const userSchema = new mongoose_1.Schema({
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: String,
    role: {
        type: String,
        enum: Object.values(shared_1.UserRole),
        default: shared_1.UserRole.MEMBER
    },
    subscription: {
        plan: {
            type: String,
            enum: Object.values(shared_1.SubscriptionPlan),
            default: shared_1.SubscriptionPlan.FREE
        },
        startDate: { type: Date, default: Date.now },
        endDate: Date,
        isActive: { type: Boolean, default: true },
        features: [String]
    },
    organization: {
        id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
        name: String,
        role: {
            type: String,
            enum: Object.values(shared_1.UserRole)
        }
    },
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: { type: String, default: 'en' }
    },
    usage: {
        analysisCount: { type: Number, default: 0 },
        lastLoginAt: { type: Date, default: Date.now },
        projectsCount: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});
userSchema.index({ email: 1 });
userSchema.index({ auth0Id: 1 });
userSchema.index({ 'organization.id': 1 });
exports.User = mongoose_1.default.model('User', userSchema);
