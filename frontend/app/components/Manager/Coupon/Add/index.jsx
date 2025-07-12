import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import { useNavigate } from 'react-router-dom';
import { COUPON_TYPE, COUPON_APPLY } from '../../../../constants';

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

  // const navigate = props.navigate || (() => {});
  const navigate = useNavigate();

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

          {/* type */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={couponFormErrors.type}
              label='Type'
              placeholder='Select coupon type e.g (Percentage)'
              value={couponFormData.type}
              multi={false}
              options={COUPON_TYPE}
              handleSelectChange={(v) => couponChange('type', v)}
            />
          </Col>

          {/* Discount Percentage or amount based on coupon type */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponFormErrors.percentage || couponFormErrors.amount}
              label={
      couponFormData?.type?.label === 'Percentage'
        ? 'Discount Percentage'
        : 'Discount Amount'
    }
              name={couponFormData?.type?.label === 'Percentage' ? 'percentage' : 'amount'}
              placeholder={
      couponFormData?.type?.label === 'Percentage'
        ? 'Enter discount percentage'
        : 'Enter discount amount'
    }
              value={(couponFormData?.type?.label === 'Percentage' ? couponFormData?.percentage : couponFormData?.amount) || ''}
              onInputChange={(name, value) => couponChange(name, value)}
            />
          </Col>

          {/* where to apply coupon */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <div className="alert alert-info" role="alert">
              Selecting <strong>One</strong> applies the discount to a single ticket in the cart<br />
              (e.g., only one ticket will receive the discount).<br />
              Selecting <strong>Multiple</strong> applies the discount to all applicable tickets<br />
              in the cart (e.g., if a user has 4 tickets, each one will receive the discount).
            </div>
            <SelectOption
              error={couponFormErrors.type}
              label='Apply to?'
              placeholder='Apply to multiple tickets or single?'
              value={couponFormData.appliesTo}
              multi={false}
              options={COUPON_APPLY}
              handleSelectChange={(v) => couponChange('appliesTo', v)}
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
          <div className='add-coupon-actions' style={{ paddingTop: '1em' }}>
            <Button style={{ padding: '10px 20px' }} text='Save Coupon' />
          </div>
        </Row>
      </form>
    </div>
  );
};

export default AddCoupon;
