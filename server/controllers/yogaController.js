const YogaModule = require('../models/YogaModule');

const getModules = async (req, res) => {
  try {
    const filter = {};
    // Explicitly cast to string to prevent NoSQL injection via object payloads
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.difficulty) filter.difficulty = String(req.query.difficulty);

    const modules = await YogaModule.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { count: modules.length, modules },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getModuleById = async (req, res) => {
  try {
    const module = await YogaModule.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Yoga module not found' });
    }

    return res.status(200).json({ success: true, data: { module } });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid module ID format' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getModules, getModuleById };
