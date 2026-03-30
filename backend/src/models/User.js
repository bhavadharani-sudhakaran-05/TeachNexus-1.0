const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    profilePicture: {
      url: String,
      publicId: String,
    },
    coverPhoto: {
      url: String,
      publicId: String,
    },
    biography: {
      type: String,
      maxlength: 500,
    },
    
    // Teacher/User Type
    userType: {
      type: String,
      enum: ['teacher', 'admin', 'school_admin'],
      default: 'teacher',
    },
    
    // School & Credentials
    schoolName: String,
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    teachingCredentials: {
      certificationNumber: String,
      certificationBody: String,
      expiryDate: Date,
    },
    
    // Teaching Info
    subjectSpecializations: [String], // e.g., ['Mathematics', 'Science']
    gradeLevels: [String], // e.g., ['Grade 9', 'Grade 10']
    yearsOfExperience: Number,
    teachingStyle: String, // e.g., 'Collaborative', 'Lecture-Based', 'Project-Based'
    
    // Contact & Social
    phoneNumber: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      website: String,
    },
    
    // Gamification & Stats
    experiencePoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    totalResourcesUploaded: {
      type: Number,
      default: 0,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
    communityReputation: {
      type: Number,
      default: 0,
    },
    achievementBadges: [
      {
        badgeId: String,
        unlockedAt: Date,
      },
    ],
    
    // CPD & Learning
    cpdPointsEarned: {
      type: Number,
      default: 0,
    },
    cpdCertificatesEarned: [
      {
        certificateId: String,
        academicYear: String,
        pointsEarned: Number,
        issuedAt: Date,
      },
    ],
    
    // Mentorship
    mentorshipStatus: {
      type: String,
      enum: ['none', 'mentor', 'mentee', 'both'],
      default: 'none',
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    menteeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // Resources & Activity
    uploadedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    favoriteResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    
    // Community
    joinedCommunities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
      },
    ],
    
    // Subscription & Account
    subscriptionTier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    stripeCustomerId: String,
    subscriptionEndDate: Date,
    
    // Account Settings
    isDashboardOnboarded: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    
    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      inAppNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en',
        enum: ['en', 'es'],
      },
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    
    // Metadata
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || 10);
    const salt = await bcrypt.genSalt(rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user public profile
userSchema.methods.getPublicProfile = function () {
  const { password, twoFactorSecret, stripeCustomerId, ...publicProfile } =
    this.toObject();
  return publicProfile;
};

module.exports = mongoose.model('User', userSchema);
