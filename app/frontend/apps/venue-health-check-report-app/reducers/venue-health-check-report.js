import Immutable from 'immutable';
import constants from '../constants';

const initialState = Immutable.Map({
  questions: [],
  categories: [],
  venues: [],
  answers: [],
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false
  }
});

const venueHealthCheckReport = (state = initialState, action) => {
  switch (action.type) {
  case constants.INITIAL_LOAD:
    return state.set(
      'questions', action.initialData.questions
    ).set(
      'response', action.initialData.response
    ).set(
      'answers', action.initialData.answers
    ).set(
      'user', action.initialData.user
    ).set(
      'categories', action.initialData.categories
    ).set(
      'venues', action.initialData.venues
    ).set(
      'scores', action.initialData.scores
    ).set(
      'currentVenue', action.initialData.currentVenue
    ).set(
      'frontend', Object.assign({}, state.get('frontend'), { loading: true })
    );

  default:
    return state;
  }
};

export default venueHealthCheckReport;
