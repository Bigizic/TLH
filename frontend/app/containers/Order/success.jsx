import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaCheckCircle } from 'react-icons/fa';
import actions from '../../actions';
import Button from '../../components/Common/HtmlTags/Button';

const OrderSuccess = ({ authenticated }) => {
  const { id } = useParams();
  console.log(id)
  const isGuest = id && id.startsWith('guest-');
  console.log(isGuest)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">
          {/*<FaCheckCircle size={80} color="#28a745" />*/}
          <FaCheckCircle size={80} color="#9172EC" />
        </div>

        <div className='order-success-text'>
        <h1>Thank You for Your Order!</h1>
        <p className="order-id">Order ID: {id.split('-')[1]}</p>
        
        <div className="order-details">
          <p>Your ticket purchase was successful. You will receive a confirmation email shortly with your ticket details.</p>
          
          {isGuest ? (
            <div className="guest-message">
              <p>As a guest user, you can access your ticket using the link sent to your email.</p>
              <p>Want to manage all your tickets in one place?</p>
              <div className="action-buttons">
                <Link to="/signup" className="primary-button"><Button text={"Create an Account"} /></Link>
                <Link to="/events" className="secondary-button"><Button type="secondary" text={"Explore More Events"} /></Link>
              </div>
            </div>
          ) : (
            <div className="user-message">
              <p>You can view and manage your tickets in your dashboard.</p>
              <div className="action-buttons">
                <Link to="/dashboard/tickets"><Button className="primary" text={"View My Tickets"} /></Link>
                <Link to="/events"><Button type="secondary" text={"Explore More Events"} /></Link>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.authentication.authenticated
});

export default connect(mapStateToProps, actions)(OrderSuccess);