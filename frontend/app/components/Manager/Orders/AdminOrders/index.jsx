import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
  CImage,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { useState } from 'react';
import ResolveImage from '../../../store/ResolveImage';
import { ROLES, API_URL } from '../../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/formatDate';
import { withRouter } from '../../../../withRouter';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import Button from '../../../Common/HtmlTags/Button';
import ManagerPagination from '../../Pagination';
import LoadingIndicator from '../../../store/LoadingIndicator';
import { GoBack } from '../../../../containers/goBack/inedx';

const ManagerOrderList = (props) => {
  const { isLightMode, user, orderIsLoading, orders } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);
  const navigate = useNavigate();

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      {orderIsLoading && <LoadingIndicator />}
        <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>My Orders</h2>
        <div className='align-self-end'>
            <GoBack navigate={navigate} text={"go back"}/>
        </div>
        </div>
        <hr className={`${isLightMode ? 'p-black': 'p-white'}`} style={{ margin: '.5em' }}></hr>
        <h2 className={`${isLightMode ? 'p-black': 'p-white'} font-size-20`}>{orders.length} Orders</h2>


      <CRow className='gy-4'>
      {currentOrders.map((order, idx) => (
       <CCol md={6} key={idx}>
        <Link to={`/dashboard/orders/${order._id}`}>
    <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
      <div style={{ width: '40%' }}>
        <CImage
          src={ResolveImage(API_URL + order.events[0].imageUrls[0] || '')}
          alt='Order Event'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <CCardBody>
        <CCardTitle className='mb-2'>
          <strong>Order:</strong> #{order._id || 'N/A'}
        </CCardTitle>

        <CBadge color={order.paymentStatus === 'success' ? 'success' : 'danger'} className='mb-2'>
          {order.paymentStatus}
        </CBadge>
        <CRow>
          <CCol className='mb-2'>
            <strong>Email:</strong> {order.billingEmail || 'N/A'}
          </CCol>
        </CRow>

        <CRow className='mb-2'>
          <CCol>
            <strong>Method:</strong> {order.paymentMethod || 'N/A'}
          </CCol>
          <CCol className='text-end'>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </CCol>
        </CRow>

        {order.discountAmount > 0 ? (
          <div className='mt-2'>
            <CRow>
              <CCol><strong>Original:</strong></CCol>
              <CCol className='text-end'>₦{order.amountBeforeDiscount.toLocaleString()}</CCol>
            </CRow>
            <CRow>
              <CCol><strong>Discount:</strong></CCol>
              <CCol className='text-end text-danger'>-₦{order.discountAmount.toLocaleString()}</CCol>
            </CRow>
            <CRow>
              <CCol><strong>Final:</strong></CCol>
              <CCol className='text-end fw-bold text-success'>₦{order.finalAmount.toLocaleString()}</CCol>
            </CRow>
          </div>
        ) : (
          <div className='mt-2'>
            <CRow>
              <CCol><strong>Final Amount:</strong></CCol>
              <CCol className='text-end fw-bold'>₦{order.finalAmount.toLocaleString()}</CCol>
            </CRow>
          </div>
        )}
      </CCardBody>
    </CCard>
    </Link>
  </CCol>
))}
      </CRow>
        <ManagerPagination
          isLightMode={isLightMode}
          data={orders}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
    </div>
  );
};

class AdminOrder extends React.PureComponent {
  componentDidMount () {
    this.props.userOrders();
  }

  render () {
    return (
      <ManagerOrderList {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  orders: state.order.userOrders,
  orderIsLoading: state.order.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(AdminOrder));
