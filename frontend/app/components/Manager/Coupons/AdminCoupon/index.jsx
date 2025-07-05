import React, { useState } from 'react';
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
  CPaginationItem
} from '@coreui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ResolveImage from '../../../store/ResolveImage';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import { Link } from 'react-router-dom';

const AdminCouponHelper = (props) => {
  const { isLightMode, user, coupons = [] } = props;
  const navigate = props.navigate || (() => {});
  const [visibleCodes, setVisibleCodes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;

  const toggleCodeVisibility = (idx) => {
    setVisibleCodes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalPages = Math.ceil(coupons.length / couponsPerPage);
  const startIndex = (currentPage - 1) * couponsPerPage;
  const endIndex = startIndex + couponsPerPage;
  const currentCoupons = coupons.slice(startIndex, endIndex);

  const mostUsedCoupon = coupons.length > 0 
    ? coupons.reduce((prev, curr) => curr.usedCount > prev.usedCount ? curr : prev)
    : { code: 'N/A', usedCount: 0 };
  const activeCount = coupons.filter(c => c.active).length;
  const inactiveCount = coupons.length - activeCount;

  return (
    <div data-aos="fade-up" className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black': 'p-white'}`}>My Coupons</h2>
        <GoBack navigate={navigate} text="Go back" />
      </div>
      <hr className={`${isLightMode ? 'p-black': 'p-white'}`}></hr>

      {/* Coupon Stats */}
      <CRow className="mb-4 g-2 w-100">
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Most Used Coupon</CCardTitle>
              <CCardText>{mostUsedCoupon.code} ({mostUsedCoupon.usedCount} used)</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Active Coupons</CCardTitle>
              <CCardText>{activeCount}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
            <CCardBody>
              <CCardTitle>Inactive Coupons</CCardTitle>
              <CCardText>{inactiveCount}</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Coupon List */}
      <CRow className="gy-4">
        {currentCoupons.map((coupon, idx) => (
          <CCol md={6} key={idx}>
            <Link to={`/dashboard/coupons/edit/${coupon._id}`}>
              <CCard className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                <CImage
                  src={ResolveImage(coupon.image, 'coupon')}
                  alt={coupon.event?.name || 'Coupon'}
                  style={{ width: '40%', objectFit: 'cover' }}
                />
                <CCardBody>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <CCardTitle><strong>Event: </strong>{coupon.event?.name || 'N/A'}</CCardTitle>
                    <CBadge color={coupon.active ? 'success' : 'danger'}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </CBadge>
                  </div>
                  <div
                    className='mb-2'
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCodeVisibility(idx);
                    }}
                  >
                    {visibleCodes[idx] ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  <p className='mb-2'>
                    <strong>Code:</strong> {visibleCodes[idx] ? coupon.code : '••••••••'}
                  </p>
                  <CCardText>
                    <strong>Qty:</strong> {coupon.quantity}<br />
                    <strong>Used:</strong> {coupon.usedCount}<br />
                    <strong>Limit/User:</strong> {coupon.userLimit}<br />
                    <strong>Discount:</strong> {coupon.percentage}% Off<br />
                    <strong>Ticket Types:</strong> {coupon.ticket?.length > 0 ? coupon.ticket.map(t => t.type).join(', ') : 'All'}
                  </CCardText>
                </CCardBody>
              </CCard>
            </Link>
          </CCol>
        ))}
      </CRow>

      {totalPages > 1 && (
        <div className='mt-4'>
          <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
            <span className={`${isLightMode ? 'p-black': 'p-white'} fw-bold`}>
              Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
                endIndex > coupons.length ? coupons.length : endIndex
              } of {coupons.length} entries
            </span>
          </div>
          <CPagination align='center'>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
              >
                {index + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </div>
      )}
    </div>
  );
};

class AdminCoupon extends React.PureComponent {
  componentDidMount() {
    this.props.getUserCoupons();
  }

  render() {
    return (
      <AdminCouponHelper {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  coupons: state.coupon.userCoupons,
  couponIsLoading: state.coupon.isLoading,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(withRouter(AdminCoupon));