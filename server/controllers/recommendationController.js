const User = require('../models/User');
const YogaModule = require('../models/YogaModule');

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced'];

const TIME_OF_DAY_CATEGORIES = {
  Morning: ['Energy', 'Flexibility'],
  Evening: ['Relaxation', 'Meditation'],
  Anytime: ['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'],
};

const getAdjacentLevels = (level) => {
  const idx = LEVEL_ORDER.indexOf(level);
  const levels = [level];
  if (idx > 0) levels.push(LEVEL_ORDER[idx - 1]);
  if (idx < LEVEL_ORDER.length - 1) levels.push(LEVEL_ORDER[idx + 1]);
  return levels;
};

const buildReasonString = (module, userLevel, userPreferences) => {
  if (module.difficulty === userLevel) {
    return `Matched to your ${userLevel} level`;
  }
  if (
    userPreferences.categories &&
    userPreferences.categories.length > 0 &&
    userPreferences.categories.includes(module.category)
  ) {
    return `Based on your interest in ${module.category}`;
  }
  if (module.isPopular) {
    return 'Popular with the YogaNest community';
  }
  return `Great for ${module.category} practice`;
};

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { level, preferences } = user;
    const timeOfDay = preferences?.timeOfDay || 'Anytime';
    const preferredCategories = preferences?.categories || [];

    // Get recently completed module IDs (last 5) to exclude
    const sortedSessions = [...user.completedSessions].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );
    const recentlyCompletedIds = sortedSessions
      .slice(0, 5)
      .map((s) => s.module.toString());

    const eligibleLevels = getAdjacentLevels(level);

    // Build category filter: merge time-of-day categories with user preferences
    const timeCategories = TIME_OF_DAY_CATEGORIES[timeOfDay] || TIME_OF_DAY_CATEGORIES.Anytime;
    const categoryPool =
      preferredCategories.length > 0
        ? preferredCategories.filter((c) => timeCategories.includes(c)).length > 0
          ? preferredCategories.filter((c) => timeCategories.includes(c))
          : timeCategories // fall back to time-of-day if no overlap
        : timeCategories;

    const allModules = await YogaModule.find({
      difficulty: { $in: eligibleLevels },
    });

    // Score and sort candidates
    const scored = allModules
      .filter((m) => !recentlyCompletedIds.includes(m._id.toString()))
      .map((m) => {
        let score = 0;
        if (m.difficulty === level) score += 3;
        if (categoryPool.includes(m.category)) score += 2;
        if (preferredCategories.includes(m.category)) score += 2;
        if (m.isPopular) score += 1;
        return { module: m, score };
      })
      .sort((a, b) => b.score - a.score);

    const topModules = scored.slice(0, 6);

    const recommendations = topModules.map(({ module }) => ({
      module,
      reason: buildReasonString(module, level, preferences),
    }));

    return res.status(200).json({
      success: true,
      data: { count: recommendations.length, recommendations },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecommendations };
