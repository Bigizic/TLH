import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CImage,
} from '@coreui/react';
import Button from '../../Common/HtmlTags/Button';
import ResolveImage from '../../store/ResolveImage'; // Assuming this handles image paths
import { API_URL } from '../../../constants';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import ManagerPagination from '../Pagination';
import Switch from '../../store/Switch';
import { FaTrash } from 'react-icons/fa';
import { connect } from 'react-redux';
import { withRouter } from '../../../withRouter';
import actions from '../../../actions';

const ManagerMediaHelper = (props) => {
  const {
    isLightMode,
    medias = [],
    deleteMedia,
    updateMedia,
    defaultWarning,
    isLoading
  } = props;
  const navigate = useNavigate();
  const mediasPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(medias.length / mediasPerPage);
  const startIndex = (currentPage - 1) * mediasPerPage;
  const endIndex = startIndex + mediasPerPage;
  const currentMedias = medias.slice(startIndex, endIndex);

  const defaultMedia = medias.find(media => media.default);

  const handleActiveToggle = (mediaId, currentActiveStatus) => {
    updateMedia(mediaId, { active: !currentActiveStatus }, navigate);
  };

  const handleDefaultToggle = (mediaId, currentDefaultStatus) => {
    // Prevent setting to default if another media is already default
    if (!currentDefaultStatus && defaultMedia && defaultMedia._id !== mediaId) {
      return defaultWarning();
    }
    updateMedia(mediaId, { default: !currentDefaultStatus }, navigate);
  };

  const handleDeleteMedia = (mediaId) => {
      deleteMedia(mediaId, navigate);
  };

  // Helper function to determine if a URL is a video
  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
  };

  return (
    <div data-aos='fade-up' className='container-lg px-4 d-flex flex-column mb-custom-5em'>
      <div className='d-flex justify-content-between'>
        <h2 style={{ margin: 0 }} className={`${isLightMode ? 'p-black' : 'p-white'}`}>Media</h2>
        <Button onClick={() => navigate('/dashboard/media/add')} type='third-btn' text='Add Media +' />
      </div>
      <hr className={`${isLightMode ? 'p-black' : 'p-white'}`} />
      <div>
        {isLoading && <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>Loading medias...</p>}
        {!isLoading && currentMedias.length === 0 && (
          <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>No medias available.</p>
        )}
        <CRow className='gy-4'>
          {currentMedias.map((media, idx) => (
            <CCol md={6} lg={4} key={media._id || idx}>
              <CCard style={{ height: '100%' }} className={`${isLightMode ? 'bg-white p-black' : 'bg-black p-white border'} d-flex flex-column`}>
                <div style={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                  {media.mediaUrl ? (
                    isVideo(media.mediaUrl) ? (
                      <video
                        playsInline
                        muted
                        src={`${API_URL}${media.mediaUrl}`}
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <CImage
                        src={ResolveImage(`${API_URL}${media.mediaUrl}`)}
                        alt={`Media ${media._id}`}
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      />
                    )
                  ) : (
                    <div className='text-muted'>No Media</div>
                  )}
                 <div style={{ position: 'absolute', right: '0', top: '0' }} className='d-flex justify-content-end'>
                    <Button
                      style={{ padding: '.5em 1em' }}
                      onClick={() => handleDeleteMedia(media._id)}
                      text={<FaTrash />}
                      cls='p-2'
                    />
                  </div>
                </div>
                <CCardBody className='d-flex flex-column justify-content-between'>
                  <div>
                    <p className='mb-1'>
                      <strong>Created:</strong> {formatDate(media.createdAt)}
                    </p>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <Switch
                        id={`active-media-${media._id}`}
                        name='active'
                        label='Active'
                        checked={media.active}
                        toggleCheckboxChange={() => handleActiveToggle(media._id, media.active)}
                      />
                      <Switch
                        id={`default-media-${media._id}`}
                        name='default'
                        label='Default'
                        checked={media.default}
                        toggleCheckboxChange={() => handleDefaultToggle(media._id, media.default)}
                      />
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>

        <ManagerPagination
          isLightMode={isLightMode}
          data={medias}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

class ManagerMedia extends React.PureComponent {
  componentDidMount() {
    this.props.fetchMedias();
  }

  render() {
    return (
      <ManagerMediaHelper {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  medias: state.media.medias,
  isLoading: state.media.isLoading,
  isLightMode: state.dashboard.isLightMode,
});

export default connect(mapStateToProps, actions)(withRouter(ManagerMedia));