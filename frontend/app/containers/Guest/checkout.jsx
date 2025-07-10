import React from "react";
import actions from "../../actions";
import { withRouter } from "../../withRouter";
import { connect } from "react-redux";
import Input from '../../components/Common/HtmlTags/Input';

class GuestCheckout extends React.PureComponent {
    render () {
        const {
            authenticated,
            showGuestForm,
            guestInfo,
            guestErrors,
            handleGuestInputChange,
            addGuest
        } = this.props;
        const handleGuestCheckout = (e) => {
            e.preventDefault();
            addGuest();
        }
        return (
            <>
                {!authenticated && showGuestForm && (
                  <div className="guest-checkout-form">
                    <p className="guest-info-text">As a guest, you can only purchase one ticket type with quantity of 1.</p>
                    <form onSubmit={handleGuestCheckout}>
                      <div className="form-group">
                        <Input 
                          type="email" 
                          name="email"
                          label="email"
                          value={guestInfo.email || ''} 
                          onChange={(n, v) => handleGuestInputChange(n, v)}
                          error={guestErrors && guestErrors.email}
                        />
                      </div>
                      <div className="form-group">
                        <Input 
                          type="text" 
                          name="name"
                          label="name"
                          value={guestInfo.name || ''}
                          onChange={(n, v) => handleGuestInputChange(n, v)}
                          error={guestErrors && guestErrors.name}
                        />
                      </div>
                      <button type="submit" className="guest-checkout-btn">Complete Purchase</button>
                    </form>
                  </div>
                )}
            </>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    isOpen: state.cart.isOpen,
    items: state.cart.items,
    total: state.cart.total,
    loading: state.cart.loading,
    error: state.cart.error,
    showGuestForm: state.cart.showGuestForm,
    guestInfo: state.cart.guestInfo,
    guestErrors: state.cart.guestErrors
  };
};

export default connect(mapStateToProps, actions)(GuestCheckout);

