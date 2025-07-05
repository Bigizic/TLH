const express = require('express');
const router = express.Router();

const getServerStatus = require('./status');
const auth = require('./auth');
const user = require('./user');
const event = require('./event');
const ticket = require('./ticket');
const coupon = require('./coupon');

// for static file uploads
router.use('/uploads', express.static(process.cwd() + "/file_manager/uploads", {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));



router.use('/status', getServerStatus);
router.use('/auth', auth);
router.use('/user', user);
router.use('/event', event);
router.use('/ticket', ticket);
router.use('/coupon', coupon);

module.exports = router;