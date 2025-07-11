import { bindActionCreators } from 'redux';

import * as authentication from '../app/containers/Authentication/actions';
import * as signUp from '../app/containers/SignUp/actions';
import * as notifications from '../app/containers/Notification/actions';
import * as account from '../app/containers/Account/actions';
import * as dashboard from '../app/containers/Dashboard/actions';
import * as login from '../app/containers/Login/actions';
import * as navigation from '../app/containers/Navigation/actions';
import * as event from '../app/containers/Events/actions';
import * as ticket from '../app/containers/Ticket/actions';
import * as coupon from '../app/containers/Coupon/actions';
import * as gallery from '../app/containers/Gallery/actions';
import * as media from '../app/containers/Media/actions';
import * as cart from '../app/containers/Cart/actions';
import * as order from '../app/containers/Order/actions';

export default function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      ...authentication,
      ...signUp,
      ...notifications,
      ...account,
      ...dashboard,
      ...login,
      ...navigation,
      ...event,
      ...ticket,
      ...coupon,
      ...gallery,
      ...media,
      ...cart,
      ...order,
    },
    dispatch
  );
}