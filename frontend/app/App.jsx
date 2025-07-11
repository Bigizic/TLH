import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import actions from './actions';
import { ROLES } from './constants';

import Navigation from './containers/Navigation';
import Footer from './components/Common/Footer/Footer';

import Authentication from './containers/Authentication';
import Home from './containers/HomePage';
import Notification from './containers/Notification';
import About from './containers/About';
import Login from './containers/Login';
import Signup from './containers/SignUp';
import FAQs from './containers/Faq';
import Events from './containers/Events';
import Gallery from './containers/Gallery';
import GalleryView from './containers/Gallery/view';
import OrganizerSignUp from './containers/Organizer/SignUp';
import Dashboard from './containers/Dashboard';
import Page404 from './containers/Page404';
import ScrollToTop from './components/Common/ScrollToTop';
import EventView from './containers/Events/view';
import Terms from './containers/Terms';
import PrivacyPolicy from './containers/Policy';
import OrderSuccess from './containers/Order/success';

function App (props) {
  const { user } = props;
  const location = useLocation();
  const USER = user ?? user.role;

  useEffect(() => {
    AOS.init({
      offset: 130,
      duration: 1200,
      easing: 'ease-out-cubic',
      mirror: true,
      anchorPlacement: 'bottom-center'
    });
    AOS.refresh();
    const isLight = localStorage.getItem('isLightMode') === 'true';
    document.body.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('dark-mode', !isLight);
  }, []);

  const hideHeaderFooterPaths = ['/login', '/signup',
    '/organizer-signup', '/dashboard'
  ];
  const hideFooter = ['/event/', '/terms', '/privacy', '/faq', '/gallery', '/order']
  const showHeaderFooter = (USER.role === ROLES.Member ||
                            !hideHeaderFooterPaths.some(path => location.pathname.startsWith(path))
                            );
  const showFooter = (USER.role === ROLES.Member || !hideFooter.some(path => location.pathname.startsWith(path)))

  return (
    <>
      <ScrollToTop />
      <Notification />
      {showHeaderFooter && <Navigation />}
      <Routes>
        <Route path='*' element={<Page404 />} />
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />

        <Route path='/order/success/:id' element={<OrderSuccess />} />

        <Route path='/events' element={<Events />} />
        <Route path='/event/:slug' element={<EventView />} />

        <Route path='/gallery' element={<Gallery />} />
        <Route path='/gallery/:slug' element={<GalleryView />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/organizer-signup' element={<OrganizerSignUp />} />

        <Route path='/faq' element={<FAQs />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        
        <Route path='/dashboard/*' element={<Authentication><Dashboard /></Authentication>} />
      </Routes>

      {showHeaderFooter && showFooter && <Footer />}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(App);
