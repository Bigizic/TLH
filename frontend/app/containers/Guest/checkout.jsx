import Input from '../../components/Common/HtmlTags/Input';
import { useNavigate } from "react-router-dom";

const GuestCheckout = (props) => {
    const {
            authenticated,
            showGuestForm,
            guestInfo,
            guestErrors,
            handleGuestInputChange,
            addGuest
        } = props;
    const navigate = useNavigate();
    const handleGuestCheckout = (e) => {
        e.preventDefault();
        addGuest(navigate);
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
                          onInputChange={(n, v) => handleGuestInputChange(n, v)}
                          error={guestErrors && guestErrors.email}
                        />
                      </div>
                      <div className="form-group">
                        <Input 
                          type="text" 
                          name="name"
                          label="name"
                          value={guestInfo.name || ''}
                          onInputChange={(n, v) => handleGuestInputChange(n, v)}
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

export default GuestCheckout;

