import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9_]+$/.test(v);
        },
        message: 'Username can only contain letters, numbers, and underscores',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
      select: false,
    },
    emailVerificationOTPExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    permissions: {
      type: [String],
      default: [],
      // Possible permissions for admins:
      // 'posts.view', 'posts.create', 'posts.edit', 'posts.delete',
      // 'users.view', 'users.create', 'users.edit', 'users.delete',
      // 'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
      // 'tags.view', 'tags.create', 'tags.edit', 'tags.delete',
      // 'comments.view', 'comments.edit', 'comments.delete',
      // 'dashboard.analytics', 'dashboard.reports', 'dashboard.settings'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has specific permission
userSchema.methods.hasPermission = function (permission) {
  // Superadmin has all permissions
  if (this.role === 'superadmin') {
    return true;
  }
  
  // Check if user has the specific permission
  return this.permissions.includes(permission);
};

// Check if user has any of the specified permissions
userSchema.methods.hasAnyPermission = function (permissions) {
  if (this.role === 'superadmin') {
    return true;
  }
  
  return permissions.some(permission => this.permissions.includes(permission));
};

// Check if user has all of the specified permissions
userSchema.methods.hasAllPermissions = function (permissions) {
  if (this.role === 'superadmin') {
    return true;
  }
  
  return permissions.every(permission => this.permissions.includes(permission));
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate and set email verification OTP
userSchema.methods.generateEmailVerificationOTP = function () {
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash OTP and set to emailVerificationOTP field
  this.emailVerificationOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expire time (10 minutes)
  this.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000;

  return otp;
};

// Verify email OTP
userSchema.methods.verifyEmailOTP = function (otp) {
  // Hash the provided OTP
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp.toString())
    .digest('hex');

  // Check if OTP matches and hasn't expired
  const isValid = this.emailVerificationOTP === hashedOTP;
  const isNotExpired = this.emailVerificationOTPExpires > Date.now();

  return isValid && isNotExpired;
};

const User = mongoose.model('User', userSchema);

export default User;
