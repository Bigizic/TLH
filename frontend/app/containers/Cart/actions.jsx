/*
 *
 * Cart actions
 *
 */

import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
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
  CART_ID
} from './constants';

// Toggle cart visibility
export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

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

// Add item to cart
export const addToCart = (item) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));
      
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
          type: SET_CART_ITEMS,
          payload: response.data.cart.tickets || []
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
      // dispatch(showNotification('success', 'Item added to cart'));
      
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
          type: SET_CART_ITEMS,
          payload: response.data.cart.tickets || []
        });
        
        dispatch({
          type: HANDLE_CART_TOTAL,
          payload: response.data.cart.total || 0
        });
      }
      
      // dispatch(showNotification('success', 'Item removed from cart'));
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

export const handleCheckout = () => {
  return (dispatch, getState) => {
    const { authenticated } = getState().authentication;
    
    if (!authenticated) {
      dispatch(showNotification('info', 'Please login to proceed to checkout'));
      dispatch(toggleCart());
      // Redirect to login page
      return;
    }
    
    // Proceed with checkout
    // This will be implemented later
  };
};