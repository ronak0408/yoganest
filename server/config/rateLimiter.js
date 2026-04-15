const rateLimit = require('express-rate-limit');

const createLimiter = (max, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });

const authLimiter = createLimiter(20);
const apiLimiter = createLimiter(200);

module.exports = { authLimiter, apiLimiter };
