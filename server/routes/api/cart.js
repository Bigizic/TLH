const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const auth = require('../../middleware/auth');

// Create a new cart
router.post('/add', async (req, res) => {
  try {
    const { item } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'No items provided' });
    }
    
    // Create a new cart with the item
    const cart = new Cart({
      tickets: [item],
      user: req.user ? req.user._id : null
    });
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cartId: cart._id,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Get cart by ID
router.get('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Check if cart is expired
    if (cart.expiresAt && new Date() > cart.expiresAt) {
      await cart.deleteOne();
      return res.status(400).json({ error: 'Cart has expired' });
    }
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Add item to cart
router.put('/:cartId/add', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { item } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'No item provided' });
    }
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Check if cart is expired
    if (cart.expiresAt && new Date() > cart.expiresAt) {
      await cart.deleteOne();
      return res.status(400).json({ error: 'Cart has expired' });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.tickets.findIndex(
      ticket => ticket.ticketId.toString() === item.ticketId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists and if the cart quantity doesn't suppase item.ticketQuantity
      if (cart.tickets[existingItemIndex].quantity < item.ticketQuantity) {
        cart.tickets[existingItemIndex].quantity += 1;
      }
    } else {
      // Add new item to cart
      cart.tickets.push(item);
    }
    
    // Update cart expiration
    cart.expiresAt = new Date(+new Date() + 7*24*60*60*1000); // 7 days from now
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Remove item from cart
router.put('/:cartId/remove', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { ticketId } = req.body;
    
    if (!ticketId) {
      return res.status(400).json({ error: 'No ticket ID provided' });
    }
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Remove item from cart
    cart.tickets = cart.tickets.filter(
      ticket => ticket.ticketId.toString() !== ticketId
    );
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Update cart item
router.put('/:cartId/update', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const { ticketId, updates } = req.body;
    
    if (!ticketId || !updates) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Find and update the item
    const itemIndex = cart.tickets.findIndex(
      ticket => ticket.ticketId.toString() === ticketId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    // Update the item with the provided updates
    Object.keys(updates).forEach(key => {
      cart.tickets[itemIndex][key] = updates[key];
    });
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Clear/delete cart
router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    
    const result = await Cart.findByIdAndDelete(cartId);
    
    if (!result) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Cart deleted successfully'
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// Associate cart with user (after login)
router.put('/:cartId/user', auth, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    
    const cart = await Cart.findById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Associate cart with user
    cart.user = req.user._id;
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;