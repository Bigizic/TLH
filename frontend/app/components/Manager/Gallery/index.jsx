import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../../withRouter';
import actions from '../../../actions';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CImage,
} from '@coreui/react';
import { FaEye } from 'react-icons/fa';
import Button from '../../Common/HtmlTags/Button';
import ResolveImage from '../../store/ResolveImage';
import { ROLES, API_URL } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import ManagerPagination from '../Pagination';

const ManagerGalleryHelper = (props) => {
  const {
    isLightMode,
    user,
    galleries = [],
    fetchGalleries
  } = props;
  const navigate = useNavigate();
  const galleriesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(galleries.length / galleriesPerPage);
  const startIndex = (currentPage - 1) * galleriesPerPage;
  const endIndex = startIndex + galleriesPerPage;
  const currentGalleries = galleries.slice(startIndex, endIndex);

  // Find the most viewed gallery
  const mostViewedGallery = galleries.reduce((max, gallery) => {
    return (gallery.views || 0) > (max.views || 0) ? gallery : max;
  }, { views: -1 });

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Gallery</h2>
        <Button onClick={() => navigate('/dashboard/gallery/add')} type='third-btn' text='Create Gallery +' />
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />
      <div>
        {/* --- Most Viewed Gallery Card --- */}
        {mostViewedGallery && mostViewedGallery.views > -1 && (
          <CRow className='mb-4'>
            <CCol xs={12}>
              <CCard className={`${isLightMode ? 'linear-grad' : 'bg-dark-mode'} text-white`}>
                <CCardBody className='d-flex align-items-center'>
                  <CImage
                    src={ResolveImage(mostViewedGallery.bannerUrl ? `${API_URL}${mostViewedGallery.bannerUrl}` : '')}
                    alt={mostViewedGallery.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' }}
                  />
                  <div>
                    <CCardTitle className='mb-1'>Most Viewed Gallery: {mostViewedGallery.name}</CCardTitle>
                    <CCardText className='mb-0'>
                      <FaEye className='me-1' /> {mostViewedGallery.views || 0} Views
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
        {/* --- End Most Viewed Gallery Card --- */}

        <CRow className='gy-4'>
          {currentGalleries.map((gallery, idx) => (
            <CCol md={6} key={idx}>
              <Link to={`/dashboard/gallery/edit/${gallery._id}`} style={{ textDecoration: 'none' }}>
                <CCard style={{ height: '95%' }} className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} flex-row overflow-hidden`}>
                  <CImage
                    src={ResolveImage(gallery.bannerUrl ? `${API_URL}${gallery.bannerUrl}` : '')}
                    alt={gallery.name}
                    style={{ width: '40%', objectFit: 'cover' }}
                  />
                  <CCardBody>
                    <CCardTitle className='mb-2'>{gallery.name}</CCardTitle>
                    <CCardText className='mt-2'>
                      <strong dangerouslySetInnerHTML={{ __html: gallery.description || 'N/A<br />' }}></strong>
                      <strong>Date:</strong> {formatDate(gallery.date)}<br />
                      <span className="d-flex align-items-center">
                        <FaEye className='me-1' /> <strong>Views:</strong> {gallery.views || 0}
                      </span>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </Link>
            </CCol>
          ))}
        </CRow>
        <ManagerPagination
          isLightMode={isLightMode}
          data={galleries}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

class ManagerGallery extends React.PureComponent {
  componentDidMount () {
    this.props.fetchGalleries();
  }

  render () {
    return (
      <ManagerGalleryHelper {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  galleries: state.gallery.galleries,
  galleryIsLoading: state.gallery.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(ManagerGallery));