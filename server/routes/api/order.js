const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Event = require('../../models/event');
const Ticket = require('../../models/ticket');
const auth = require('../../middleware/auth');
const { ROLES } = require('../../utils/constants');
const PaymentHandler = require('../../utils/paystack');

const mongoose = require('mongoose');
const newObjectId = mongoose.Types.ObjectId;

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

    const order = new Order({
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
    const options = { new: true };
    const updateOrder = await Order.findOneAndUpdate(
        { payStackId: payStackId },
        update,
        options
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
/*router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    let orderDoc = null;

    if (req.user.role === ROLES.Admin) {
      orderDoc = await Order.findOne({ _id: orderId }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
        }
      });
    } else {
      const user = req.user._id;
      orderDoc = await Order.findOne({ _id: orderId, user }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
        }
      });
    }

    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }
    // const selectedAddress = await Address.findOne({_id: orderDoc.address})
    const selectedAddress = orderDoc.address
    const { firstName, lastName, email } = await User.findOne({ _id: orderDoc.user });

    // send request to paystack to fetch order details
    const paymentDetails = await PaymentHandler(orderDoc.payStackId);

    let order = {
      _id: orderDoc._id,
      total: orderDoc.total,
      created: orderDoc.created,
      totalTax: 0,
      products: orderDoc?.cart?.products,
      cartId: orderDoc.cart._id,
      currency: orderDoc.cart.currency,
      selectedAddress: selectedAddress,
      phoneNumber: orderDoc.phoneNumber,
      status: orderDoc.status,
      payStackReference: orderDoc.payStackReference,
      payStackId: orderDoc.payStackId,
      paymentType: orderDoc.paymentType,
      user: `${firstName} ${lastName}`,
      userEmail: email,

      amount: paymentDetails.data.amount,
      paymentStatus: paymentDetails.data.gateway_response,
      paymentDate: paymentDetails.data.paid_at,
      paymentCurrency: paymentDetails.data.currency,
      paymentFees: paymentDetails.data.fees,
      deliveryType: orderDoc.deliveryType,

      edited: orderDoc.edited,
    };

    order = store.caculateTaxAmount(order);

    return res.status(200).json({
      order
    });
  } catch (error) {
    return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
  }
});*/


// fetch my orders api
router.get('/me', auth, async (req, res) => {
  try {
    // const { page = 1, limit = 10 } = req.query;
    const user = req.user._id;
    const my_orders = req.query.my_orders === 'true';
    console.log(req.user)
    let orders = await Order.find()
      .populate('events')
      .populate({
        path: 'cart',
        populate: {
          path: 'tickets.eventId',
        }
      })
      .sort('-created')
    if (user.role === ROLES.Organizer || my_orders === true) {
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
