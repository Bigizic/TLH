import { combineReducers } from '@reduxjs/toolkit';
import signup from './containers/SignUp/reducer';
import authentication from './containers/Authentication/reducer';
import account from './containers/Account/reducer';
import dashboard from './containers/Dashboard/reducer';
import login from './containers/Login/reducer';
import navigation from './containers/Navigation/reducer';
import event from './containers/Events/reducer';
import cart from './containers/Cart/reducer';
import ticket from './containers/Ticket/reducer';
import coupon from './containers/Coupon/reducer';
import gallery from './containers/Gallery/reducer';
import media from './containers/Media/reducer';
import order from './containers/Order/reducer';

const rootReducer = combineReducers({
  account,
  authentication,
  signup,
  dashboard,
  login,
  navigation,
  cart,
  event,
  ticket,
  coupon,
  gallery,
  media,
  order
});
export default rootReducer;