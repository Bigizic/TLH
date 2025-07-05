const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const Coupon = require('../../models/coupon');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');

// GET /coupon/me - return coupons based on user role
router.get(
  '/me',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const user = req.user;

      let coupons;

      if (user.role === ROLES.Admin || user.role === ROLES.Organizer) {
        // Admin/Organizer: get coupons created by the user
        coupons = await Coupon.find({ user: user._id })
          .populate('event', 'name')
          .populate('ticket', 'type')
          .sort('-createdAt');
      }
      return res.status(200).json({ coupons });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /coupon - Get all coupons
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let coupons;

      if (req.user.role === ROLES.Organizer) {
        // Organizer: only return their own coupons
        coupons = await Coupon.find({ user: req.user._id })
          .populate('event', 'name')
          .populate('ticket', 'type')
          .populate({
            path: 'user',
            populate: {
              path: 'organizer',
              model: 'Organizer',
            }
          })
          .sort('-createdAt');
      } else {
        // Admin: return all coupons
        coupons = await Coupon.find()
          .populate('event', 'name')
          .populate('ticket', 'type')
          .populate({
            path: 'user',
            populate: {
              path: 'organizer',
              model: 'Organizer',
            }
          })
          .sort('-createdAt');
      }
      return res.status(200).json({ coupons });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /coupon/select - Get coupons for select options
router.get(
  '/select',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let coupons;

      if (req.user.role === ROLES.Organizer) {
        coupons = await Coupon.find({ user: req.user._id, active: true })
          .select('_id code percentage')
          .sort('code');
      } else {
        coupons = await Coupon.find({ active: true })
          .select('_id code percentage')
          .sort('code');
      }

      const couponsSelect = coupons.map(coupon => ({
        value: coupon._id,
        label: `${coupon.code} (${coupon.percentage}% off)`
      }));

      return res.status(200).json({ coupons: couponsSelect });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /coupon/:id - Get single coupon
router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const couponId = req.params.id;
      const coupon = await Coupon.findById(couponId)
        .populate('event', 'name')
        .populate('ticket', 'type')
        .populate('user');

      // Optional: If Organizer, only allow access to their own coupon
      if (req.user.role === ROLES.Organizer && !coupon.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found.' });
      }

      return res.status(200).json({ coupon });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// POST /coupon/add - Add new coupon
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const {
        code,
        percentage,
        event,
        ticket = [],
        quantity,
        userLimit,
        active = true
      } = req.body;

      const user = req.user._id;

      if (!code || !percentage || !event || !quantity || !userLimit) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ error: 'A coupon with this code already exists.' });
      }

      // Verify event exists
      const eventExists = await Event.findById(event);
      if (!eventExists) {
        return res.status(400).json({ error: 'Event not found.' });
      }

      // Verify tickets exist if provided
      if (ticket.length > 0) {
        const ticketsExist = await Ticket.find({ _id: { $in: ticket } });
        if (ticketsExist.length !== ticket.length) {
          return res.status(400).json({ error: 'One or more tickets not found.' });
        }
      }

      const discountPrice = percentage; // For now, using percentage as discount price

      const coupon = new Coupon({
        code: code.toUpperCase(),
        percentage,
        discountPrice,
        event,
        ticket,
        quantity,
        userLimit,
        active,
        user
      });

      await coupon.save();

      return res.status(200).json({
        success: true,
        message: 'Coupon has been added successfully!',
        coupon
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// PUT /coupon/:id - Update coupon
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const couponId = req.params.id;
      const {
        code,
        percentage,
        event,
        ticket = [],
        quantity,
        userLimit,
        active
      } = req.body;

      if (!code || !percentage || !event || !quantity || !userLimit) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found.' });
      }

      // Organizer can only update their own coupons
      if (req.user.role === ROLES.Organizer && !coupon.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      // Check if coupon code already exists (excluding current coupon)
      const existingCoupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: couponId }
      });
      if (existingCoupon) {
        return res.status(400).json({ error: 'A coupon with this code already exists.' });
      }

      // Update coupon fields
      coupon.code = code.toUpperCase();
      coupon.percentage = percentage;
      coupon.discountPrice = percentage;
      coupon.event = event;
      coupon.ticket = ticket;
      coupon.quantity = quantity;
      coupon.userLimit = userLimit;
      coupon.active = active !== undefined ? active : coupon.active;

      await coupon.save();

      return res.status(200).json({
        success: true,
        message: 'Coupon updated successfully!',
        coupon
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// DELETE /coupon/:id - Delete coupon
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const couponId = req.params.id;

      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found.' });
      }

      // Organizer can only delete their own coupons
      if (req.user.role === ROLES.Organizer && !coupon.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      await coupon.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully!'
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;