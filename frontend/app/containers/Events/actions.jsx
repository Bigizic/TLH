/*
 *
 * Event actions
 *
 */
import { useState } from 'react';
import { showNotification } from '../Notification/actions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import {
  FETCH_EVENT,
  FETCH_EVENTS,
  FETCH_USER_EVENT,
  EVENT_CHANGE,
  EVENT_EDIT_CHANGE,
  SET_EVENT_FORM_ERRORS,
  SET_EVENT_FORM_EDIT_ERRORS,
  RESET_EVENT,
  ADD_EVENT,
  REMOVE_EVENT,
  FETCH_EVENTS_SELECT,
  SET_EVENTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS,
  IMAGE_TO_REMOVE,

  CREATE_EVENT_TICKET,
  DELETE_EVENT_TICKET,
  EDIT_EVENT_TICKET,
  FETCH_ALL_EVENTS,
  SELECT_EVENT,
  VIEWING_EVENT,
  EVENT_CHANGED
} from './constants';

import { API_URL } from '../../constants';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';

export const vewingEventToggler = (v) => {
  return {
    type: VIEWING_EVENT,
    payload: v
  }
}

export const createEventTicket = (ticket) => ({
  type: CREATE_EVENT_TICKET,

  payload: {
    ...ticket,
    id: uuidv4(),
  },
});

export const editEventTicket = (id, updatedFields) => ({
  type: EDIT_EVENT_TICKET,
  payload: { id, updatedFields },
});

export const deleteEventTicket = (id) => ({
  type: DELETE_EVENT_TICKET,
  payload: id,
});


export const eventChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: EVENT_CHANGE,
    payload: formData
  };
};

export const eventImageToRemove = (value) => {
  return {
    type: IMAGE_TO_REMOVE,
    payload: value
  }
}

export const eventEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: EVENT_EDIT_CHANGE,
    payload: formData
  };
};

export const resetEvent = () => {
  return async (dispatch) => {
    dispatch({ type: RESET_EVENT });
  };
};

export const setEventLoading = (value) => {
  return {
    type: SET_EVENTS_LOADING,
    payload: value
  };
};

