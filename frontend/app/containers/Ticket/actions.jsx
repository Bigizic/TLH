import axios from 'axios';
import { showNotification } from '../Notification/actions';
import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import { API_URL } from '../../constants';

import {
  TICKET_CHANGE,
  TICKET_EDIT_CHANGE,
  SET_TICKET_FORM_ERRORS,
  SET_TICKET_FORM_EDIT_ERRORS,
  RESET_TICKET_FORM,
  ADD_TICKET,
  SET_TICKETS_LOADING,
  FETCH_TICKETS,
  FETCH_TICKET,
  RESET_TICKET,
  REMOVE_TICKET,
  FETCH_USER_TICKET
} from './constants';

/**
 * Update ticket form fields
 */
export const ticketChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: TICKET_CHANGE,
    payload: formData
  };
};

export const editTicketChange = (name, value) => {
  let formData = {};
  formData[name] = value;
  return {
    type: TICKET_EDIT_CHANGE,
    payload: formData
  }
}

export const setTicketLoading = (value) => {
  return {
    type: SET_TICKETS_LOADING,
    payload: value
  };
};

export const resetTicket = () => {
  return {
    type: RESET_TICKET
  }
}


/**
 * Add a new ticket
 */
export const addTicket = (navigate) => {
  return async (dispatch, getState) => {
    dispatch(setTicketLoading(true));
    try {
      const ticketForm = getState().ticket.ticketForm;
      const rules = {
        type: 'required',
        price: 'required|numeric',
        quantity: 'required:numeric',
      };

      const { isValid, errors } = allFieldsValidation(ticketForm, rules, {
        'required.type': 'Ticket type is required.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.',
        'required.quantity': 'Enter ticket quantity',
        'numeric.quantity': 'Quantity must be a number'
      });

      if (!isValid) {
        return dispatch({ type: SET_TICKET_FORM_ERRORS, payload: errors });
      }
      const response = await axios.post(`${API_URL}/ticket`, ticketForm);

      if (response.data.success === true) {
        dispatch({ type: ADD_TICKET, payload: response.data.ticket });
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: RESET_TICKET_FORM });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error adding ticket, try agian!');
    } finally {
      dispatch(setTicketLoading(false));
    }
  };
};


export const editTicket = (navigate, id) => {
  return async (dispatch, getState) => {
    dispatch(setTicketLoading(true));
    try {
      const ticketForm = getState().ticket.ticket;

      const rules = {
        type: 'required',
        price: 'required|numeric',
        quantity: 'required:numeric',
      };

      const { isValid, errors } = allFieldsValidation(ticketForm, rules, {
        'required.type': 'Ticket type is required.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.',
        'required.quantity': 'Enter ticket quantity',
        'numeric.quantity': 'Quantity must be a number'
      });

      if (!isValid) {
        return dispatch({ type: SET_TICKET_FORM_EDIT_ERRORS, payload: errors });
      }
      let ticketForms = ticketForm;
      const response = await axios.put(`${API_URL}/ticket/${id}`, ticketForms);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: RESET_TICKET_FORM });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'Error editing ticket, try agian!');
    } finally {
      dispatch(setTicketLoading(false));
    }
  };
};


export const fetchTickets = () => {
  return async (dispatch) => {
    try {
      dispatch(setTicketLoading(true));
      const response = await axios.get(`${API_URL}/ticket`);
      dispatch({
        type: FETCH_TICKETS,
        payload: response.data.tickets
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setTicketLoading(false));
    }
  };
};

// Fetch single ticket by ID
export const fetchTicket = (id) => {
  return async (dispatch) => {
    dispatch(setTicketLoading(true));
    try {
      const response = await axios.get(`${API_URL}/ticket/${id}`);
      dispatch({
        type: FETCH_TICKET,
        payload: response.data.ticket
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setTicketLoading(false));
    }
  };
};

export const deleteTicket = (id, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${API_URL}/ticket/${id}`);

      if (response.data.success === true) {
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: REMOVE_TICKET, payload: id });
        navigate(-1);
      }
    } catch (error) {
      handleError(error, dispatch, 'error');
    }
  };
};

export const addTicketToEvent = (event, navigate) => {
  return async(dispatch, getState) => {
    dispatch(setTicketLoading(true));
    try {
      if (event) {
      let ticketForm = getState().ticket.ticketForm;

      const rules = {
        type: 'required',
        price: 'required|numeric',
        quantity: 'required:numeric',
      };

      const { isValid, errors } = allFieldsValidation(ticketForm, rules, {
        'required.type': 'Ticket type is required.',
        'required.price': 'Price is required.',
        'numeric.price': 'Price must be a number.',
        'required.quantity': 'Enter ticket quantity',
        'numeric.quantity': 'Quantity must be a number'
      });

      if (!isValid) {
        return dispatch({ type: SET_TICKET_FORM_ERRORS, payload: errors });
      }
      ticketForm['event'] = event

      const response = await axios.post(`${API_URL}/event/add-ticket`, ticketForm);

      if (response.data.success === true) {
        dispatch({ type: ADD_TICKET, payload: response.data.ticket });
        dispatch(showNotification('success', response.data.message));
        dispatch({ type: RESET_TICKET_FORM });
        navigate(-1);
      }
    }
    } catch (error) {
      handleError(error, dispatch, 'error adding ticket to event');
    } finally {
      dispatch(setTicketLoading(false));
    }
  }
}

export const getUserTicket = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_URL}/ticket/me`);

      dispatch({
        type: FETCH_USER_TICKET,
        payload: res.data.tickets
      });
    } catch (error) {
      handleError(error, dispatch, 'error fetching user event');
    }
  }
}
