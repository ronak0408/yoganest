const YogaModule = require('../models/YogaModule');

// @desc    Get all active yoga modules with optional filters
// @route   GET /api/yoga
// @access  Public
const getAllModules = async (req, res, next) => {
  try {
    const query = { isActive: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.difficulty) {
      query.difficultyLevel = req.query.difficulty;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const modules = await YogaModule.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single yoga module by ID
// @route   GET /api/yoga/:id
// @access  Public
const getModuleById = async (req, res, next) => {
  try {
    const module = await YogaModule.findOne({ _id: req.params.id, isActive: true });

    if (!module) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    res.json({ success: true, data: module });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllModules, getModuleById };
