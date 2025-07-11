const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../utils/constants');
const PaymentHandler = require('../../utils/paystack');

/**
 * generates unique code
 */
const generateUniqueCode = () => {
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code
}

/**
 * create new object id (_id)
 * @returns 
 */
const newObjectId = async() => {
  let uniqueCode = generateUniqueCode()
  let orderFound = await Order.exists({ _id: uniqueCode })

  while (orderFound) {
    uniqueCode = generateUniqueCode();
    orderFound = await Order.exists({ _id: uniqueCode })
  }
  return uniqueCode;
}

router.post('/add', async (req, res) => {
  try {
    const {
      cart,
      guest,
      user,
      finalAmount,
      events,
      tickets,
      discountPrice,
      amountBeforeDiscount,
      payStackId,
      billingEmail,
    } = req.body;

    const cartDoc = await Cart.findById(cart);
    if (!cartDoc) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    if (guest) {
        cartDoc.guest = guest
        await cartDoc.save()
    }
    const ID = await newObjectId();

    const order = new Order({
      _id: ID,
      cart,
      user,
      guest,
      events,
      tickets,
      finalAmount,
      discountAmount: discountPrice || 0,
      amountBeforeDiscount,
      payStackId,
      billingEmail,
      status: false
    });

    await order.save();

    return res.status(200).json({
      success: true,
      orderId: order._id
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


router.put('/edit/order/', async (req, res) => {
  try {
    const payStackId = req.body.payStackId;
    const payStackReference = req.body.paystackReference;
    
    // confirm order via paystack
    const verifyPayment = await PaymentHandler(payStackId);
    const paymentStatus = verifyPayment.data.status
    const status = verifyPayment.data.status === 'success' ? true : false;
    const paymentMethod = verifyPayment.data.channel;
    const paymentFees = Math.round(verifyPayment.data.fees / 100);

    const update = {
        $set: {
          payStackReference,
          status,
          paymentMethod,
          paymentStatus,
          paymentFees,
        }
      }
    //const options = { new: true };
    const updateOrder = await Order.findOneAndUpdate(
        { payStackId: payStackId },
        update,
    )
  
    const cartDoc = await Cart.findById(updateOrder.cart)
      .populate('tickets.eventId')
      .populate('tickets.ticketId');

    if (status) {
        const newOrder = {
          _id: updateOrder._id,
          created: updateOrder.createdAt,
          user: updateOrder.user !== null ? updateOrder.user : updateOrder.guest,
          cart: cartDoc,
          finalAmount: updateOrder.finalAmount,
          events: updateOrder.events,
          tickets: updateOrder.tickets,
          discountPrice: updateOrder.discountPrice,
          amountBeforeDiscount: updateOrder.amountBeforeDiscount,
          billingEmail: updateOrder.billingEmail,

          paystackReference: payStackReference,
          paymentMethod: `paid with ${paymentMethod}`,
          //image: 'https://res.cloudinary.com/dduai6ryd/image/upload/v1736088530/ithoan/images/logo/business_logo.png'
        };
  
        // decrease quantity if the order has been successful
        decreaseQuantity(cartDoc.tickets);
  
        // await mailgun.sendEmail(updateOrder.billingEmail, 'order-confirmation', newOrder);
  
        // send email to admin
        /*if (adminEmail) {
          await mailgun.sendEmail(adminEmail, 'admin-order-confirmation', newOrder);
        }*/
       // send email to organizer if event user role is organizer
       const alertedOrganizer = [];
       /*for (const eventId of cartDoc.events) {
         const organizer = await Event.findOne({ _id: eventId }).populate('user');
         if (organizer.user.role === ROLES.Organizer) {
            if (!alertedOrganizer.includes(organizer.user._id)){
              alertedOrganizer.push(organizer.user._id)
              // send organizer email here as user can select multiple events belonging to different organizers
              // so we want to alert each organizer
            }
         }
       }*/
  
        return res.status(200).json({
          success: true,
          message: `Your order has been placed successfully!`,
          order: { _id: updateOrder._id },
          // paystack_access_code: paystackData.access_code,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  
})

// fetch order api
router.get(
  '/id/:id',
  auth,
  async (req, res) => {
  try {
    const orderId = req.params.id;
    const currentUser = req.user;
    // Base order query
    let orderDoc = await Order.findOne({ _id: orderId })
      .populate('events')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        },
      })
      .populate('guest');
    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    let address = null, phoneNumber = null;
    if (orderDoc.address?? orderDoc.address.street.length > 0) {
      address = orderDoc.address
    }
    if (orderDoc.phoneNumber && orderDoc.phoneNumber.length > 0) {
      phoneNumber = orderDoc.phoneNumber
    }

    let order = {
      _id: orderDoc._id,
      createdAt: orderDoc.createdAt,
      user: orderDoc.user,
      guest: orderDoc.guest,
      billingEmail: orderDoc.billingEmail,
      address: address !== null ? address : null,
      phoneNumber: phoneNumber !== null ? phoneNumber : null,
      finalAmount: orderDoc.finalAmount,
      discountAmount: orderDoc.discountAmount,
      paymentMethod: orderDoc.paymentMethod,
      paymentFees: orderDoc.paymentFees,
      amountBeforeDiscount: orderDoc.amountBeforeDiscount,
      status: orderDoc.status,
      cart: orderDoc.cart,
      events: orderDoc.events,
    };

    // === Admin Logic ===
    if (currentUser.role === ROLES.Admin) {
      const paymentDetails = await PaymentHandler(orderDoc.payStackId);
      order = {
        ...order,
        payStackId: orderDoc.payStackId,
        payStackReference: orderDoc.payStackReference,
        paymentStatus: paymentDetails.data.status,
        paymentDate: paymentDetails.data.paid_at,
        paymentCurrency: paymentDetails.data.currency,
      };
    }

    // === User Logic ===
    else if (currentUser.role === ROLES.User) {
      const paymentDetails = await PaymentHandler(orderDoc.payStackId);
      order = {
        ...order,
        paymentStatus: paymentDetails.data.status,
        paymentDate: paymentDetails.data.paid_at,
        paymentCurrency: paymentDetails.data.currency,
      };
    }

    // === Organizer Logic ===
    else if (currentUser.role === ROLES.Organizer) {
      const organizerId = currentUser._id.toString();

      const filteredEvents = orderDoc.events.filter(
        (event) => event.user.toString() === organizerId
      );

      const filteredTickets = orderDoc.cart?.tickets?.filter(
        (ticket) =>
          ticket.eventId &&
          ticket.eventId.user &&
          ticket.eventId.user.toString() === organizerId
      );

      order = {
        ...order,
        events: filteredEvents,
        cart: {
          ...orderDoc.cart.toObject(),
          tickets: filteredTickets,
        }
      };
    }

    return res.status(200).json({ order });

  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch orders related to an organizer event or all orders for admin
router.get(
  '/all_orders',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer),
  async (req, res) => {
  try {
    const user = req.user;
    let orders = await Order.find()
      .populate('events')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
      .populate('guest')
      .sort('-createdAt')
    if (user.role === ROLES.Organizer) {
      const organizerId = user._id.toString();

      orders = orders
        .map((order) => {
          // Filter events that belong to organizer
          const relevantEvents = order.events.filter(
            (event) => event.user.toString() === organizerId
          );

          // Filter tickets in cart that belong to organizer's events
          const relevantTickets = order.cart?.tickets?.filter(
            (ticket) =>
              ticket.eventId &&
              ticket.eventId.user &&
              ticket.eventId.user.toString() === organizerId
          );

          // Only return the order if there's at least one relevant event or ticket
          if (relevantEvents.length > 0 || relevantTickets.length > 0) {
            return {
              ...order.toObject(),
              events: relevantEvents,
              cart: {
                ...order.cart.toObject(),
                tickets: relevantTickets,
              },
            };
          }

          return null;
        })
        .filter(Boolean); // remove nulls
    }
    return res.status(200).json({
      status: 200,
      orders
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
})


// fetch my orders api
router.get(
  '/me',
  auth,
  role.check(ROLES.Admin, ROLES.Organizer, ROLES.Member),
  async (req, res) => {
  try {
    const user = req.user;
    let orders = await Order.find({'user._id': user._id})
      .populate('events')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
      .populate('guest')
      .sort('-createdAt')
      return res.status(200).json({
        status: 200,
        orders
      });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});



const increaseQuantity = (tickets) => {
  const bulkOptions = tickets.map(item => ({
    updateOne: {
      filter: { _id: item.ticketId },
      update: { $inc: { quantity: item.quantity } }
    }
  }));

  return Ticket.bulkWrite(bulkOptions);
};

const decreaseQuantity = (tickets) => {
  const bulkOptions = tickets.map(item => ({
    updateOne: {
      filter: { _id: item.ticketId },
      update: { $inc: { quantity: -item.quantity } }
    }
  }));

  return Ticket.bulkWrite(bulkOptions);
};


module.exports = router;
