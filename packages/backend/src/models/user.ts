import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile, UserRole, SubscriptionPlan } from '@uxaudit-pro/shared';

export interface UserDocument extends Omit<UserProfile, 'id'>, Document {}

const userSchema = new Schema<UserDocument>({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: String,
  role: { 
    type: String, 
    enum: Object.values(UserRole),
    default: UserRole.MEMBER 
  },
  subscription: {
    plan: { 
      type: String, 
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE 
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    isActive: { type: Boolean, default: true },
    features: [String]
  },
  organization: {
    id: { type: Schema.Types.ObjectId, ref: 'Organization' },
    name: String,
    role: { 
      type: String, 
      enum: Object.values(UserRole)
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

export const User = mongoose.model<UserDocument>('User', userSchema);