/*
 *
 * Organizer Dashboard
 *
 */

import { Routes, Route } from 'react-router-dom';
import OrganizerDashboard from './Dashboard';
import HeaderPanel from '../../components/Manager/Header';
import AccountMenu from '../../components/store/AccountMenu';
import ManagerAccount from '../../components/Manager/Account';
import ManagerEvent from '../../components/Manager/Event';
import ManagerTicket from '../../components/Manager/Ticket';
import ManagerCoupon from '../../components/Manager/Coupons';
import ManagerOrder from '../../components/Manager/Orders';
import ManagerSanner from '../../components/Manager/Scan';
import AccountSecurity from '../../components/Manager/Security';
import ManagerNewsletter from '../../components/Manager/Newsletter';
import Page404 from '../Page404';

import AddEvent from '../../components/Manager/Event/Add';
import EditEvent from "../../components/Manager/Event/Edit";

import AddTicket from '../../components/Manager/Ticket/Add';
import EditTicket from '../../components/Manager/Ticket/Edit';

import AddCoupon from '../../components/Manager/Coupons/Add';
import EditCoupon from '../../components/Manager/Coupons/Edit';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const Organizer = (props) => {
  const { isMenuOpen, isLightMode } = props;
  return (
    <div className='organizer'>
      <AccountMenu {...props} />
      <div className={`${isLightMode ? 'bg-light-mode' : 'bg-dark-mode'} wrapper d-flex flex-column min-vh-100 panel-body bg-black`}>
        <HeaderPanel {...props} />
        <Routes>
          <Route index element={<OrganizerDashboard {...props} />} />
          <Route path='events' element={<ManagerEvent {...props}/>} />
          <Route path='tickets' element={<ManagerTicket {...props}/>} />
          <Route path='coupons' element={<ManagerCoupon {...props}/>} />
          <Route path='orders' element={<ManagerOrder {...props}/>} />
          <Route path='scan' element={<ManagerSanner {...props}/>} />
          <Route path='account' element={<ManagerAccount {...props}/>} />
          <Route path='security' element={<AccountSecurity {...props}/>} />
          <Route path='newsletter' element={<ManagerNewsletter {...props}/>} />
          <Route path='events/add' element={<AddEvent {...props}/>} />
          <Route path='events/edit/:id' element={<EditEvent {...props}/>} />
          <Route path='tickets/add' element={<AddTicket {...props}/>} />
          <Route path='tickets/edit/:id' element={<EditTicket {...props}/>} />
          <Route path='coupons/add' element={<AddCoupon {...props}/>} />
          <Route path='coupons/edit/:id' element={<EditCoupon {...props}/>} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
};

export default Organizer;