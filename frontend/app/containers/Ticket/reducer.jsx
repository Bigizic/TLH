import {
  FETCH_TICKET,
  FETCH_TICKETS,
  TICKET_CHANGE,
  TICKET_EDIT_CHANGE,
  SET_TICKET_FORM_ERRORS,
  SET_TICKET_FORM_EDIT_ERRORS,
  RESET_TICKET_FORM,
  ADD_TICKET,
  EDIT_TICKET,
  DELETE_TICKET,
  SET_TICKETS_LOADING,
  RESET_TICKET,
  REMOVE_TICKET,
  FETCH_USER_TICKET,
} from './constants';

const initialState = {
  tickets: [],
  ticket: {},
  ticketForm: {
    type: '',
    price: '',
    quantity: '',
    discount: false,
    discountPrice: '',
    coupons: []
  },
  ticketFormErrors: {},
  editFormErrors: {},
  userTicket: [],
  isLoading: false,
};

const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_TICKET:
      return {
        ...state,
        userTicket: action.payload
      };
    case REMOVE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter(ev => ev._id !== action.payload)
      };
    case RESET_TICKET:
      return {
        ...state,
          tickets: [],
          ticketForm: {
            type: '',
            price: '',
            quantity: '',
            discount: false,
            discountPrice: '',
            coupons: []
        },
          ticketFormErrors: {},
    };
    case TICKET_EDIT_CHANGE:
      return {
        ...state,
        ticket: {...state.ticket, ...action.payload}
      }
    case SET_TICKETS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case FETCH_TICKET:
      return {
        ...state,
        ticket: action.payload,
      };
    case FETCH_TICKETS:
      return {
        ...state,
        tickets: action.payload,
      };

    case ADD_TICKET:
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
        isLoading: false,
      };

    case EDIT_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket._id === action.payload._id ? action.payload : ticket
        ),
        isLoading: false,
      };

    case DELETE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket._id !== action.payload),
        isLoading: false,
      };

    case TICKET_CHANGE:
      return {
        ...state,
        ticketForm: {
          ...state.ticketForm,
          ...action.payload,
        },
      };

    case SET_TICKET_FORM_ERRORS:
      return {
        ...state,
        ticketFormErrors: action.payload,
      };
    case SET_TICKET_FORM_EDIT_ERRORS:
      return {
        ...state,
        editFormErrors: action.payload,
      }
    case RESET_TICKET_FORM:
      return {
        ...state,
        ticketForm: initialState.ticketForm,
        ticketFormErrors: {},
      };

    default:
      return state;
  }
};

export default ticketReducer;
