import {
  SET_IS_LOADING,
  FETCH_ORDER,
  FETCH_ORDERS,
  FETCH_USER_ORDERS,
  SET_DELETE_ORDER
} from './constants';
import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

export const setDeleteOrderVisibility = (v) => {
  return {
    type: SET_DELETE_ORDER,
    payload: v
  }
}

export const setOrderLoading = (v) => {
  return {
    type: SET_IS_LOADING,
    payload: v
  }
}

export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true))
      try {
        const orders = await axios.get(`${API_URL}/order/all_orders`)
        if (orders.status === 200 && orders.data.orders) {
            dispatch({
                type: FETCH_ORDERS,
                payload: orders.data.orders
            })
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setOrderLoading(false))
    }
  }
}

export const userOrders = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true))
      try {
        const orders = await axios.get(`${API_URL}/order/me`);
        if (orders.status === 200 && orders.data.orders) {
            dispatch({
                type: FETCH_USER_ORDERS,
                payload: orders.data.orders
            })
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setOrderLoading(false))
    }
  }
}

export const fetchOrder = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const order = await axios.get(`${API_URL}/order/id/${id}`);
      if (order.status === 200 && order.data.order) {
          dispatch({
              type: FETCH_ORDER,
              payload: order.data.order
          })
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false))
    }
  }
}

export const deleteOrder = (id, navigate) => {
  return async(dispatch) => {
    dispatch(setOrderLoading(true))
    try {
      const order = await axios.delete(`${API_URL}/order/id/${id}`);
      if (order.status === 200) {
        dispatch(setDeleteOrderVisibility(false))
        dispatch(showNotification('success', order.data.message))
        navigate(-1)
      }
    } catch {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false))
    }
  }
}