// Fetch all events
export const fetchEvents = () => {
  return async (dispatch) => {
    try {
      dispatch(setEventLoading(true));

      const response = await axios.get(`${API_URL}/event`);
      dispatch({
        type: FETCH_EVENTS,
        payload: response.data.events
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Fetch single event by ID
export const fetchEvent = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/event/${id}`);
      dispatch({
        type: FETCH_EVENT,
        payload: response.data.event
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};


// Add new event
export const addEvent = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setEventLoading(true));
    try {
      const rules = {
        name: 'required',
        description: 'required|max:5000',
        startDate: 'required',
        endDate: 'required',
        location: 'required',
        category: 'required',
        image: 'required'
      };
      const event = getState().event.eventFormData;

      const newEvent = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        capacity: event.capacity,
        category: event.category,
        location: event.location,
        image: event.image,
        isActive: event.isActive,
      };

      const { isValid, errors } = allFieldsValidation(newEvent, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.startDate': 'A Date is required.',
        'required.endDate': 'A Date is required.',
        'required.category': 'Select a category',
        'required.location': 'Location is required.',
        'required.image': 'Image is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_EVENT_FORM_ERRORS, payload: errors });
      }

      const formData = new FormData();
      for (const key in newEvent) {
        if (newEvent.hasOwnProperty(key)) {
          if (key === 'category') {
            formData.set(key, newEvent[key].label)
          } else if (key === 'image') {
            for (const file of newEvent.image) {
              formData.append('images', file);
            }
          } else {
            formData.set(key, newEvent[key]);
          }
        }
      }

      const response = await axios.post(`${API_URL}/event/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: ADD_EVENT, payload: response.data.event });
        dispatch(resetEvent());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error saving event, try again!');
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Add new event and its tickets
export const addEventTicket = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setEventLoading(true));
    try {
      const eventTickets = getState().event.eventTickets;

      if (!eventTickets || eventTickets.length === 0) {
        return handleError("error", dispatch, 'Error adding ticket, try agian!');
      }

      // Format tickets with the eventId
      const ticketsPayload = eventTickets.map((ticket) => ({
        type: ticket.type,
        price: parseFloat(ticket.price),
        discount: ticket.discount || false,
        quantity: ticket.quantity || 0,
        coupons: ticket.coupons || [],
        discountPrice: parseFloat(ticket.discountPrice) || 0,
      }));

      let response = await axios.post(`${API_URL}/ticket/add`, {
        tickets: ticketsPayload
      });

      // Optional: You can dispatch here if you want to store the new ticket objects
      let tickets = response.data.tickets;
      tickets = tickets.map(ticket => ticket._id);

      const rules = {
        name: 'required',
        description: 'required|max:5000',
        startDate: 'required',
        endDate: 'required',
        location: 'required',
        category: 'required',
        image: 'required',
      };

      const event = getState().event.eventFormData;
      const newEvent = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        capacity: event.capacity,
        category: event.category,
        location: event.location,
        image: event.image,
        isActive: event.isActive,
        visibility: event.visibility
      };

      const { isValid, errors } = allFieldsValidation(newEvent, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.startDate': 'A Date is required.',
        'required.endDate': 'A Date is required.',
        'required.category': 'Select a category',
        'required.location': 'Location is required.',
        'required.image': 'Image is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_EVENT_FORM_ERRORS, payload: errors });
      }

      const formData = new FormData();
      for (const key in newEvent) {
        if (newEvent.hasOwnProperty(key)) {
          if (key === 'category') {
            formData.set(key, newEvent[key].label);
          } else if (key === 'image') {
            for (const file of newEvent.image) {
              formData.append('images', file);
            }
          } else {
            formData.set(key, newEvent[key]);
          }
        }
      }

      tickets.forEach((ticket) => {
        formData.append('tickets', ticket);
      });

      // Create the event
      response = await axios.post(`${API_URL}/event/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const createdEvent = response.data.event;

      dispatch(showNotification('success', 'Event and tickets saved successfully!'));
      dispatch({ type: ADD_EVENT, payload: createdEvent });
      dispatch(resetEvent());
      navigate(-1);
    } catch (error) {
      handleError(error, dispatch, 'Error saving event or tickets. Try again!');
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Update existing event
export const updateEvent = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setEventLoading(true));

    try {
      const rules = {
        name: 'required',
        description: 'required|max:5000',
        startDate: 'required',
        endDate: 'required',
        location: 'required',
        category: 'required',
      };

      const event = getState().event.event;
      const removeImage = getState().event.imageToRemove || [];

      const updatedEvent = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        capacity: event.capacity || 0,
        category: event.category,
        location: event.location,
        image: event.image || [],
        isActive: event.isActive,
        visibility: event.visibility
      };
      const { isValid, errors } = allFieldsValidation(updatedEvent, rules, {
        'required.name': 'Name is required.',
        'required.description': 'Description is required.',
        'max.description': 'Description may not be greater than 5000 characters.',
        'required.startDate': 'Start Date is required.',
        'required.endDate': 'End Date is required.',
        'required.location': 'Location is required.',
        'required.category': 'Category is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_EVENT_FORM_EDIT_ERRORS, payload: errors });
      }

      const formData = new FormData();
      for (const key in updatedEvent) {
        if (updatedEvent.hasOwnProperty(key)) {
          if (key === 'category') {
            formData.set(key, updatedEvent[key].label || updatedEvent[key]);
          } else if (key === 'image') {
            for (const file of updatedEvent.image) {
              formData.append('images', file);
            }
          } else {
            formData.set(key, updatedEvent[key]);
          }
        }
      }
      removeImage.forEach((str) => {
        formData.append('removeImage', str);
      });

      const response = await axios.put(`${API_URL}/event/${event._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch(resetEvent());
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error updating event, try again!');
    } finally {
      dispatch(setEventLoading(false));
    }
  };
};

// Delete event
export const deleteEvent = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/event/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_EVENT, payload: id });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'error');
    }
  };
};

export const getUserEvent = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_URL}/event/me`);

      dispatch({
        type: FETCH_USER_EVENT,
        payload: res.data.events
      });
    } catch (error) {
      handleError(error, dispatch, 'error fetching user event');
    }
  }
}

export const fetchAllEvents = () => {
  return async(dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/event/all_event`);
      dispatch({
        type: FETCH_ALL_EVENTS,
        payload: response.data.events
      })
    } catch (error) {
      handleError(error, dispatch, 'error fetching events!!')
    }
  }
}

export const resetEventSlugChange = () => {
  return {
    type: EVENT_CHANGED,
    paylaod: false
  }
}

export const fetchEventSlug = (slug) => {
  return async(dispatch) => {
    dispatch(setEventLoading(true))
    dispatch(vewingEventToggler(true))
    try {
      const response = await axios.get(`${API_URL}/event/fetch_slug/${slug}`);
      if (response.status === 201) {
        dispatch({
          type: EVENT_CHANGED,
          payload: true
        })
      }
      dispatch({
        type: SELECT_EVENT,
        payload: response.data.event
      })
    } catch (error) {
      handleError(error, dispatch, 'error fetching events!!');
    } finally {
      dispatch(setEventLoading(false));
    }
  }
}
