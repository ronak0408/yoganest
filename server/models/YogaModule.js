const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number },
  },
  { _id: false }
);

const yogaModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'],
    required: [true, 'Category is required'],
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: [true, 'Difficulty level is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  imageUrl: {
    type: String,
    default: '/images/yoga-default.jpg',
  },
  videoUrl: {
    type: String,
  },
  instructor: {
    type: String,
  },
  benefits: {
    type: [String],
    default: [],
  },
  steps: {
    type: [stepSchema],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

yogaModuleSchema.index({ category: 1, difficultyLevel: 1 });

module.exports = mongoose.model('YogaModule', yogaModuleSchema);
