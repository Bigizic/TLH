import Button from "../../../Common/HtmlTags/Button";
import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from "../../../store/LoadingIndicator";
import { GoBack } from "../../../../containers/goBack/inedx";
import { useSearchParams, useNavigate } from "react-router-dom";
import actions from "../../../../actions";
import { withRouter } from "../../../../withRouter";
import { connect } from "react-redux";
import { ticketCouponFinder } from "../../../../utils/eventCategories";

const RenderDiscountInfo = ({ price, discountPrice, discount }) => {
  const priceNum = parseFloat(price);
  const discountPriceNum = parseFloat(discountPrice);

  if (discount && priceNum > 0 && discountPriceNum > 0 && discountPriceNum < priceNum) {
    const percent = ((priceNum - discountPriceNum) / priceNum) * 100;
    return (
      <span style={{ color: 'green', fontWeight: 'bold' }}>
        Buyers get {percent.toFixed(1)}% off!
      </span>
    );
  }

  return null;
};

const EditTicketForm = (props) => {
  const { isLightMode,
  ticket,
  editTicketChange,
  coupons = [],
  ticketIsLoading,
  editTicket,
  ticketEditFormErrors,
  editEventTicket,
  deleteTicket
} = props;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get('event');

  const handleSubmit = (e) => {
    e.preventDefault();
    eventIdFromQuery
      ? editEventTicket(eventIdFromQuery, navigate)
      : editTicket(navigate, ticket._id);
  };

  return (
    <>
    <Row
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Edit Ticket</h2>
        <GoBack navigate={navigate} />
      </Row>
        <form noValidate className="add-ticket">
      {ticketIsLoading && <LoadingIndicator isLightMode={isLightMode} />}

      <Row>
        {/* Ticket Type */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='text'
            label='Ticket Type'
            name='type'
            error={ticketEditFormErrors.type || ''}
            placeholder='e.g. VIP, General'
            value={ticket.type || ''}
            onInputChange={(name, value) => editTicketChange(name, value)}
          />
        </Col>

        {/* Price */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Price'
            name='price'
            error={ticketEditFormErrors.price || ''}
            placeholder='Enter ticket price'
            value={ticket.price || ''}
            onInputChange={(name, value) => editTicketChange(name, value)}
          />
        </Col>

        {/* Quantity */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Quantity'
            name='quantity'
            error={ticketEditFormErrors.quantity || ''}
            placeholder='Enter ticket Quantity'
            value={ticket.quantity || ''}
            onInputChange={(name, value) => editTicketChange(name, value)}
          />
        </Col>

        {/* Discount Switch */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12'>
          <Switch
            id='ticket-discount'
            name='discount'
            label='Has Discount?'
            checked={ticket.discount || false}
            toggleCheckboxChange={(value) => editTicketChange('discount', value)}
          />
        </Col>

        {/* Discount Price + Percentage */}
        {ticket.discount && (
          <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
            <Input
              type='number'
              label='Discount Price'
              name='discountPrice'
              placeholder='Enter discounted price'
              value={ticket.discountPrice || ''}
              onInputChange={(name, value) => editTicketChange(name, value)}
            />
            <RenderDiscountInfo
              price={ticket.price}
              discountPrice={ticket.discountPrice}
              discount={ticket.discount}
            />
          </Col>
        )}

        {/* Coupons */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <SelectOption
            label='Apply Coupon(s)... (Optional)'
            placeholder='Select coupon(s)'
            options={coupons}
            prevValue={ticketCouponFinder(coupons, ticket.coupons) || ''}
            value={ticket.coupons || ''}
            multi={true}
            handleSelectChange={(value) => editTicketChange('coupons', value)}
          />
        </Col>
      </Row>

    </form>
    <Row style={{ justifyContent: 'space-around' }} className='mt-4 d-flex'>
          <Button
            text="Update Ticket"
            style={{ padding: '10px 25px' }}
            onClick={handleSubmit}
          />

          <Button
            text="Delete Ticket"
            style={{ padding: '10px 25px' }}
            onClick={() => deleteTicket(ticket._id, navigate)}
          />
      </Row>
    </>
  );
};

class EditTicket extends React.PureComponent {
  componentDidMount () {
    //this.props.resetTicket();
    const ticketId = this.props.match.params.id;
    this.props.fetchTicket(ticketId);
    this.props.fetchCouponsSelect();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      //this.props.resetTicket();
      const ticketId = this.props.match.params.id;
      this.props.fetchTicket(ticketId);
    }
  }

  render () {
    const { deleteTicket, ticketEditFormErrors, coupons } = this.props;
    return (
      <EditTicketForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  ticket: state.ticket.ticket,
  ticketEditFormErrors: state.ticket.editFormErrors,
  ticketIsLoading: state.ticket.isLoading,
  coupons: state.coupon.couponsSelect
});

export default connect(mapStateToProps, actions)(withRouter(EditTicket));
