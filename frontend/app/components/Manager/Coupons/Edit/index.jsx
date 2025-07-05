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

  const navigate = props.navigate || (() => {});

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

      <form onSubmit={handleSubmit} noValidate>
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

          {/* Discount Percentage */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={couponEditFormErrors.percentage}
              label='Discount Percentage'
              name='percentage'
              placeholder='Enter discount percentage'
              value={coupon.percentage || ''}
              onInputChange={couponEditChange}
            />
          </Col>

          {/* Event Selection */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={couponEditFormErrors.event}
              label='Event'
              placeholder='Select event'
              value={coupon.event || ''}
              multi={false}
              options={eventsSelect}
              handleSelectChange={(v) => couponEditChange('event', v)}
            />
          </Col>

          {/* Ticket Types */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              label='Ticket Types (Optional)'
              placeholder='Select ticket types'
              value={coupon.ticket || []}
              multi={true}
              options={ticketsSelect}
              handleSelectChange={(v) => couponEditChange('ticket', v)}
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
              disabled={true}
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

        <Row>
          <div className='edit-coupon-actions'>
            <Button style={{ padding: '10px 20px' }} text='Update Coupon' />
            <Button
              onClick={() => deleteCoupon(coupon._id, navigate)}
              style={{ padding: '10px 20px' }}
              text='Delete Coupon'
            />
          </div>
        </Row>
      </form>
    </div>
  );
};

class EditCoupon extends React.PureComponent {
  componentDidMount() {
    this.props.resetCoupon();
    const couponId = this.props.match.params.id;
    this.props.fetchCoupon(couponId);
    this.props.fetchEventsSelect();
    this.props.fetchTicketsSelect();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetCoupon();
      const couponId = this.props.match.params.id;
      this.props.fetchCoupon(couponId);
    }
  }

  render() {
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