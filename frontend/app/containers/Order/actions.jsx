import {
  SET_IS_LOADING,
  FETCH_ORDERS
} from './constants';
import axios from 'axios';
import { API_URL } from '../../constants';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';

export const setOrderLoading = (v) => {
  return {
    type: SET_IS_LOADING,
    payload: v
  }
}

export const fetchOrders = (my_orders=null) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true))
      try {
        let orders;
        if (my_orders) {
            orders = await axios.get(`${API_URL}/order/me?my_orders=true`)
        } else {
          orders = await axios.get(`${API_URL}/order/me`)
        }
        if (orders.status === 200 && orders.data.orders.length > 0) {
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
