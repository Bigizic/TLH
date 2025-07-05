import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';

const AddCoupon = (props) => {
  const {
    couponFormData,
    couponFormErrors,
    couponChange,
    addCoupon,
    couponIsLoading,
    isLightMode,
    eventsSelect = [],
    ticketsSelect = []
  } = props;

  const navigate = props.navigate || (() => {});

  const handleSubmit = (e) => {
    e.preventDefault();
    addCoupon(navigate);
  };

  return (
    <div className='add-coupon d-flex flex-column mb-custom-5em'>
      {couponIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Create Coupon</h2>
        <GoBack navigate={navigate} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          {/* Coupon Code */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={couponFormErrors.code}
              label='Coupon Code'
              name='code'
              placeholder='Enter coupon code (e.g., SAVE20)'
              value={couponFormData.code}
              onInputChange={couponChange}
            />
          </Col>

          {/* Discount Percentage */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponFormErrors.percentage}
              label='Discount Percentage'
              name='percentage'
              placeholder='Enter discount percentage (1-100)'
              value={couponFormData.percentage}
              onInputChange={couponChange}
            />
          </Col>

          {/* Event Selection */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={couponFormErrors.event}
              label='Event'
              placeholder='Select event'
              value={couponFormData.event}
              multi={false}
              options={eventsSelect}
              handleSelectChange={(v) => couponChange('event', v)}
            />
          </Col>

          {/* Ticket Types (Optional) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              label='Ticket Types (Optional)'
              placeholder='Select ticket types'
              value={couponFormData.ticket}
              multi={true}
              options={ticketsSelect}
              handleSelectChange={(v) => couponChange('ticket', v)}
            />
          </Col>

          {/* Quantity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponFormErrors.quantity}
              label='Total Quantity'
              name='quantity'
              placeholder='Enter total number of coupons'
              value={couponFormData.quantity}
              onInputChange={couponChange}
            />
          </Col>

          {/* User Limit */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponFormErrors.userLimit}
              label='Usage Limit Per User'
              name='userLimit'
              placeholder='Max uses per user'
              value={couponFormData.userLimit}
              onInputChange={couponChange}
            />
          </Col>

          {/* Active Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-coupon'
              name='active'
              label='Is Active?'
              checked={couponFormData.active}
              toggleCheckboxChange={(value) =>
                couponChange('active', value)}
            />
          </Col>
        </Row>

        <Row>
          <div className='add-coupon-actions'>
            <Button style={{ padding: '10px 20px' }} text='Save Coupon' />
          </div>
        </Row>
      </form>
    </div>
  );
};

export default AddCoupon;