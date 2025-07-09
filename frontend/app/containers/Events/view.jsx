import React, { useRef, useEffect, useState } from 'react';
import { withRouter } from '../../withRouter';
import actions from '../../actions';
import { connect } from 'react-redux';
import FadeSlider from '../../components/store/FadeSlider';
import Row from '../../components/Common/Row';
import Col from '../../components/Common/Col';
import Button from '../../components/Common/HtmlTags/Button';
import { API_URL } from '../../constants';
import ResolveImage from '../../components/store/ResolveImage';
import { formatReadableDate } from '../../components/store/Card/functions';
import Page404 from '../Page404';
import { MdOutlineAddShoppingCart } from "react-icons/md";
import LoadingIndicator from '../../components/store/LoadingIndicator';

const EventViewer = (props) => {
  const { event = {}, eventIsLoading, eventSlugChange } = props;

  // --- ALL HOOKS MUST BE DECLARED HERE, AT THE TOP LEVEL ---
  const videoRefs = useRef([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Helper to determine if the URL is a video
  const isVideo = (url) => {
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
      const lowerCaseUrl = url.toLowerCase();
      return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
  };

  // Function to handle slide changes in FadeSlider
  const handleBeforeChange = (oldIndex, newIndex) => {
    setCurrentSlideIndex(newIndex); // Update the current slide index

    // Pause the video that is leaving the view
    if (videoRefs.current[oldIndex]) {
      videoRefs.current[oldIndex].pause();
    }
  };

  // Effect to play the video when the slide becomes active
  useEffect(() => {
    // Only attempt to play if there's a video at the current slide index
    // Also, ensure event.imageUrls exists before trying to access it
    if (event.imageUrls && videoRefs.current[currentSlideIndex] && isVideo(event.imageUrls[currentSlideIndex])) {
      const playPromise = videoRefs.current[currentSlideIndex].play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Autoplay started!
        })
        .catch(error => {
          // Autoplay was prevented.
          // This can happen if the user hasn't interacted with the document yet.
          // You might want to show a play button here.
        });
      }
    }
  }, [currentSlideIndex, event.imageUrls]); // Re-run when currentSlideIndex or imageUrls change

  // Clear videoRefs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      videoRefs.current = [];
    };
  }, []);
  // --- END OF HOOK DECLARATIONS ---


  // Now you can place your conditional returns
  if (eventIsLoading) {
      return <LoadingIndicator />;
  }

  if (eventSlugChange) {
    return (
      <Page404 text={"Oops, the event you're looking for has changed"}/>
    )
  }

  const isEventSelect = Object.keys(event).length > 0 ? true : false; // This can be placed here

  if (isEventSelect) {
    return (
        <div style={{ paddingTop: '10em' }} className="event-view bg-white">
          <div className='lg-view-event'>
            <div className="event-card">
                <FadeSlider
                  dots={event && event.imageUrls.length > 1 ? true : false}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  fade={true}
                  autoplay={true}
                  autoplaySpeed={2000}
                  arrows={false}
                  swipeToSlide={true}
                  beforeChange={handleBeforeChange}
                >
                  {event && event.imageUrls?.map((url, idx) => (
                    <div key={idx} className="event-image-wrapper">
                      {isVideo(url) ? (
                        <video
                          ref={el => (videoRefs.current[idx] = el)}
                          muted
                          playsInline
                          loop
                          className="event-image"
                        >
                          <source src={`${API_URL}${url}`} type="video/mp4"></source>
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={ResolveImage(`${API_URL}${url}`)} alt={`event-${idx}`} className="event-image" />
                      )}
                    </div>
                  ))}
                </FadeSlider>
            </div>

            <div className="event-info">
              <h2 className="event-title">{event && event.name}</h2>
              <p className='font-size-20' dangerouslySetInnerHTML={{ __html: event.description }}></p>
              <p className="event-location p-black">Location: {event && event.location}</p>
              <p className="event-location p-black">Category: {event && event.category}</p>
              <p className="event-date p-black">
                From {formatReadableDate(event && event.startDate)} <b className='p-black'>to</b> {formatReadableDate(event && event.endDate)}
              </p>
              <p className='event-host'>Your host: {event && event.user && event.user.organizer && event.user.organizer.companyName || 'The link hangouts'}</p>
              {event && event.status !== "Ended" ? <div className="event-tickets">
                {event && event.tickets && event.tickets.length > 0 ? (
                  <ul className='view-event-ticket view-event-ticket-lg'>
                    {event && event.tickets.map((ticket) => (
                      <li key={ticket._id} className="ticket-item">
                        {!ticket.discount &&
                        <div className='d-flex flex-column'>
                          <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                          <span className='font-size-15'>₦{ticket.price}</span><br />
                          <span>{ticket.quantity} Remaining</span>
                        </div>
                        }
                        {ticket.discount && ticket.discountPrice && (
                          <div style={{ position: 'relative' }}>
                          <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                            <b style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price}</b>&nbsp;&nbsp;
                            <span className="font-size-20">₦{ticket.discountPrice}</span><br />
                            <span>{ticket.quantity} Remaining</span>
                          </div>
                        )}
                        <MdOutlineAddShoppingCart size={30}/>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='font-size-20'>No tickets available</p>
                )}
              </div> : <p className='text-center font-size-20 p-gray'>Sold out</p>}
            </div>
          </div>

          <div className="event-card d-lg-none mobile-view-event">
            <FadeSlider
              dots={event && event.imageUrls.length > 1 ? true : false}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              fade={true}
              autoplay={true}
              autoplaySpeed={2000}
              arrows={false}
              swipeToSlide={true}
              beforeChange={handleBeforeChange}
            >
              {event && event.imageUrls?.map((url, idx) => (
                <div key={idx} className="event-image-wrapper">
                  {isVideo(url) ? (
                    <video
                      ref={el => (videoRefs.current[idx] = el)}
                      muted
                      playsInline
                      loop
                      className="event-image"
                    >
                      <source src={`${API_URL}${url}`} type="video/mp4"></source>
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={ResolveImage(`${API_URL}${url}`)} alt={`event-${idx}`} className="event-image" />
                  )}
                </div>
              ))}
            </FadeSlider>

            <div className="event-info">
              <h2 className="event-title">{event && event.name}</h2>
              <p className='font-size-20' dangerouslySetInnerHTML={{ __html: event.description }}></p>
              <p className="event-location p-black">Location: {event && event.location}</p>
              <p className="event-location p-black">Category: {event && event.category}</p>
              <p className="event-date p-black">
                From {formatReadableDate(event && event.startDate)} <b className='p-black'>to</b> {formatReadableDate(event && event.endDate)}
              </p>
              <p className='event-host'>Your host: {event && event.user && event.user.organizer && event.user.organizer.companyName || 'The link hangouts'}</p>
              {event && event.status !== "Ended" ? <div className="event-tickets">
                {event && event.tickets && event.tickets.length > 0 ? (
                  <ul className='view-event-ticket'>
                    {event.tickets.map((ticket) => (
                      <li key={ticket._id} className="ticket-item">
                        {!ticket.discount &&
                        <div className='d-flex flex-column'>
                          <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                          <span className='font-size-15'>₦{ticket.price}</span>< br/>
                          <span>{ticket.quantity} Remaining</span>
                        </div>
                        }
                        {ticket.discount && ticket.discountPrice && (
                          <div style={{ position: 'relative' }}>
                          <h4 className='font-size-25' style={{ padding: '0', margin: '0' }}>{ticket.type}</h4>
                            <b style={{ fontSize: '15px', textDecoration: 'line-through', color: 'black' }}>₦{ticket.price}</b>&nbsp;&nbsp;
                            <span className="font-size-20">₦{ticket.discountPrice}</span><br />
                            <span>{ticket.quantity} Remaining</span>
                          </div>
                        )}
                        <MdOutlineAddShoppingCart size={30}/>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='font-size-20'>No tickets available</p>
                )}
              </div> : <p className='text-center font-size-20 p-gray'>Sold out</p>}
            </div>
          </div>
        </div>
    );
  }
  // If isEventSelect is false, return null or a loading state if needed.
  return null;
};


class EventView extends React.Component {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    if (slug) {
      this.props.fetchEventSlug(slug);
    }
  }
  componentWillUnmount() {
    this.props.vewingEventToggler(false);
    this.props.resetEventSlugChange();
  }

  render() {
    const { event, isLoading, eventSlugChange } = this.props;
    return (
        <EventViewer {...this.props}/>
    )
  }
}

const mapStateToProps = state => ({
  event: state.event.selectEvent,
  eventIsLoading: state.event.isLoading,
  eventSlugChange: state.event.eventSlugChange
});

export default connect(mapStateToProps, actions)(withRouter(EventView));