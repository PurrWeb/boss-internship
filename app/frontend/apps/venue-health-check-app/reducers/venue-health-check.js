import Immutable from 'immutable';
import constants from '../constants';

const initialState = Immutable.Map({
  questionnaire: {},
  questions: [],
  categories: []
});

const venueHealthCheck = (state = initialState, action) => {
  switch (action.type) {
  case constants.INITIAL_LOAD:
    return state.set(
      'questionnaire', action.initialData.questionnaire
    ).set(
      'questions', action.initialData.questions
    ).set(
      'categories', action.initialData.categories
    )
  default:
    return state;
  }
};

export default venueHealthCheck;
