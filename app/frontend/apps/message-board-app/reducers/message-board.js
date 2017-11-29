import Immutable from 'immutable';
import constants from '../constants';
import oFetch from "o-fetch";

const initialState = Immutable.Map({
  venues: [],
  messages: [],
  selectedMessage: null,
  frontend: {
    indexPage: true,
    createPage: false,
    updatePage: false,
    totalPages: 0,
    page: 0,
    totalCount: 0,
  }
});

const messageBoard = (state = initialState, action) => {
  let message, messageIndex;

  switch (action.type) {
  case constants.INITIAL_LOAD:

    return state.set(
      'venues', action.initialData.venues
    ).set(
      'messages', action.initialData.messages
    ).set(
      'frontend', Object.assign({}, state.get('frontend'), {
        page: action.initialData.pageNumber,
        totalPages: action.initialData.totalPages,
        totalCount: action.initialData.totalCount
      })
    );

  case constants.SET_FRONTEND_STATE:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), action.payload)
    );

  case constants.UPDATE_DASHBOARD_MESSAGE:
  case constants.DISABLE_DASHBOARD_MESSAGE_RECEIVE:
  case constants.RESTORE_DASHBOARD_MESSAGE_RECEIVE:
    message = state.get('messages').find((m) => { return m.id == action.payload.id });
    messageIndex = state.get('messages').indexOf(message);
    state.get('messages')[messageIndex] = action.payload;

    return state.set(
      'messages', state.get('messages')
    );

  case constants.SET_SELECTED_MESSAGE:
    return state.set(
      'selectedMessage', action.payload
    );

  case constants.GET_DASHBOARD_MESSAGE_RECEIVE:
    return state.set(
      'filter', Object.assign({}, state.get('filter'), { page: action.payload.pageNumber, totalCount: action.payload.totalCount, totalPages: action.payload.totalPages })
    ).set(
      'messages', action.payload.dashboardMessages
    );

  default:
    return state;
  }
};

export default messageBoard;
