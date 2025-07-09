import React from "react";
import Button from "../../../Common/HtmlTags/Button";
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from "../../../store/LoadingIndicator";
import { GoBack } from "../../../../containers/goBack/inedx";
import { useSearchParams, useNavigate } from "react-router-dom";
import actions from "../../../../actions";
import { connect } from "react-redux";
import { withRouter } from "../../../../withRouter";
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

const AddTicketForm = (props) => {
  const { isLightMode,
          ticketFormData,
          ticketChange,
          couponsOptions = [],
          ticketIsLoading,
          addTicket,
          ticketFormErrors,
          addTicketToEvent
        } = props;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get('event');

  const handleSubmit = (e) =>  {
    e.preventDefault();
    eventIdFromQuery ? addTicketToEvent(eventIdFromQuery, navigate) : addTicket(navigate);
  }

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
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Ticket</h2>
        <GoBack navigate={navigate} />
      </Row>
    <form onSubmit={handleSubmit} className="add-ticket">
      {ticketIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <Row>
        {/* Ticket Type */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='text'
            label='Ticket Type'
            name='type'
            error={ticketFormErrors['type']}
            placeholder='e.g. VIP, General'
            value={ticketFormData.type || ''}
            onInputChange={(name, value) => ticketChange(name, value)}
          />
        </Col>

        {/* Price */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Price'
            name='price'
            error={ticketFormErrors['price']}
            placeholder='Enter ticket price'
            value={ticketFormData.price || ''}
            onInputChange={(name, value) => ticketChange(name, value)}
          />
        </Col>

        {/* Quantity */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Quantity'
            name='quantity'
            error={ticketFormErrors['quantity']}
            placeholder='Enter ticket Quantity'
            value={ticketFormData.quantity || ''}
            onInputChange={(name, value) => ticketChange(name, value)}
          />
        </Col>

        {/* Discount Switch */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12'>
          <Switch
            id='ticket-discount'
            name='discount'
            label='Has Discount?'
            checked={ticketFormData.discount || false}
            toggleCheckboxChange={(value) => ticketChange('discount', value)}
          />
        </Col>

        {/* Discount Price + Percentage */}
        {ticketFormData.discount && (
          <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
            <Input
              type='number'
              label='Discount Price'
              name='discountPrice'
              placeholder='Enter discounted price'
              value={ticketFormData.discountPrice || ''}
              onInputChange={(name, value) => ticketChange(name, value)}
            />
            <RenderDiscountInfo
              price={ticketFormData.price}
              discountPrice={ticketFormData.discountPrice}
              discount={ticketFormData.discount}
            />
          </Col>
        )}

        {/* Coupons */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <SelectOption
            label='Apply Coupon(s)... (Optional)'
            placeholder='Select coupon(s)'
            options={couponsOptions}
            prevValue={ticketCouponFinder(couponsOptions, ticketFormData.coupons) || ''}
            value={ticketFormData.coupons || []}
            multi={true}
            handleSelectChange={(value) => ticketChange('coupons', value)}
          />
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col xs='12' className='d-flex justify-content-center'>
          <Button
            text="Save Ticket"
            style={{ padding: '10px 25px' }}
          />
        </Col>
      </Row>
    </form>
    </>
  );
};

class AddTicket extends React.PureComponent {
  componentDidMount () {
    this.props.fetchCouponsSelect();
  }

render () {
  const {
    isLightMode,
    ticket,
    ticketEditFormErrors,
    ticketIsLoading,
    coupons,
    ticketChange,
    addTicket,
    addTicketToEvent,
    ticketFormErrors
  } = this.props;

  return (
    <AddTicketForm
      isLightMode={isLightMode}
      ticketFormData={ticket}
      ticketFormErrors={ticketFormErrors}
      ticketIsLoading={ticketIsLoading}
      couponsOptions={coupons}
      ticketChange={ticketChange}
      addTicket={addTicket}
      addTicketToEvent={addTicketToEvent}
    />
  );
}
}

const mapStateToProps = state => ({
  ticket: state.ticket.ticketForm,
  ticketFormErrors: state.ticket.ticketFormErrors,
  ticketEditFormErrors: state.ticket.editFormErrors,
  ticketIsLoading: state.ticket.isLoading,
  coupons: state.coupon.couponsSelect
});

export default connect(mapStateToProps, actions)(withRouter(AddTicket));