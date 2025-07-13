import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CBadge,
  CImage
} from '@coreui/react';
import { ROLES, API_URL } from '../../../../constants';
import Button from '../../../Common/HtmlTags/Button';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import ResolveImage from '../../../store/ResolveImage';
import actions from '../../../../actions';
import { formatDate } from '../../../../utils/formatDate';
import TopSlideConfirmModal from '../../../store/ConfirmModal';

const OrderViewer = (props) => {
  const { order = {}, user,
          isLightMode, orderIsLoading,
          setDeleteOrderVisibility, deleteOrderVisibility,
          deleteOrder, secondDiscount, setSecondDiscount
        } = props;
  const navigate = useNavigate();

  const isAdmin = user?.role === ROLES.Admin;
  const isOrganizer = user?.role === ROLES.Organizer;
  const isMember = user?.role === ROLES.Member;

  const firstImage =
    order?.cart?.tickets?.[0]?.eventId?.imageUrls?.[0] || '';
  const totalPrice = order?.cart?.tickets?.reduce((sum, ticket) => sum + ((ticket?.price * ticket.quantity) || 0), 0);

  useEffect(() => {
    let secDiscount = 0;
    const ticketWithCoupon = order?.cart?.tickets?.find((t) => t.coupon);

    if (ticketWithCoupon) {
      const { couponPercentage, couponAmount, price } = ticketWithCoupon;
      secDiscount = couponPercentage > 0 
        ? (price * couponPercentage) / 100 
        : couponAmount;

      setSecondDiscount(secDiscount);
    }
  }, [order?.cart?.tickets]);


  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      {orderIsLoading && <LoadingIndicator />}
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Order</h2>
        <GoBack navigate={navigate} text='go back' />
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} style={{ margin: '.5em' }} />

      <div className='order-view-container'>
        <CRow className='first-order-view'>
          <CCol>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CImage
                src={ResolveImage(API_URL + firstImage)}
                alt='Event'
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <CCardBody>
                <h3>{order?.guest ? 'Guest' : 'User'}</h3>
                <CCardTitle className='d-flex' style={{ justifyContent: 'space-between' }}>
                  <p className='mb-0'><strong>Id:</strong> {order?._id || 'N/A'}</p>
                  <CBadge color={order?.status === 'true' ? 'success' : 'danger'} className='mb-2'>
                    {(order?.status === 'true' ? 'success' : 'failed') || ''}
                  </CBadge>
                </CCardTitle>

                <CRow>
                  <CCol>
                    <strong>Email:</strong> {order?.billingEmail || 'N/A'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <strong>Name:</strong> {order?.guest?.name || order?.user?.name}
                  </CCol>
                </CRow>

                <CRow className='mb-2'>
                  <CCol><strong>Payment Method:</strong> {order?.paymentMethod || 'N/A'}</CCol>
                  <CCol className='text-end'>
                    <strong>Date:</strong> {order?.createdAt ? formatDate(order.createdAt) : 'N/A'}
                  </CCol>
                </CRow>

                {order?.discountAmount > 0
                  ? (
                    <div className='mt-2'>
                      <CRow>
                        <CCol><strong>SubTotal:</strong></CCol>
                        <CCol className='text-end'>
                        ₦{order?.amountBeforeDiscount ? order.amountBeforeDiscount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                      <CRow>
                        <CCol><strong>Discount:</strong></CCol>
                        <CCol className='text-end text-danger'>
                        -₦{order?.discountAmount ? (order.discountAmount + secondDiscount).toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                      <CRow>
                        <CCol><strong>Total:</strong></CCol>
                        <CCol className='text-end fw-bold text-success'>
                        ₦{order?.finalAmount ? order.finalAmount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                    </div>
                    )
                  : (
                    <div className='mt-2'>
                      <CRow>
                        <CCol><strong>SubTotal:</strong></CCol>
                        <CCol className='text-end fw-bold'>
                        ₦{order?.finalAmount ? totalPrice.toLocaleString() : '0'}
                      </CCol>
                      </CRow>

                      <CRow>
                        <CCol><strong>Total:</strong></CCol>
                        <CCol className='text-end fw-bold'>
                        ₦{order?.finalAmount ? order?.finalAmount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                    </div>
                    )}

                <hr />

                {isAdmin && (
                  <>
                    <CRow>
                      <CCol><strong>Paystack Ref:</strong></CCol>
                      <CCol className='text-end'>{order?.payStackReference || 'N/A'}</CCol>
                    </CRow>
                    <CRow>
                      <CCol><strong>Paystack Fees:</strong></CCol>
                      <CCol className='text-end'>
                        ₦{order?.paymentFees ? order.paymentFees.toLocaleString() : '0'}
                      </CCol>
                    </CRow>
                  </>
                )}

              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className='second-order-view'>
          <CCol>
            <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'}`}>
              <CCardBody>
                <h2>Cart Details</h2>
                {order?.cart?.tickets?.length > 0
                  ? order.cart.tickets.map((ticket, index) => {
                    const quantity = ticket?.quantity || 0;
                    const price = ticket?.price || 0;
                    const discountPrice = ticket?.discountPrice || 0;
                    const hasDiscount = ticket?.discount;
                    const hasCoupon = ticket?.coupon;

                    return (
                      <div key={index} className='mb-3 border-bottom pb-2'>
                        <p><strong>Event:</strong> {ticket?.eventId?.name || 'N/A'}</p>
                        <p><strong>Ticket Type:</strong> {ticket?.ticketType || 'N/A'}</p>
                        <p><strong>Quantity:</strong> {quantity}</p>
                        <p>
                          <strong>{!hasDiscount ? 'SubTotal:' : 'SubTotal:'}</strong> ₦{price.toLocaleString()}
                        </p>
                        {hasDiscount && hasCoupon &&
                        <>
                          {ticket.couponAmount > 0 && <>
                            <p> <strong>Coupon:</strong> -₦{(ticket.couponDiscount * -1).toLocaleString()}</p>
                            <p className='text-success'>Total: ₦{(ticket.price - ticket.couponAmount).toLocaleString()}</p>
                          </>}
                          {ticket.couponPercentage > 0 && <>
                            <p className='fw-bold'> <strong>Coupon:</strong> {ticket.couponPercentage}%OFF</p>
                            <p className='text-danger'>Discount: ₦-{(ticket.price * (ticket.couponPercentage / 100)).toLocaleString()}</p>
                            <p className='text-success'>Total: ₦{((ticket.price) - (ticket.price * (ticket.couponPercentage / 100))).toLocaleString()}</p>
                          </>}
                        </>
                        }

                        {hasDiscount && (
                          <>
                          <p className='text-danger'>
                            <strong>Discount:</strong> -₦{(price - discountPrice).toLocaleString()}
                          </p>
                          <p className='text-success'>
                            <strong>Total:</strong> ₦{discountPrice.toLocaleString()}
                          </p>
                        </>
                        )}
                        {hasCoupon && (
                          <>
                          {ticket.couponAmount > 0 && <>
                            <p> <strong>Coupon:</strong> -₦{(ticket.couponDiscount * -1).toLocaleString()}</p>
                            <p className='text-success'>Total: ₦{(ticket.price - ticket.couponAmount).toLocaleString()}</p>
                          </>}
                          {ticket.couponPercentage > 0 && <>
                            <p className='fw-bold'> <strong>Coupon:</strong> {ticket.couponPercentage}%OFF</p>
                            <p className='text-danger'>Discount: ₦-{(ticket.price * (ticket.couponPercentage / 100)).toLocaleString()}</p>
                            <p className='text-success'>Total: ₦{((ticket.price) - (ticket.price * (ticket.couponPercentage / 100))).toLocaleString()}</p>
                          </>}
                          </>
                        )}

                        {quantity > 1 && (
                          <>
                          <p>
                            <strong>Total ({hasDiscount ? 'Discounted ' : ''}Price × Quantity):</strong>{' '}
                            ₦{(hasDiscount ? discountPrice * quantity : price * quantity).toLocaleString()}
                          </p>
                        </>
                        )}
                      </div>
                    );
                  })
                  : <p>No tickets in cart.</p>}
              </CCardBody>
            </CCard>
          </CCol>
                {isAdmin && (
                  <>
                    <CRow>
                      <Button onClick={() => setDeleteOrderVisibility(true)} text={"Delete order"} cls="text-danger mt-2"/>
                    </CRow>
                    <TopSlideConfirmModal
                      visible={deleteOrderVisibility}
                      text={"Confirm to delete order"}
                      onConfirm={(v) => deleteOrder(v, navigate)}
                      onClose={() => setDeleteOrderVisibility(false)}
                      confirmValue={order._id}
                    />
                  </>
                )}
        </CRow>
      </div>
    </div>
  );
};

class ViewOrder extends React.PureComponent {
  componentDidMount () {
    const orderId = this.props.match.params.id;
    this.props.fetchOrder(orderId);
  }

  componentDidUpdate (prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const orderId = this.props.match.params.id;
      this.props.fetchOrder(orderId);
    }
  }

  render () {
    return (
      <OrderViewer {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  user: state.account.user,
  order: state.order.order,
  isLightMode: state.dashboard.isLightMode,
  orderIsLoading: state.order.isLoading,
  deleteOrderVisibility: state.order.deleteOrderVisibility,
  secondDiscount: state.order.secondDiscount,
});

export default connect(mapStateToProps, actions)(withRouter(ViewOrder));
