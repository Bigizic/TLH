import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './style.css';
import { API_URL } from '../../../constants';
import ResolveImage from '../ResolveImage';
import { formatReadableDate } from '../Card/functions';
import VideoDevice from '../../Common/VideoDevice';
import VideoOverlay from '../../Common/VideoOverlay';

const GalleryViewer = (props) => {
  const { gallery } = props;
  const { bannerUrl, media } = gallery;
  const bannerImage = bannerUrl;
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [showControls, setShowControls] = useState(true); // New state for controls visibility
  const controlTimeoutRef = useRef(null); // Ref to store the timeout ID

  const lightboxRef = useRef(null);
  const touchStartX = useRef(0);

  // Function to reset the control hide timer
  const resetControlTimeout = useCallback(() => {
    setShowControls(true); // Always show controls on interaction
    if (controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current);
    }
    controlTimeoutRef.current = setTimeout(() => {
      setShowControls(false); // Hide controls after 3 seconds
    }, 1000); // 1 seconds delay
  }, []);

  const openLightbox = useCallback((index) => {
    setSelectedMediaIndex(index);
    document.body.style.overflow = 'hidden';
    resetControlTimeout(); // Start timer when lightbox opens
  }, [resetControlTimeout]);

  const closeLightbox = useCallback(() => {
    setSelectedMediaIndex(null);
    document.body.style.overflow = '';
    if (controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current); // Clear timer when lightbox closes
    }
    setShowControls(true); // Reset controls visibility for next open
  }, []);

  const showNextMedia = useCallback(() => {
    if (media && media.length > 0) {
      setSelectedMediaIndex((prevIndex) => (prevIndex + 1) % media.length);
      resetControlTimeout(); // Reset timer on navigation
    }
  }, [media, resetControlTimeout]);

  const showPrevMedia = useCallback(() => {
    if (media && media.length > 0) {
      setSelectedMediaIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
      resetControlTimeout(); // Reset timer on navigation
    }
  }, [media, resetControlTimeout]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedMediaIndex !== null) {
        if (event.key === 'ArrowRight') {
          showNextMedia();
        } else if (event.key === 'ArrowLeft') {
          showPrevMedia();
        } else if (event.key === 'Escape') {
          closeLightbox();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMediaIndex, showNextMedia, showPrevMedia, closeLightbox]);

  // Touch swipe for lightbox
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    resetControlTimeout(); // Reset timer on touch start
  }, [resetControlTimeout]);

  const handleTouchEnd = useCallback((e) => {
    const touchEndXVal = e.changedTouches[0].clientX;
    const swipeDistance = touchEndXVal - touchStartX.current;
    if (swipeDistance > 50) {
      showPrevMedia();
    } else if (swipeDistance < -50) {
      showNextMedia();
    }
  }, [showNextMedia, showPrevMedia]);

  const currentMedia = selectedMediaIndex !== null ? media[selectedMediaIndex] : null;

  // Class for controls to apply fade effect
  const controlsClass = showControls ? '' : 'controls-hidden';

  return (
    <div className="gallery-viewer-container bg-gray-100 min-h-screen">
      {/* Banner Section (unchanged) */}
      <div className="gallery-banner shadow-lg">
        {bannerImage && (
          <img
            src={ResolveImage(API_URL + bannerImage)}
            alt="Gallery Banner"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        )}
        <div className="gallery-info">
          <h2 data-aos="fade-up" className="gallery-title">{gallery.name}</h2>
          {gallery.description && gallery.description.length > 0 && <p className='font-size-20 p-white' dangerouslySetInnerHTML={{ __html: gallery.description }}></p>}
          <p className="gallery-date p-white">
            Date: {formatReadableDate(gallery.date)}
          </p>
          <p data-aos="fade-right" className='gallery-views p-white'>Views: {gallery.views || 0}</p>
        </div>
      </div>


      {/* Gallery Grid Section (unchanged) */}
      <div className="gallery-grid">
        {media && media.map((item, index) => (
          <div
            key={item.mediaUrl || index}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            {item.mediaType === 'image' && (
              <div className="image-placeholder-container">
                {/* BlurhashCanvas was removed from your provided code, keeping it out */}
                <img
                  src={ResolveImage(API_URL + item.mediaUrl)}
                  alt={`Gallery Image ${index + 1}`}
                  className="gallery-item-image"
                  loading="lazy"
                  onLoad={(e) => e.target.classList.add('loaded')}
                  data-aos="fade-up"
                />
              </div>
            )}
            {item.mediaType === 'video' && (
                <VideoOverlay videoUrl={item.mediaUrl}/>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      <div
        ref={lightboxRef}
        className={`lightbox-overlay ${selectedMediaIndex !== null ? 'open' : ''}`}
        // Add interaction listeners to the overlay to reset the timer
        onClick={(e) => {
          if (e.target === lightboxRef.current) { // Only close if clicking on overlay background
            closeLightbox();
          }
          resetControlTimeout(); // Always reset timeout on click
        }}
        onMouseMove={resetControlTimeout} // Reset timeout on mouse movement
        onTouchStart={handleTouchStart} // Already had this, ensure it calls resetControlTimeout
        onTouchEnd={handleTouchEnd} // Already had this
      >
        {currentMedia && (
          <div className="lightbox-content">
            {/* Apply controlsClass to the buttons */}
            <button className={`lightbox-close ${controlsClass}`} onClick={closeLightbox}>
              <FaTimes />
            </button>
            {media.length > 1 && (
              <>
                <button className={`lightbox-nav-btn left ${controlsClass}`} onClick={showPrevMedia}>
                  <FaChevronLeft />
                </button>
                <button className={`lightbox-nav-btn right ${controlsClass}`} onClick={showNextMedia}>
                  <FaChevronRight />
                </button>
              </>
            )}

            {currentMedia.mediaType === 'image' && (
              <img
                src={ResolveImage(API_URL + currentMedia.mediaUrl)}
                alt={`Full Gallery Image ${selectedMediaIndex + 1}`}
                className="lightbox-media"
              />
            )}
            {currentMedia.mediaType === 'video' && (
              <video
                src={ResolveImage(API_URL + currentMedia.mediaUrl)}
                // Remove 'controls' attribute from here, as we want custom controls
                autoPlay
                loop
                className="lightbox-media"
                controls
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryViewer;