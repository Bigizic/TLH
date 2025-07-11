/*
 *
 * Admin
 *
 */

import React from 'react';

import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Dashboard';
import HeaderPanel from '../../components/Manager/Header';
import AccountMenu from '../../components/store/AccountMenu';
import ManagerAccount from '../../components/Manager/Account';
import ManagerEvent from '../../components/Manager/Event';
import ManagerTicket from '../../components/Manager/Ticket';
import ManagerCoupon from '../../components/Manager/Coupon';
import ManagerOrder from '../../components/Manager/Orders';
import ManagerScanner from '../../components/Manager/Scan';
import AccountSecurity from '../../components/Manager/Security';
import ManagerNewsletter from '../../components/Manager/Newsletter';
import ManagerGallery from '../../components/Manager/Gallery';
import ManagerMedia from '../../components/Manager/Media';
import Page404 from '../Page404';

import AddEvent from '../../components/Manager/Event/Add';
import EditEvent from '../../components/Manager/Event/Edit';
import AdminEvent from '../../components/Manager/Event/AdminEvent';

import AddTicket from '../../components/Manager/Ticket/Add';
import EditTicket from "../../components/Manager/Ticket/Edit";
import AdminTicket from '../../components/Manager/Ticket/AdminTicket';

import AddCoupon from '../../components/Manager/Coupon/Add';
import EditCoupon from '../../components/Manager/Coupon/Edit';
import AdminCoupon from '../../components/Manager/Coupon/AdminCoupon';

import AddGallery from '../../components/Manager/Gallery/Add';
import EditGallery from '../../components/Manager/Gallery/Edit';

import AddMedia from '../../components/Manager/Media/Add';

import AdminOrder from '../../components/Manager/Orders/AdminOrders';
import ViewOrder from '../../components/Manager/Orders/View';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const Admin = (props) => {
  const { isLightMode } = props;
  return (
    <div className='admin'>
      <AccountMenu {...props} />
      <div className={`${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'} wrapper d-flex flex-column min-vh-100 panel-body bg-black`}>
        <HeaderPanel {...props} />
        <Routes>
          <Route index element={<AdminDashboard {...props} />} />
          <Route path='events' element={<ManagerEvent {...props} />} />
          <Route path='tickets' element={<ManagerTicket {...props} />} />
          <Route path='coupons' element={<ManagerCoupon {...props} />} />
          <Route path='orders' element={<ManagerOrder {...props} />} />
          <Route path='scan' element={<ManagerScanner {...props} />} />
          <Route path='media' element={<ManagerMedia {...props}/>} />
          <Route path='gallery' element={<ManagerGallery {...props}/>} />
          <Route path='account' element={<ManagerAccount {...props} />} />
          <Route path='security' element={<AccountSecurity {...props} />} />
          <Route path='newsletter' element={<ManagerNewsletter {...props} />} />

          <Route path='events/add' element={<AddEvent {...props} />} />
          <Route path='events/edit/:id' element={<EditEvent {...props} />} />
          <Route path='events/my-events' element={<AdminEvent />} />

          <Route path='tickets/add' element={<AddTicket {...props}/>} />
          <Route path='tickets/edit/:id' element={<EditTicket {...props}/>} />
          <Route path='tickets/my-tickets' element={<AdminTicket {...props}/>} />
          
          <Route path='coupons/add' element={<AddCoupon {...props}/>} />
          <Route path='coupons/edit/:id' element={<EditCoupon {...props}/>} />
          <Route path='coupons/my-coupons' element={<AdminCoupon {...props}/>} />

          <Route path='gallery/add' element={<AddGallery {...props}/>} />
          <Route path='gallery/edit/:id' element={<EditGallery {...props}/>} />

          <Route path='media/add' element={<AddMedia {...props}/>} />

          <Route path='orders/:id' element={<ViewOrder {...props} />} />
          <Route path='orders/my-orders' element={<AdminOrder {...props} />} />

          {/*<Route path='users' element={<AdminOrder {...props} />} />*/}
          {/*<Route path='organizers' element={<AdminOrder {...props} />} />*/}
          {/*<Route path='guests' element={<AdminOrder {...props} />} />*/}
          
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;