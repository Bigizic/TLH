/*
 *
 * Cart actions
 *
 */

import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import { allFieldsValidation } from '../../utils/validation';
import handleError from '../../utils/error';

import {
  TOGGLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  SET_CART_ITEMS,
  CART_LOADING,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CART_ERROR,
  CART_ID,
  SET_GUEST_INFO,
  SELECTED_TICKETS,
  DELETE_SELECTED_TICKETS,
  SET_GUEST_FORM_ERRORS,
  SHOW_GUEST_FORM
} from './constants';

// Toggle cart visibility
export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const handleGuestInputChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: SET_GUEST_INFO,
    payload: formData
  }
}

// Set cart loading state
export const setCartLoading = (loading) => {
  return {
    type: CART_LOADING,
    payload: loading
  };
};

// Set cart error
export const setCartError = (error) => {
  return {
    type: CART_ERROR,
    payload: error
  };
};

// Set guest information
export const setGuestInfo = (guestInfo) => {
  return {
    type: SET_GUEST_INFO,
    payload: guestInfo
  };
};

// Set cart ID in localStorage and state
export const setCartId = cartId => {
  return (dispatch) => {
    localStorage.setItem(CART_ID, cartId);
    dispatch({
      type: SET_CART_ID,
      payload: cartId
    });
  };
};

export const setGuestForm = (v) => {
  return {
    type: SHOW_GUEST_FORM,
    payload: v
  }
}

// Initialize cart from database using cart ID from localStorage
export const initializeCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));
      const cartId = localStorage.getItem(CART_ID);
      
      if (cartId) {
        const response = await axios.get(`${API_URL}/cart/${cartId}`);
        
        if (response.data.cart) {
          dispatch({
            type: SET_CART_ITEMS,
            payload: response.data.cart.tickets || []
          });
          
          dispatch({
            type: HANDLE_CART_TOTAL,
            payload: response.data.cart.total || 0
          });
        }
      }
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to initialize cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const addGuest = () => {
  return async (dispatch, getState) => {
    const { name, email } = getState().cart.guestInfo;
    const rules = {
      name: 'required',
      email: 'required',
    }
    const guestForm = {
      name,
      email
    }
    const { isValid, errors } = allFieldsValidation(guestForm, rules, {
      'required.name': 'Name is required.',
      'required.email': 'Email is required.',
    })
    if (!isValid) {
      return dispatch({ type: SET_GUEST_FORM_ERRORS, payload: errors });
    }
    const response = await axios.post(`${API_URL}/guest/add`, guestForm);
    clearCart();
  }
};

// Add item to cart
export const addToCart = (item) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { authenticated, items } = getState().cart;
      
      // Check if user is guest and already has an item in cart
      if (!authenticated && items.length > 0) {
        dispatch(showNotification('info', 'As a guest, you can only add one ticket. Please sign in to add more.'));
        dispatch(toggleCart());
        return;
      }
      
      // Check if this ticket is already in the cart
      const existingItem = items.find(cartItem => cartItem.ticketId === item.ticketId);
      if (existingItem) {
        dispatch(showNotification('info', 'This ticket is already in your cart'));
        dispatch(toggleCart());
        return;
      }
      
      const cartId = localStorage.getItem(CART_ID);
      const cartItem = {
        ticketId: item.ticketId,
        eventId: item.eventId,
        eventName: item.eventName,
        ticketType: item.ticketType,
        price: item.price,
        discount: item.discount || false,
        discountPrice: item.discountPrice || 0,
        quantity: 1,
        ticketQuantity: item.ticketQuantity
      };
      let response;
      
      if (cartId) {
        response = await axios.put(`${API_URL}/cart/${cartId}/add`, { item: cartItem });
      } else {
        response = await axios.post(`${API_URL}/cart/add`, { item: cartItem });
        if (response.data.cartId) {
          dispatch(setCartId(response.data.cartId));
        }
      }
      
      if (response.data.cart) {
        dispatch({
          type: SELECTED_TICKETS,
          payload: cartItem.ticketId
        })
        dispatch({
          type: SET_CART_ITEMS,
          payload: response.data.cart.tickets || []
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
      dispatch(toggleCart());
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to add item to cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Remove item from cart
export const removeFromCart = (ticketId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const cartId = localStorage.getItem(CART_ID);
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const response = await axios.put(`${API_URL}/cart/${cartId}/remove`, { ticketId });
      
      if (response.data.cart) {
        if (response.data.cart.tickets.length === 0) {
            dispatch(clearCart());
        }

        dispatch({
          type: DELETE_SELECTED_TICKETS,
          payload: ticketId
        })
        dispatch({
          type: SET_CART_ITEMS,
          payload: response.data.cart.tickets || []
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to remove item from cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Update cart item quantity
export const updateCartItem = (ticketId, updates) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { authenticated } = getState().authentication;
      
      // If not authenticated, don't allow quantity changes
      if (!authenticated && updates.quantity > 1) {
        dispatch(showNotification('info', 'Please sign in to increase ticket quantity'));
        return;
      }
      
      const cartId = localStorage.getItem(CART_ID);
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const response = await axios.put(`${API_URL}/cart/${cartId}/update`, { 
        ticketId, 
        updates 
      });
      
      if (response.data.cart) {
        dispatch({
          type: SET_CART_ITEMS,
          payload: response.data.cart.tickets || []
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to update cart item'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Clear cart
export const clearCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));
      
      const cartId = localStorage.getItem(CART_ID);
      
      if (cartId) {
        await axios.delete(`${API_URL}/cart/${cartId}`);
      }
      
      localStorage.removeItem(CART_ID);
      
      dispatch({
        type: CLEAR_CART
      });
      
    } catch (error) {
      handleError(error, dispatch);
      dispatch(setCartError('Failed to clear cart'));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Process guest checkout
export const processGuestCheckout = (guestInfo) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { items, total, cartId } = getState().cart;
      
      if (!items.length) {
        dispatch(showNotification('error', 'Your cart is empty'));
        return null;
      }
      
      // Validate guest info
      if (!guestInfo.email || !guestInfo.name) {
        dispatch(showNotification('error', 'Please provide your name and email'));
        return null;
      }
      
      // In a real implementation, you would send this to your backend
      // For now, we'll simulate a successful order
      const orderId = `guest-${Date.now()}`;
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      return orderId;
    } catch (error) {
      handleError(error, dispatch);
      return null;
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// Process user checkout
export const processUserCheckout = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
      const { items, total, cartId } = getState().cart;
      const { user } = getState().account;
      
      if (!items.length) {
        dispatch(showNotification('error', 'Your cart is empty'));
        return null;
      }
      
      // In a real implementation, you would send this to your backend
      // For now, we'll simulate a successful order
      const orderId = `user-${Date.now()}`;
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      return orderId;
    } catch (error) {
      handleError(error, dispatch);
      return null;
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};