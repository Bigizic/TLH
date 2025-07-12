import React from 'react';
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

const OrderViewer = (props) => {
  const { order = {}, user, isLightMode, orderIsLoading } = props;
  const navigate = useNavigate();

  const isAdmin = user?.role === ROLES.Admin;
  const isOrganizer = user?.role === ROLES.Organizer;
  const isMember = user?.role === ROLES.Member;

  const firstImage =
    order?.cart?.tickets?.[0]?.eventId?.imageUrls?.[0] || '';
  const totalPrice = order?.cart?.tickets?.reduce((sum, ticket) => sum + ((ticket?.price * ticket.quantity) || 0), 0);

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
                  <CBadge color={order?.paymentStatus === 'success' ? 'success' : 'danger'} className='mb-2'>
                    {order?.paymentStatus || ''}
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
                        <CCol><strong>Original:</strong></CCol>
                        <CCol className='text-end'>
                        ₦{order?.amountBeforeDiscount ? order.amountBeforeDiscount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                      <CRow>
                        <CCol><strong>Discount:</strong></CCol>
                        <CCol className='text-end text-danger'>
                        -₦{order?.discountAmount ? order.discountAmount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                      <CRow>
                        <CCol><strong>Final:</strong></CCol>
                        <CCol className='text-end fw-bold text-success'>
                        ₦{order?.finalAmount ? order.finalAmount.toLocaleString() : '0'}
                      </CCol>
                      </CRow>
                    </div>
                    )
                  : (
                    <div className='mt-2'>
                      <CRow>
                        <CCol><strong>Final Amount:</strong></CCol>
                        <CCol className='text-end fw-bold'>
                        ₦{order?.finalAmount ? totalPrice.toLocaleString() : '0'}
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
            <CCard>
              <CCardBody>
                <h2>Cart Details</h2>
                {order?.cart?.tickets?.length > 0
                  ? order.cart.tickets.map((ticket, index) => {
                    const quantity = ticket?.quantity || 0;
                    const price = ticket?.price || 0;
                    const discountPrice = ticket?.discountPrice || 0;
                    const hasDiscount = ticket?.discount;

                    return (
                      <div key={index} className='mb-3 border-bottom pb-2'>
                        <p><strong>Event:</strong> {ticket?.eventId?.name || 'N/A'}</p>
                        <p><strong>Ticket Type:</strong> {ticket?.ticketType || 'N/A'}</p>
                        <p><strong>Quantity:</strong> {quantity}</p>
                        <p>
                          <strong>{!hasDiscount ? 'Price:' : 'Original price:'}</strong> ₦{price.toLocaleString()}
                        </p>

                        {hasDiscount && (
                          <>
                          <p className='text-danger'>
                            <strong>Discount:</strong> -₦{(price - discountPrice).toLocaleString()}
                          </p>
                          <p className='text-success'>
                            <strong>Final price:</strong> ₦{discountPrice.toLocaleString()}
                          </p>
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
  orderIsLoading: state.order.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ViewOrder));
