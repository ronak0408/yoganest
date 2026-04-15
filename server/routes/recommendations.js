const express = require('express');
const { apiLimiter } = require('../config/rateLimiter');
const { getRecommendations } = require('../controllers/recommendationsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', apiLimiter, protect, getRecommendations);

module.exports = router;
