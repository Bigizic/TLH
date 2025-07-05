import { combineReducers } from '@reduxjs/toolkit';
import signup from './containers/SignUp/reducer';
import authentication from './containers/Authentication/reducer';
import account from './containers/Account/reducer';
import dashboard from './containers/Dashboard/reducer';
import login from './containers/Login/reducer';
import navigation from './containers/Navigation/reducer';
import event from './containers/Events/reducer';
import ticket from './containers/Ticket/reducer';
import coupon from './containers/Coupon/reducer';

const rootReducer = combineReducers({
  account,
  authentication,
  signup,
  dashboard,
  login,
  navigation,
  event,
  ticket,
  coupon
});
export default rootReducer;