/*
 *
 * Coupon actions
 *
 */

import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

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

export const couponChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: COUPON_CHANGE,
    payload: formData
  };
};

export const couponEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: COUPON_EDIT_CHANGE,
    payload: formData
  };
};

export const resetCoupon = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_COUPON });
  };
};

export const setCouponLoading = (value) => {
  return {
    type: SET_COUPONS_LOADING,
    payload: value
  };
};

// Fetch all coupons
export const fetchCoupons = () => {
  return async (dispatch) => {
    try {
      dispatch(setCouponLoading(true));

      const response = await axios.get(`${API_URL}/coupon`);
      dispatch({
        type: FETCH_COUPONS,
        payload: response.data.coupons
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setCouponLoading(false));
    }
  };
};

// Fetch single coupon by ID
export const fetchCoupon = (id) => {
  return async (dispatch) => {
    try {
      dispatch(setCouponLoading(true));
      const response = await axios.get(`${API_URL}/coupon/${id}`);
      dispatch({
        type: FETCH_COUPON,
        payload: response.data.coupon
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setCouponLoading(false));
    }
  };
};

// Add new coupon
export const addCoupon = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setCouponLoading(true));
    try {
      const rules = {
        code: 'required',
        type: 'required',
        amount: 'required',
        appliesTo: 'required',
        percentage: 'required',
        quantity: 'required|numeric|min:1',
        userLimit: 'required|numeric|min:1'
      };
      const coupon = getState().coupon.couponFormData;

      const newCoupon = {
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount || 0,
        appliesTo: coupon.appliesTo,
        percentage: coupon.percentage || 0,
        quantity: coupon.quantity,
        userLimit: coupon.userLimit,
        active: coupon.active !== undefined ? coupon.active : true
      };

      const { isValid, errors } = allFieldsValidation(newCoupon, rules, {
        'required.code': 'Coupon code is required.',
        'required.type': 'Select a coupon type',
        'required.amount': 'Coupon amount is requried',
        'required.appliesTo': 'This field is required',
        'required.percentage': 'Discount percentage is required.',
        'required.quantity': 'Quantity is required.',
        'required.userLimit': 'User limit is required.',
      });
      if (!isValid) {
        return dispatch({ type: SET_COUPON_FORM_ERRORS, payload: errors });
      }
      const response = await axios.post(`${API_URL}/coupon/add`, newCoupon);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: ADD_COUPON, payload: response.data.coupon });
        dispatch(resetCoupon());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error saving coupon, try again!');
    } finally {
      dispatch(setCouponLoading(false));
    }
  };
};

// Update existing coupon
export const updateCoupon = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setCouponLoading(true));

    try {
      const rules = {
        code: 'required',
        type: 'required',
        amount: 'required',
        appliesTo: 'required',
        percentage: 'required',
        quantity: 'required|numeric|min:1',
        userLimit: 'required|numeric|min:1'
      };

      const coupon = getState().coupon.coupon;

      const updatedCoupon = {
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount || 0,
        appliesTo: coupon.appliesTo,
        percentage: coupon.percentage || 0,
        quantity: coupon.quantity,
        userLimit: coupon.userLimit,
        active: coupon.active !== undefined ? coupon.active : true
      };

      const { isValid, errors } = allFieldsValidation(updatedCoupon, rules, {
        'required.code': 'Coupon code is required.',
        'required.type': 'Select a coupon type',
        'required.amount': 'Coupon amount is requried',
        'required.appliesTo': 'This field is required',
        'required.percentage': 'Discount percentage is required.',
        'required.quantity': 'Quantity is required.',
        'required.userLimit': 'User limit is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_COUPON_FORM_EDIT_ERRORS, payload: errors });
      }

      const response = await axios.put(`${API_URL}/coupon/${coupon._id}`, updatedCoupon);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch(resetCoupon());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error updating coupon, try again!');
    } finally {
      dispatch(setCouponLoading(false));
    }
  };
};

// Delete coupon
export const deleteCoupon = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/coupon/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_COUPON, payload: id });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'error');
    }
  };
};

export const getUserCoupons = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_URL}/coupon/me`);

      dispatch({
        type: FETCH_USER_COUPONS,
        payload: res.data.coupons
      });
    } catch (error) {
      handleError(error, dispatch, 'error fetching user coupons');
    }
  }
}

// Fetch coupons for select options
export const fetchCouponsSelect = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/coupon/select`);
      dispatch({
        type: FETCH_COUPONS_SELECT,
        payload: response.data.coupons
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};