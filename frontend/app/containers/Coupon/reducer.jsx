/*
 *
 * Coupon reducer
 *
 */

import {
  FETCH_COUPON,
  FETCH_COUPONS,
  FETCH_USER_COUPONS,
  COUPON_CHANGE,
  COUPON_EDIT_CHANGE,
  SET_COUPON_FORM_ERRORS,
  SET_COUPON_FORM_EDIT_ERRORS,
  RESET_COUPON,
  ADD_COUPON,
  REMOVE_COUPON,
  SET_COUPONS_LOADING,
  FETCH_COUPONS_SELECT
} from './constants';

const initialState = {
  coupons: [],
  userCoupons: [],
  coupon: {
    _id: ''
  },
  couponsSelect: [],
  couponFormData: {
    code: '',
    type: '',
    amount: '',
    appliesTo: '',
    percentage: '',
    quantity: '',
    userLimit: '',
    active: true
  },
  isLoading: false,
  formErrors: {},
  editFormErrors: {}
};

const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUPONS:
      return {
        ...state,
        coupons: action.payload
      };
    case FETCH_USER_COUPONS:
      return {
        ...state,
        userCoupons: action.payload
      };
    case FETCH_COUPON:
      return {
        ...state,
        coupon: action.payload,
        editFormErrors: {}
      };
    case SET_COUPONS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_COUPONS_SELECT:
      return {
        ...state,
        couponsSelect: action.payload
      };
    case ADD_COUPON:
      return {
        ...state,
        coupons: [...state.coupons, action.payload]
      };
    case REMOVE_COUPON:
      return {
        ...state,
        coupons: state.coupons.filter(coupon => coupon._id !== action.payload)
      };
    case COUPON_CHANGE:
      return {
        ...state,
        couponFormData: {
          ...state.couponFormData,
          ...action.payload
        }
      };
    case COUPON_EDIT_CHANGE:
      return {
        ...state,
        coupon: {
          ...state.coupon,
          ...action.payload
        }
      };
    case SET_COUPON_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload
      };
    case SET_COUPON_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload
      };
    case RESET_COUPON:
      return {
        ...state,
        couponFormData: {
          code: '',
          type: '',
          amount: '',
          appliesTo: '',
          percentage: '',
          quantity: '',
          userLimit: '',
          active: true
        },
        coupon: {
          _id: ''
        },
        formErrors: {},
        editFormErrors: {}
      };
    default:
      return state;
  }
};

export default couponReducer;