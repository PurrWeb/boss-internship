import Immutable from 'immutable';
import constants from '../constants';

const initialState = Immutable.Map({
  questionnaire: {},
  questions: [],
  categories: [],
  venues: [],
  questionnaireResponse: {
    questionnaireId: null,
  },
  answers: [],
  questionCount: 0,
  answerCount: 0,
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false
  }
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
    ).set(
      'questionnaireResponse', {
        questionnaireId: action.initialData.questionnaire.id,
        answers: []
      }
    ).set(
      'venues', action.initialData.venues
    ).set(
      'currentVenue', action.initialData.currentVenue
    ).set(
      'questionCount', action.initialData.questions.length
    ).set(
      'frontend', Object.assign({}, state.get('frontend'), { loading: true })
    );
  case constants.SET_ANSWER:
    let answers = state.get('answers');
    let existingAnswer = _.find(answers, answer => {
      return answer.questionId == action.answerParams.questionId;
    });

    if (existingAnswer) {
      let updatedAnswer = Object.assign(existingAnswer, action.answerParams);

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      answers.push(action.answerParams);
    }

    return state.set('answers', answers).set('answerCount', answers.length);

  case constants.SAVE_ANSWERS_REQUEST:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { saving: true })
    );
  case constants.SAVE_ANSWERS_RECEIVE:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { saving: false, saved: true })
    );
  case constants.SAVE_ANSWERS_FAILURE:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { saving: false, failed: true })
    );
  default:
    return state;
  }
};

export default venueHealthCheck;
