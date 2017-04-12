import Immutable from 'immutable';
import constants from '../constants';

const initialState = Immutable.Map({
  questionnaire: {},
  questions: [],
  categories: [],
  questionnaireResponse: {}
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
    );
  case constants.SET_ANSWER:
    let answers = state.get('questionnaireResponse').answers;
    let existingAnswer = _.find(answers, answer => {
      return answer.questionId == action.answerParams.questionId;
    });

    if (existingAnswer) {
      let updatedAnswer = Object.assign(existingAnswer, action.answerParams);

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      answers.push(action.answerParams);
    }

    return state;
  default:
    return state;
  }
};

export default venueHealthCheck;
