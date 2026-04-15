const express = require('express');
const { getRecommendations } = require('../controllers/recommendationsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getRecommendations);

module.exports = router;
