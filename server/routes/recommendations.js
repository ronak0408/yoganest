const express = require('express');
const rateLimit = require('express-rate-limit');
const { getRecommendations } = require('../controllers/recommendationsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

router.get('/', apiLimiter, protect, getRecommendations);

module.exports = router;
