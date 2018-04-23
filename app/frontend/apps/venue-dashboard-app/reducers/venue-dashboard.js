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
  },
  accessToken: null,
  renderWeatherWidget: false
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
    ).set(
      'accessToken', oFetch(action.initialData, 'accessToken')
    ).set(
      'renderWeatherWidget', oFetch(action.initialData, 'renderWeatherWidget')
    );

  default:
    return state;
  }
};

export default venueDashboard;
