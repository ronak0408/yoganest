const express = require('express');
const {
  toggleFavorite,
  getFavorites,
  getProgress,
  markComplete,
  updatePreferences,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.get('/progress', protect, getProgress);
router.post('/progress', protect, markComplete);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
