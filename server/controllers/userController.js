const User = require('../models/User');
const YogaModule = require('../models/YogaModule');

const toggleFavorite = async (req, res) => {
  const { moduleId } = req.body;

  if (!moduleId) {
    return res.status(400).json({ success: false, message: 'moduleId is required' });
  }

  try {
    const moduleExists = await YogaModule.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.some((id) => id.toString() === moduleId);

    let action;
    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== moduleId);
      action = 'removed';
    } else {
      user.favorites.push(moduleId);
      action = 'added';
    }

    await user.save();
    await user.populate('favorites');

    return res.status(200).json({
      success: true,
      data: { action, favorites: user.favorites },
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid moduleId format' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    return res.status(200).json({
      success: true,
      data: { count: user.favorites.length, favorites: user.favorites },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const logProgress = async (req, res) => {
  const { moduleId, duration } = req.body;

  if (!moduleId || duration == null) {
    return res.status(400).json({ success: false, message: 'moduleId and duration are required' });
  }

  if (typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ success: false, message: 'duration must be a positive number' });
  }

  try {
    const moduleExists = await YogaModule.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    const user = await User.findById(req.user._id);
    user.completedSessions.push({ module: moduleId, duration, completedAt: new Date() });
    await user.save();

    return res.status(201).json({
      success: true,
      data: {
        message: 'Session logged successfully',
        session: user.completedSessions[user.completedSessions.length - 1],
      },
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid moduleId format' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('completedSessions.module');

    const completedSessions = user.completedSessions;
    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Calculate streak: consecutive days with at least one completed session
    const streakDays = calculateStreak(completedSessions);

    return res.status(200).json({
      success: true,
      data: {
        completedSessions,
        stats: { totalSessions, totalMinutes, streakDays },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;

  const uniqueDays = [
    ...new Set(
      sessions.map((s) => new Date(s.completedAt).toISOString().split('T')[0])
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must include today or yesterday to be active
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffMs = prev - curr;
    const diffDays = diffMs / 86400000;
    if (Math.round(diffDays) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

module.exports = { toggleFavorite, getFavorites, logProgress, getProgress };
