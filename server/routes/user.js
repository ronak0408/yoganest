const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  toggleFavorite,
  getFavorites,
  getProgress,
  markComplete,
  updatePreferences,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

router.post('/favorites', apiLimiter, protect, toggleFavorite);
router.get('/favorites', apiLimiter, protect, getFavorites);
router.get('/progress', apiLimiter, protect, getProgress);
router.post('/progress', apiLimiter, protect, markComplete);
router.put('/preferences', apiLimiter, protect, updatePreferences);

module.exports = router;
