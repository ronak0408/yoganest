const express = require('express');
const { getModules, getModuleById } = require('../controllers/yogaController');

const router = express.Router();

router.get('/', getModules);
router.get('/:id', getModuleById);

module.exports = router;
