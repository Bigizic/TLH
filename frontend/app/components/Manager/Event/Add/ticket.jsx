import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import { useNavigate } from 'react-router-dom';
import SelectOption from '../../../store/SelectOption';
import { ticketCouponFinder } from '../../../../utils/eventCategories';

const AddEventTicket = ({
  ticketFormData,
  ticketFormErrors,
  ticketChange,
  addTicket,
  isLightMode,
  eventTickets,
  createEventTicket,
  editEventTicket,
  deleteEventTicket,
  addEventTicket,
  eventEditChange,
  addEvent,
  couponsOptions
}) => {
  const navigate = useNavigate();

  const submitEventAndTicket = (e) => {
    e.preventDefault();
    addEventTicket(navigate);
  }
  const handleAddTicket = (e) => {
    e.preventDefault();
    const baseTicket =
      eventTickets.length === 0 ? ticketFormData : {
        type: '',
        price: '',
        quantity: '',
        discount: false,
        discountPrice: '',
        coupons: '',
      };

    createEventTicket({ ...baseTicket });
  };

  const handleEditTicket = (id, updates) => {
    editEventTicket(id, updates);
  };

  const handleDeleteTicket = (id) => {
    deleteEventTicket(id);
  };
const RenderDiscountInfo = ({ price, discountPrice, discount }) => {
  const priceNum = parseFloat(price);
  const discountPriceNum = parseFloat(discountPrice);

  if (
    discount &&
    priceNum > 0 &&
    discountPriceNum > 0 &&
    discountPriceNum < priceNum
  ) {
    const percent = ((priceNum - discountPriceNum) / priceNum) * 100;
    return (
      <span style={{ color: 'green', fontWeight: 'bold' }}>
        Buyers get {percent.toFixed(1)}% off!
      </span>
    );
  }

  return null;
}

  const renderTicketFields = (ticket, index) => (
    <>
    {index === 0 && <Row>

        <div className="alert alert-info" role="alert">
          By default, your event is visible and can be found in the <strong>Discover Events</strong> section.  
          <br />
            If you toggle visibility <strong>on</strong>, your event will also appear in <strong>homepage popover ads</strong>, giving it more exposure.
        </div>

          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='event-visibility'
              name='visibiliy'
              label='Visibilitty'
              checked={eventTickets.visibility || ''}
              toggleCheckboxChange={(value) =>
                eventEditChange('visibility', value)}
            />
          </Col>
      </Row>}
    <React.Fragment key={ticket.id}>
      {/* Ticket Type */}
      <Row>
      <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
        <Input
          type='text'
          label='Ticket Type'
          name='type'
          placeholder='e.g. VIP, General'
          value={ticket.type}
          onInputChange={(name, value) =>
            handleEditTicket(ticket.id, { [name]: value })
          }
        />
      </Col>

      {/* Price */}
      <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='5'>
        <Input
          type='number'
          label='Price'
          name='price'
          placeholder='Enter ticket price'
          value={ticket.price}
          onInputChange={(name, value) =>
            handleEditTicket(ticket.id, { [name]: value })
          }
        />
      </Col>

      {/* Quantity */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Quantity'
            name='quantity'
            placeholder='Enter ticket Quantity'
            value={ticket.quantity}
            onInputChange={(name, value) =>
              handleEditTicket(ticket.id, { [name]: value })
            }
          />
        </Col>

      {/* Coupons */}
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <SelectOption
            label='Apply Coupon(s)... (Optional)'
            placeholder='Select coupon(s)'
            options={couponsOptions}
            prevValue={ticketCouponFinder(couponsOptions, ticket.coupons) || ''}
            value={ticket.coupons || []}
            multi={true}
            handleSelectChange={(value) => handleEditTicket(ticket.id, {'coupons': value})}
          />
        </Col>

      {/* Delete Button */}
      <Col xs='1' className='d-flex align-items-center'>
        <Button style={{ padding: '5px 10px', fontSize: '13px' }} text="Delete"
          onClick={() => handleDeleteTicket(ticket.id)}
        >
        </Button>
      </Col>

      {/* Discount Switch */}
      <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12'>
        <Switch
          id={`discount-${ticket.id}`}
          name='discount'
          label='Has Discount?'
          checked={ticket.discount}
          toggleCheckboxChange={(value) =>
            handleEditTicket(ticket.id, { discount: value })
          }
        />
      </Col>

      {/* Discount Price */}
      {ticket.discount && (
        <Col className={isLightMode ? 'p-black' : 'p-white'} xs='12' lg='6'>
          <Input
            type='number'
            label='Discount Price'
            name='discountPrice'
            placeholder='Enter discounted price'
            value={ticket.discountPrice}
            onInputChange={(name, value) =>
              handleEditTicket(ticket.id, { [name]: value })
            }
          />
          <RenderDiscountInfo
            price={ticket.price}
            discountPrice={ticket.discountPrice}
            discount={ticket.discount}
          />
          <br />
          <br />
        </Col>
      )}
      </Row>
    </React.Fragment>
    </>
  );

  return (
    <div className='add-event-ticket d-flex flex-column mb-custom-5em'>
      <div
        className='d-flex'
        style={{ marginBottom: '-1em', justifyContent: 'space-between', padding: '0em 1em' }}
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>
          Event Tickets
        </h2>
      </div>

        {eventTickets.map(renderTicketFields)}

      <hr className={isLightMode ? 'p-black' : 'p-white'} />

      <Row>
        <div
          className='add-event-actions'
          style={{ flexDirection: 'row', justifyContent: 'space-around' }}
        >
          <Button onClick={handleAddTicket} style={{ padding: '10px 20px' }}
                  text={`${eventTickets.length < 1 ? 'Add Tickets' :' Add More Ticket'}`} />
          { eventTickets.length > 0 && <Button onClick={submitEventAndTicket} style={{ padding: '10px 20px' }} text='Save Changes' />}
        </div>
      </Row>
    </div>
  );
};

export default AddEventTicket;
