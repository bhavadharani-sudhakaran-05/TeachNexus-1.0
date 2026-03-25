const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    // User & Subscription Info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    
    // Stripe Details
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    
    // Subscription Details
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'incomplete'],
      default: 'active',
    },
    
    // Billing
    monthlyPrice: Number,
    currency: String,
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    
    // Dates
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    renewalDate: Date,
    cancelledAt: Date,
    
    // Features Included
    featuresIncluded: [String],
    
    // Usage Tracking
    resourcesUploaded: {
      type: Number,
      default: 0,
    },
    resourceLimit: Number,
    collaboratorsCount: {
      type: Number,
      default: 0,
    },
    collaboratorLimit: Number,
    
    // Metadata
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
