const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  preferences: {
    categories: {
      type: [String],
      default: [],
    },
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', ''],
      default: '',
    },
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'YogaModule',
    },
  ],
  completedModules: [
    {
      module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YogaModule',
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
      duration: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
