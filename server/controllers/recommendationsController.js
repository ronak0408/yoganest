const YogaModule = require('../models/YogaModule');
const User = require('../models/User');

const TIME_CATEGORY_MAP = {
  morning: ['Energy', 'Flexibility'],
  afternoon: ['Strength', 'Balance'],
  evening: ['Relaxation', 'Meditation'],
};

// @desc    Get personalized yoga recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { difficultyLevel, preferences, completedModules } = user;

    const completedIds = completedModules.map((c) => c.module.toString());

    // Build scoring criteria
    const timeOfDay = preferences.timeOfDay || detectTimeOfDay();
    const preferredByTime = TIME_CATEGORY_MAP[timeOfDay] || [];
    const preferredByUser = preferences.categories || [];

    // Fetch all active modules matching user difficulty (also include lower levels)
    const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced'];
    const allowedDifficulties = difficultyOrder.slice(
      0,
      difficultyOrder.indexOf(difficultyLevel) + 1
    );

    const modules = await YogaModule.find({
      isActive: true,
      difficultyLevel: { $in: allowedDifficulties },
    });

    // Score each module
    const scored = modules.map((mod) => {
      let score = 0;

      // Prefer modules not yet completed
      if (!completedIds.includes(mod._id.toString())) score += 10;

      // Prefer categories matching time of day
      if (preferredByTime.includes(mod.category)) score += 5;

      // Prefer categories from user preferences
      if (preferredByUser.includes(mod.category)) score += 5;

      // Prefer higher-rated modules
      score += mod.rating;

      return { module: mod, score };
    });

    // Sort by score descending, then by least recently completed
    const completedMap = {};
    completedModules.forEach((c) => {
      const id = c.module.toString();
      if (!completedMap[id] || completedMap[id] < c.completedAt) {
        completedMap[id] = c.completedAt;
      }
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aDate = completedMap[a.module._id.toString()] || new Date(0);
      const bDate = completedMap[b.module._id.toString()] || new Date(0);
      return aDate - bDate; // least recently completed first
    });

    const recommendations = scored.slice(0, 6).map((s) => s.module);

    res.json({
      success: true,
      timeOfDay,
      difficultyLevel,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (err) {
    next(err);
  }
};

function detectTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

module.exports = { getRecommendations };
