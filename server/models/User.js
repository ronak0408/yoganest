const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const completedSessionSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'YogaModule', required: true },
    completedAt: { type: Date, default: Date.now },
    duration: { type: Number, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  preferences: {
    categories: { type: [String], default: [] },
    timeOfDay: {
      type: String,
      enum: ['Morning', 'Evening', 'Anytime'],
      default: 'Anytime',
    },
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'YogaModule' }],
  completedSessions: { type: [completedSessionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
