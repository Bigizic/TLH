import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Row from '../../../Common/Row';
import Col from '../../../Common/Col';

import Input from '../../../Common/HtmlTags/Input';
import Button from '../../../Common/HtmlTags/Button';
import Switch from '../../../store/Switch';
import LoadingIndicator from '../../../store/LoadingIndicator';
import DescriptionBox from '../../../store/DescriptionBox';
import SelectOption from '../../../store/SelectOption';
import { GoBack } from '../../../../containers/goBack/inedx';
import { withRouter } from '../../../../withRouter';
import { connect } from 'react-redux';
import actions from '../../../../actions';
import { formatDateForInput } from '../../../../utils/formatDate';
import { eventCategoryFinder } from '../../../../utils/eventCategories';
import AdvancedUpload from '../../../store/AdanceFileUpload';
import { API_URL } from '../../../../constants';
import AdvancedUploadHelper from '../../../store/AdanceFileUpload/updateFileUpload';

import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell
} from '@coreui/react';
import { CButton } from '@coreui/react';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const EditEventForm = (props) => {
  const {
    event,
    eventEditFormErrors,
    eventEditChange,
    updateEvent,
    eventIsLoading,
    isLightMode,
    image,
    eventCategories,
    deleteEvent,
    eventImageToRemove,
    eventChange,
  } = props;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    updateEvent(navigate);
  };

  const imageUrls = event.imageUrls?.map((url) => `${API_URL}${url}`) || [];

  return (
    <div className='add-event d-flex flex-column mb-custom-5em'>
      {eventIsLoading && <LoadingIndicator isLightMode={isLightMode} />}
      <div
        style={{
          marginBottom: '-1em',
          justifyContent: 'space-between',
          padding: '0em 1em'
        }}
        className='d-flex'
      >
        <h2 className={`${isLightMode ? 'p-black' : 'p-white'} font-size-25`}>Event details</h2>
        <GoBack navigate={navigate} />
      </div>
      
      <form noValidate>
        <Row>
          {/* Event Name */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={eventEditFormErrors.name}
              label='Event Name'
              name='name'
              placeholder='Enter event name'
              value={event.name || ''}
              onInputChange={eventEditChange}
            />
          </Col>

          {/* Event Location */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='text'
              error={eventEditFormErrors.location}
              label='Venue'
              name='location'
              placeholder='Enter event Venue'
              value={event.location || ''}
              onInputChange={eventEditChange}
            />
          </Col>

          {/* Event Start Date */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={eventEditFormErrors.startDate}
              label='Start Date'
              name='startDate'
              value={formatDateForInput(event.startDate) || ''}
              onInputChange={eventEditChange}
            />
          </Col>

          {/* Event End Date */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='date'
              error={eventEditFormErrors.endDate}
              label='End Date'
              name='endDate'
              value={formatDateForInput(event.endDate) || ''}
              onInputChange={eventEditChange}
            />
          </Col>

          {/* Capacity */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <Input
              type='number'
              error={eventEditFormErrors.capacity}
              label='Capacity'
              name='capacity'
              placeholder='Enter no. of attendees (Optional)'
              value={event.capacity || ''}
              onInputChange={eventEditChange}
            />
          </Col>

          {/* Event Category */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12' lg='6'>
            <SelectOption
              error={eventEditFormErrors.category}
              label='Category'
              placeholder='Select category (e.g., Conference)'
              prevValue={eventCategoryFinder(eventCategories, event.category) || ''}
              value={event.category || ''}
              multi={false}
              options={eventCategories}
              handleSelectChange={(v) => eventEditChange('category', v)}
            />
          </Col>

          {/* Description */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <DescriptionBox
              error={eventEditFormErrors.description}
              formData={event}
              placeholder='Enter event description...'
              isLightMode={isLightMode}
              onChange={eventEditChange}
            />
          </Col>

          {/* Image Upload */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <h5 style={{ paddingTop: '1em' }}>Upload new Event images</h5>
          <AdvancedUpload
            error={eventEditFormErrors.image}
            onFilesChange={(files) => eventEditChange('image', files)}
          />
            
            <h5 style={{ paddingTop: '1em' }}>Event images</h5>
          <AdvancedUploadHelper
            error={eventEditFormErrors.image}
            initialUrls={imageUrls}
            onRemoveUrlChange={(url) => eventImageToRemove(url)}
            />
          </Col>

          {/* Event Status Switch */}
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <Switch
              id='active-event'
              name='status'
              label='Is Active?'
              checked={event.isActive || ''}
              toggleCheckboxChange={(value) =>
                eventEditChange('isActive', value)}
            />
          </Col>
          <Col className={`${isLightMode ? 'p-black' : 'p-white'}`} xs='12'>
            <div className="alert alert-info" role="alert">
                By default, your event is visible and can be found in the <strong>Discover Events</strong> section.  
                <br />
                If you toggle visibility <strong>on</strong>, your event will also appear in <strong>homepage popover ads</strong>, giving it more exposure.
            </div>
            <Switch
              id='event-visibility'
              name='visibiliy'
              label='Visibilitty'
              checked={event.visibility || ''}
              toggleCheckboxChange={(value) =>
                eventEditChange('visibility', value)}
            />
          </Col>

          <Col className='d-flex flex-column' style={{ marginTop: '1em', width: '100%' }}>
            {Array.isArray(event.tickets) && event.tickets.length > 0 ? (
              <>
              <h4 className={`${isLightMode ? 'p-black' : 'p-white'}`} style={{ textAlign: 'center' }}>Event tickets</h4>
<CTable bordered striped hover responsive>
  <CTableHead color="dark">
    <CTableRow>
      <CTableHeaderCell scope="col">Type</CTableHeaderCell>
      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
      <CTableHeaderCell scope="col">Q.</CTableHeaderCell>
      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
      <CTableHeaderCell scope="col">Discount Price</CTableHeaderCell>
      <CTableHeaderCell scope="col">Coupon</CTableHeaderCell>
      <CTableHeaderCell scope="col">Has Discount</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {event.tickets.map((ticket, index) => (
      <CTableRow key={index}>
        <CTableDataCell>{ticket.type}</CTableDataCell>
        <CTableDataCell>
          <CButton
            className="purple-bg p-white"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/tickets/edit/${ticket._id}`)}
          >
            <CIcon icon={cilPencil} className="sm-2" />
            Edit
          </CButton>

        </CTableDataCell>
        <CTableDataCell>{ticket.quantity}</CTableDataCell>
        <CTableDataCell>{`₦${ticket.price.toLocaleString()}`}</CTableDataCell>
        <CTableDataCell>
          {ticket.discountPrice ? `₦${ticket.discountPrice.toLocaleString()}` : '—'}
        </CTableDataCell>
        <CTableDataCell>
          {Array.isArray(ticket.coupons) && ticket.coupons.length > 0
            ? 'YES' 
            : 'No coupon'}
        </CTableDataCell>
        <CTableDataCell>{ticket.discount ? 'Yes' : 'No'}</CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>
<Col style={{ alignSelf: 'center'  }}>
    <Button onClick={() => navigate(`/dashboard/tickets/add?event=${event._id}`)} style={{ padding: '10px 20px'}} text={"Add more Tickets"} />
</Col>
  </>
) : (
  <>
  <p className={`${isLightMode ? 'p-black' : 'p-white'}`}>No tickets found for this event.</p>
  <Col style={{ alignSelf: 'center'  }}>
    <Button onClick={() => navigate(`/dashboard/tickets/add?event=${event._id}`)} style={{ padding: '10px 20px'}} text={"Add Tickets"} />
</Col>
  </>
)}
          </Col>
        </Row>

      </form>
      <Row>
          <div className='edit-event-actions'>
            <Button onClick={handleSubmit} style={{ padding: '10px 20px' }} text='Save Event' />
            <Button
              onClick={() => deleteEvent(event._id, navigate)}
              style={{ padding: '10px 20px' }}
              text='Delete Event'
            />
          </div>
        </Row>
    </div>
  );
};

class EditEvent extends React.PureComponent {
  componentDidMount () {
    this.props.resetEvent();
    const eventId = this.props.match.params.id;
    this.props.fetchEvent(eventId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.resetEvent();
      const eventId = this.props.match.params.id;
      this.props.fetchEvent(eventId);
    }
  }

  render () {
    const { deleteEvent } = this.props;
    return (
      <EditEventForm {...this.props} />
    );
  }
}

const mapStateToProps = state => ({
  event: state.event.event,
  eventEditFormErrors: state.event.editFormErrors,
  eventIsLoading: state.event.isLoading
});

export default connect(mapStateToProps, actions)(withRouter(EditEvent));
