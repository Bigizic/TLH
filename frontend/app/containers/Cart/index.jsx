/*
 *
 * Cart
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import actions from '../../actions';

class Cart extends React.PureComponent {

  componentDidMount() {
    this.props.initializeCart();
  }
  calculateTotal = () => {
    const { items } = this.props;
    return items.reduce((total, item) => {
      const itemPrice = item.discount && item.discountPrice 
        ? item.discountPrice 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  handleQuantityChange = (ticketId, newQuantity) => {
    if (newQuantity < 1) return;
    
    this.props.updateCartItem(ticketId, { quantity: newQuantity });
  };

  render() {
    const { 
      isOpen, 
      items, 
      total,
      loading,
      toggleCart, 
      removeFromCart,
      clearCart,
      handleCheckout,
    } = this.props;

    return (
      <>
        {/* Cart Icon */}
        <div className={`cart-icon ${items.length > 0 ? 'has-items' : ''}`} onClick={toggleCart}>
          <FaShoppingCart size={24} />
          {items.length > 0 && (
            <span className="cart-count">{items.reduce((total, item) => total + item.quantity, 0)}</span>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="close-cart" onClick={toggleCart}>
              <IoMdClose size={24} />
            </button>
          </div>

          {loading ? (
            <div className="cart-loading">
              <p>Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.ticketId} className="cart-item">
                    <div className="item-details">
                      <h4>{item.eventName}</h4>
                      <p className="ticket-type">{item.ticketType}</p>
                      <p className="ticket-price">
                        {item.discount && item.discountPrice ? (
                          <>
                            <span className="original-price">₦{item.price.toLocaleString()}</span>
                            <span className="discount-price">₦{item.discountPrice.toLocaleString()}</span>
                          </>
                        ) : (
                          <span>₦{item.price.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => this.handleQuantityChange(item.ticketId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span>{item.quantity <= item.ticketQuantity ? item.quantity : item.ticketQuantity}</span>
                        <button
                          onClick={() => this.handleQuantityChange(item.ticketId, item.quantity + 1)}
                          disabled={item.quantity >= item.ticketQuantity}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        className="remove-item" 
                        onClick={() => removeFromCart(item.ticketId)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>₦{(total || this.calculateTotal()).toLocaleString()}</span>
                </div>
                <div className="cart-actions">
                  <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
                  <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Overlay */}
        {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    isOpen: state.cart.isOpen,
    items: state.cart.items,
    total: state.cart.total,
    loading: state.cart.loading,
    error: state.cart.error
  };
};

export default connect(mapStateToProps, actions)(Cart);