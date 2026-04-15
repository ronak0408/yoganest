const mongoose = require('mongoose');

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
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: [true, 'Difficulty is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  imageUrl: {
    type: String,
    default: 'https://placehold.co/600x400?text=Yoga+Module',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  instructions: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  calories: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('YogaModule', yogaModuleSchema);
