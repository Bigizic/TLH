const express = require('express');
const router = express.Router();

const getServerStatus = require('./status');
const auth = require('./auth');
const user = require('./user');
const event = require('./event');
const ticket = require('./ticket');
const coupon = require('./coupon');
const gallery = require('./gallery');
const media = require('./media');
const cart = require('./cart');
const guest = require('./guest');
const order = require('./order');
const organizer = require('./organizer');
const scan = require('./qrCode');
const product = require('./product');
//const newsletter = require('./newsletter')

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
router.use('/gallery', gallery);
router.use('/media', media);
router.use('/cart', cart);
router.use('/guest', guest);
router.use('/order', order);
router.use('/organizer', organizer);
router.use('/scan', scan);
router.use('/product', product);

module.exports = router;