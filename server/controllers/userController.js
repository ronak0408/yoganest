const User = require('../models/User');
const YogaModule = require('../models/YogaModule');

// @desc    Toggle favorite status of a yoga module
// @route   POST /api/user/favorites
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { moduleId } = req.body;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required' });
    }

    const moduleExists = await YogaModule.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.some((id) => id.toString() === moduleId);

    if (isFavorited) {
      user.favorites = user.favorites.filter((id) => id.toString() !== moduleId);
    } else {
      user.favorites.push(moduleId);
    }

    await user.save();

    res.json({
      success: true,
      favorited: !isFavorited,
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's favorited modules
// @route   GET /api/user/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.json({ success: true, count: user.favorites.length, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's progress and completed modules
// @route   GET /api/user/progress
// @access  Private
const getProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('completedModules.module');

    const totalMinutes = user.completedModules.reduce(
      (sum, entry) => sum + (entry.duration || entry.module?.duration || 0),
      0
    );

    const categoryBreakdown = {};
    user.completedModules.forEach((entry) => {
      const cat = entry.module?.category;
      if (cat) categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalCompleted: user.completedModules.length,
        totalMinutes,
        categoryBreakdown,
      },
      data: user.completedModules,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a module as completed
// @route   POST /api/user/progress
// @access  Private
const markComplete = async (req, res, next) => {
  try {
    const { moduleId, duration } = req.body;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required' });
    }

    const moduleExists = await YogaModule.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    const user = await User.findById(req.user._id);

    user.completedModules.push({
      module: moduleId,
      completedAt: new Date(),
      duration: duration || moduleExists.duration,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Module marked as completed',
      completedModules: user.completedModules,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const { categories, timeOfDay, difficultyLevel } = req.body;

    const user = await User.findById(req.user._id);

    if (categories !== undefined) user.preferences.categories = categories;
    if (timeOfDay !== undefined) user.preferences.timeOfDay = timeOfDay;
    if (difficultyLevel !== undefined) user.difficultyLevel = difficultyLevel;

    await user.save();

    res.json({
      success: true,
      preferences: user.preferences,
      difficultyLevel: user.difficultyLevel,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggleFavorite, getFavorites, getProgress, markComplete, updatePreferences };
