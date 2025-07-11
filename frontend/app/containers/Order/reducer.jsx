import {
  FETCH_ORDERS,
  SET_IS_LOADING
} from './constants';

const initialState = {
  orders: [],
  isLoading: false
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
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

