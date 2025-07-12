import {
  FETCH_ORDER,
  FETCH_ORDERS,
  SET_IS_LOADING,
  FETCH_USER_ORDERS,
  SET_DELETE_ORDER,
} from './constants';

const initialState = {
  order: {},
  orders: [],
  userOrders: [],
  deleteOrderVisibility: false,
  isLoading: false
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DELETE_ORDER:
      return {
        ...state,
        deleteOrderVisibility: action.payload
      }
    case FETCH_ORDER:
      return {
        ...state,
        order: action.payload
      }
    case FETCH_USER_ORDERS:
      return {
        ...state,
        userOrders: action.payload
      }
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};

export default ordersReducer;

