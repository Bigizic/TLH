/*
 *
 * Cart reducer
 *
 */

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
  SET_GUEST_INFO,
  SHOW_GUEST_FORM,
  SET_GUEST_FORM_ERRORS,

  SELECTED_TICKETS,
  DELETE_SELECTED_TICKETS,
  SET_CART_COUPON
} from './constants';

import { getSelectedTicketsFromStorage, saveSelectedTicketsToStorage } from '../../utils/selectedTickets';

const initialState = {
  isOpen: false,
  items: [],
  cartId: null,
  total: 0,
  loading: false,
  selectedTickets: getSelectedTicketsFromStorage(),
  error: null,
  guestInfo: {},
  showGuestForm: false,
  guestErrors: {},
  coupon: {
    code: ''
  }
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_COUPON:
      return {
        ...state,
        coupon: {...state.coupon, ...action.payload}
      };
    case SET_GUEST_FORM_ERRORS:
      return {
        ...state,
        guestErrors: action.payload
      }
    case SHOW_GUEST_FORM:
      return {
        ...state,
        showGuestForm: !action.paylaod
      };
    case SET_GUEST_INFO:
      return {
        ...state,
        guestInfo: {...state.guestInfo, ...action.payload}
      }
    case DELETE_SELECTED_TICKETS:
      const updat = state.selectedTickets.filter(t => t !== action.payload);
      saveSelectedTicketsToStorage(updat);
      return {
        ...state,
        selectedTickets: updat
      };
    case SELECTED_TICKETS:
      const updated = [action.payload, ...state.selectedTickets];
      saveSelectedTicketsToStorage(updated);
      return {
        ...state,
        selectedTickets: updated
      };

    case TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case CART_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case CART_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.ticketId !== action.payload)
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        items: state.items.map(item => 
          item.ticketId === action.payload.ticketId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    case CLEAR_CART:
      localStorage.removeItem('selectedTickets');
      return {
        ...state,
        items: [],
        total: 0,
        cartId: null,
        selectedTickets: [],
        guestInfo: {},
        guestErrors: {},
        coupon: {
          code: ''
        },
        showGuestForm: false
      };
    case SET_CART_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case HANDLE_CART_TOTAL:
      return {
        ...state,
        total: action.payload
      };
    case SET_CART_ID:
      return {
        ...state,
        cartId: action.payload
      };
    default:
      return state;
  }
};

export default cartReducer;