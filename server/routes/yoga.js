const express = require('express');
const { apiLimiter } = require('../config/rateLimiter');
const { getAllModules, getModuleById } = require('../controllers/yogaController');

const router = express.Router();

router.get('/', apiLimiter, getAllModules);
router.get('/:id', apiLimiter, getModuleById);

module.exports = router;
