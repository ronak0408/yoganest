const express = require('express');
const {
  toggleFavorite,
  getFavorites,
  logProgress,
  getProgress,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.post('/progress', protect, logProgress);
router.get('/progress', protect, getProgress);

module.exports = router;
