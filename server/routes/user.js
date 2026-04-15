const express = require('express');
const { apiLimiter } = require('../config/rateLimiter');
const {
  toggleFavorite,
  getFavorites,
  getProgress,
  markComplete,
  updatePreferences,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/favorites', apiLimiter, protect, toggleFavorite);
router.get('/favorites', apiLimiter, protect, getFavorites);
router.get('/progress', apiLimiter, protect, getProgress);
router.post('/progress', apiLimiter, protect, markComplete);
router.put('/preferences', apiLimiter, protect, updatePreferences);

module.exports = router;
