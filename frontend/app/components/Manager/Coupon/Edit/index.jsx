import React from 'react';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';
import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import SelectOption from '../../../store/SelectOption';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import { useNavigate } from 'react-router-dom';
import { COUPON_TYPE, COUPON_APPLY } from '../../../../constants';
import { couponSelectFinder } from '../../../../utils/couponSelectFinder';

const EditCouponForm = (props) => {
  const {
    coupon,
    couponEditFormErrors,
    couponEditChange,
    updateCoupon,
    couponIsLoading,
    isLightMode,
    eventsSelect = [],
    ticketsSelect = [],
    deleteCoupon
  } = props;

  const navigate = useNavigate();
  let couponType;
  if (coupon.type && coupon?.type?.value) {
    couponType = Object.values(coupon?.type)[1]
  } else {
    couponType = coupon?.type
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCoupon(navigate);
  };

  return (
    <div className='edit-coupon d-flex flex-column mb-custom-5em'>
      {couponIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Edit Coupon</h2>
        <GoBack navigate={navigate} />
      </div>

      <form noValidate>
        <Row>
          {/* Coupon Code */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={couponEditFormErrors.code}
              label='Coupon Code'
              name='code'
              placeholder='Enter coupon code'
              value={coupon.code || ''}
              onInputChange={couponEditChange}
            />
          </Col>

          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={couponEditFormErrors.type}
              label='Type'
              placeholder='Select coupon type e.g (Percentage)'
              prevValue={couponSelectFinder(COUPON_TYPE, coupon.type) || ''}
              value={coupon.type || ''}
              multi={false}
              options={COUPON_TYPE}
              handleSelectChange={(v) => couponEditChange('type', v)}
            />
          </Col>

          {/* Discount Percentage or amount based on coupon type */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponEditFormErrors.percentage || couponEditFormErrors.amount}
              label={couponType === 'Percentage' ? 'Discount Percentage' : 'Discount Amount'}
              name={couponType === 'Percentage' ? 'percentage' : 'amount'}
              placeholder={couponType === 'Percentage' ? 'Enter discount percentage' : 'Enter discount amount'}
              value={(couponType === 'Percentage' ? coupon?.percentage : coupon?.amount) || '' }
              onInputChange={(name, value) => couponEditChange(name, value)}
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
              error={couponEditFormErrors.type}
              label='Apply to?'
              placeholder='Apply to multiple tickets or single?'
              prevValue={couponSelectFinder(COUPON_APPLY, coupon.appliesTo) || ''}
              value={coupon.appliesTo || ''}
              multi={false}
              options={COUPON_APPLY}
              handleSelectChange={(v) => couponEditChange('appliesTo', v)}
            />
          </Col>

          {/* Quantity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponEditFormErrors.quantity}
              label='Total Quantity'
              name='quantity'
              placeholder='Enter total number of coupons'
              value={coupon.quantity || ''}
              onInputChange={couponEditChange}
            />
          </Col>

          {/* User Limit */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponEditFormErrors.userLimit}
              label='Usage Limit Per User'
              name='userLimit'
              placeholder='Max uses per user'
              value={coupon.userLimit || ''}
              onInputChange={couponEditChange}
            />
          </Col>

          {/* Used Count (Read-only) */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              label='Used Count'
              name='usedCount'
              placeholder='Number of times used'
              value={coupon.usedCount || 0}
              disabled
              onInputChange={() => {}}
            />
          </Col>

          {/* Active Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-coupon'
              name='active'
              label='Is Active?'
              checked={coupon.active || false}
              toggleCheckboxChange={(value) =>
                couponEditChange('active', value)}
            />
          </Col>
        </Row>
      </form>
      <Row>
        <div className='edit-coupon-actions'>
          <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Update Coupon' />
          <Button
            onClick={() => deleteCoupon(coupon._id, navigate)}
            style={{ padding: '10px 20px' }}
            text='Delete Coupon'
          />
        </div>
      </Row>
    </div>
  );
};

class EditCoupon extends React.PureComponent {
  componentDidMount () {
    this.props.resetCoupon();
    const couponId = this.props.match.params.id;
    this.props.fetchCoupon(couponId);
  }

  componentDidUpdate (prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetCoupon();
      const couponId = this.props.match.params.id;
      this.props.fetchCoupon(couponId);
    }
  }

  render () {
    return (
      <EditCouponForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  coupon: state.coupon.coupon,
  couponEditFormErrors: state.coupon.editFormErrors,
  couponIsLoading: state.coupon.isLoading,
  eventsSelect: state.event.eventsSelect,
  ticketsSelect: state.ticket.ticketsSelect
});

export default connect(mapStateToProps, actions)(withRouter(EditCoupon));
