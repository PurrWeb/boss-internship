import Immutable from 'immutable';
import constants from '../constants';
import oFetch from "o-fetch";

const initialState = Immutable.Map({
  venues: [],
  messages: [],
  currentUser: null,
  currentVenue: null,
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false,
    errorMessage: '',
    successMessage: '',
  }
});

const venueDashboard = (state = initialState, action) => {
  switch (action.type) {
  case constants.INITIAL_LOAD:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { loading: true })
    ).set(
      'venues', action.initialData.venues
    ).set(
      'messages', action.initialData.messages
    ).set(
      'currentUser', action.initialData.currentUser
    ).set(
      'currentVenue', action.initialData.currentVenue
    );

  default:
    return state;
  }
};

export default venueDashboard;
