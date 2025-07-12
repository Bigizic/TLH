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
import { payStackHelper } from '../../components/Paystack';
import { ROLES } from '../../constants';

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
  SHOW_GUEST_FORM,
  SET_CART_COUPON
} from './constants';
import { ticketStatusChecker } from '../Ticket/actions';

// Toggle cart visibility
export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const handleCouponChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: SET_CART_COUPON,
    payload: formData
  }
}

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

export const applyCoupon = () => {
  return async(dispatch, getState) => {
    dispatch(setCartLoading(true));
    try {
      const cart = getState().cart;
      const coupon = cart.coupon;
      const cartItems = cart.items;
      if (coupon?.code?.length < 1) {
        return handleError({ message: 'Enter a valid coupon' }, dispatch)
      }
      const code = coupon.code;
      const tickets = cartItems.map(item => item.ticketId);
      const events = cartItems.map(item => item.eventId);
      const requestData = {
        code,
        tickets,
        events
      }
      console.log(requestData);
      // confirm coupon
      // const response = await axios.post(`${API_URL}/coupon/validate`, requestData);


      console.log(code)
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setCartLoading(false));
    }
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

export const addGuest = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setCartLoading(true))
    try {
      const { name, email } = getState().cart.guestInfo;
      const cart = getState().cart;
      const { eventId, ticketId, } = cart.items[0]
      const rules = {
        name: 'required',
        email: 'required',
      }
      const guestForm = {
        name,
        email,
        eventId,
        ticketId
      }
      const { isValid, errors } = allFieldsValidation(guestForm, rules, {
       'required.name': 'Name is required.',
        'required.email': 'Email is required.',
      })
      if (!isValid) {
        return dispatch({ type: SET_GUEST_FORM_ERRORS, payload: errors });
      }
      // add guest
      const guest = await axios.post(`${API_URL}/guest/add`, guestForm);
      if (guest.status === 200) {
        Promise.all([]).then(() => {
          dispatch(checkout(navigate, guest.data.guest));
        });
      }
    } catch (error) {
      dispatch(handleError(error, 'Error checking out as guest! Try again later'))
    } finally {
      dispatch(setCartLoading(false))
    }
  }
};

// Add item to cart
export const addToCart = (item) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setCartLoading(true));

      const { authenticated } = getState().authentication;
      
      const { items } = getState().cart;
      
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
      
      /*const cartId = localStorage.getItem(CART_ID);
      
      if (cartId) {
        await axios.delete(`${API_URL}/cart/${cartId}`);
      }*/
      
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

export const checkout = (navigate, guest=null) => {
  return async (dispatch, getState) => {
    dispatch(setCartLoading(true));
    try {
      let name, email, _id;
      if (guest) {
        email = guest.email
        name = guest.name
        _id = guest._id
      }
      const user = getState().account.user;
      const cart = getState().cart;
      const cartItems = cart.items || [];
      const ticketIds = cartItems.map(item => item.ticketId);
      const eventIds = cartItems.map(item => item.eventId);
      const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountPrice = cartItems.reduce((sum, item) => sum + item.discountPrice, 0);
      const { cartId, total } = cart
      const userEmail = user.email
      const userId = user._id
      let user_name;
      if (user.role === ROLES.Organizer) {
        user_name = user.organizer.companyName
      } else {
        user_name = user.name
      }

      dispatch(toggleCart());
      dispatch(clearCart());

      // before creating an order, check if every ticket in the db is
      // active or the quantity is greater than 0
      const checkTIcketStatus = await ticketStatusChecker(cartId);

      if (!checkTIcketStatus) {
        throw new Error('Cannot buy ticket at this time, try again!!')
      }


      const ps = await payStackHelper({
        cart: cartId,
        user: { email: userEmail, name: user_name, _id: userId},
        guest: { email, name, _id },
        events: eventIds,
        tickets: ticketIds,
        finalAmount: total,
        discountPrice: discountPrice,
        amountBeforeDiscount: price,
        billingEmail: email !== undefined || null ? email : userEmail,
      }, dispatch)

      if (ps && ps.status === 200) {
        // payment successful
        // redirect to confirmation page
        navigate(`/order/success/${name ? 'guest-' + ps.data.order._id : ps.data.order._id}`)
      }
    } catch (error) {
      handleError(error, dispatch)
    } finally {
      dispatch(setCartLoading(false));
    }
  }
}