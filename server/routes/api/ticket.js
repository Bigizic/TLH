const express = require('express');
const router = express.Router();
const Ticket = require('../../models/ticket');
const Coupon = require('../../models/coupon');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');

// GET /ticket/me - return tickets based on user role
router.get(
  '/me',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const user = req.user;

      let tickets;

      if (user.role === ROLES.Admin) {
        // Admin: get events created by the user
        tickets = await Ticket.find({ user: user._id }).sort('-createdAt');
      }
      return res.status(200).json({ tickets });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// GET /events
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let tickets;

      if (req.user.role === ROLES.Organizer) {
        // Organizer: only return their own tickets
        tickets = await Ticket.find({ user: req.user._id }).sort('-createdAt');
      } else {
        // Admin: return all tickets
        tickets = await Ticket.find()
          .populate({
            path: 'user',
            populate: {
              path: 'organizer',
              model: 'Organizer',
            }
          }
        )
        .sort('-createdAt');
      }
      return res.status(200).json({ tickets });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const ticketId = req.params.id;
      const ticket = await Ticket.findById(ticketId)
      .populate('coupons')
      .populate('user');

      // Optional: If Organizer, only allow access to their own ticket
      if (req.user.role === ROLES.Organizer && !ticket.user.equals(req.user._id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }

      return res.status(200).json({ ticket });
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// POST /ticket - Add a single ticket
router.post(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const {
        type, price,
        discount, discountPrice,
        quantity
      } = req.body;
      const coupons = req.body.coupons.length > 0 ? req.body.coupons.map(coupon => coupon.value) : [];
      const user = req.user._id;

      const ticket = new Ticket({
        type,
        user,
        price,
        quantity,
        discount: discount || false,
        discountPrice: discountPrice || 0,
        coupons: coupons || []
      });

      const savedTicket = await ticket.save();

      return res.status(201).json({ success: true, ticket: savedTicket });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to add ticket', error: err.message });
    }
  }
);

// DELETE /ticket/:id - Delete a ticket by ID
router.delete(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const ticket = await Ticket.findByIdAndDelete(req.params.id);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
      return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete ticket', error: err.message });
    }
  }
);

// PUT /ticket/:id - Update a ticket
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      const { type, discount, price, discountPrice, quantity } = req.body;
      const coupons = req.body.coupons.length > 0 ? req.body.coupons.map(coupon => coupon.value) : [];
      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
          price,
          coupons,
          type,
          quantity,
          discount,
          discountPrice
        },
        { new: true }
      );

      if (!updatedTicket) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }

      return res.status(200).json({ success: true, message: 'Ticket updated successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update ticket', error: err.message });
    }
  }
);

// POST /ticket/add - Add multiple tickets
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
    try {
      let { tickets } = req.body;
      const user = req.user._id;

      tickets = tickets.map(ticket => {
      const couponIds = Array.isArray(ticket.coupons)
        ? ticket.coupons.map(c => c.value)
        : [];

      return {
        ...ticket,
        coupons: couponIds,
        user
      };
      });

      if (!Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({ success: false, message: 'Tickets is required' });
      }

      const savedTickets = await Ticket.insertMany(tickets);

      return res.status(201).json({ success: true, tickets: savedTickets });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to add tickets', error: err.message });
    }
  }
);

module.exports = router;
