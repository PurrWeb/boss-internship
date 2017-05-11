import Immutable from 'immutable';
import constants from '../constants';

const initialState = Immutable.Map({
  questionnaire: {},
  questions: [],
  areas: [],
  categories: [],
  venues: [],
  questionnaireResponse: {
    questionnaireId: null,
  },
  answers: [],
  uploads: [],
  questionCount: 0,
  answerCount: 0,
  uploadCount: 0,
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false
  }
});

const venueHealthCheck = (state = initialState, action) => {
  let answers;
  let existingAnswer;
  let updatedAnswer;

  switch (action.type) {
  case constants.INITIAL_LOAD:
    return state.set(
      'questionnaire', action.initialData.questionnaire
    ).set(
      'questions', action.initialData.questions
    ).set(
      'categories', action.initialData.categories
    ).set(
      'areas', action.initialData.areas
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
    let completedAnswers;

    answers = state.get('answers');
    existingAnswer = _.find(answers, answer => {
      return answer.questionnaireQuestionId == action.answerParams.questionnaireQuestionId;
    });

    if (existingAnswer) {
      updatedAnswer = Object.assign(existingAnswer, action.answerParams);

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      answers.push(action.answerParams);
    }

    completedAnswers = _.filter(answers, answer => {
      return !!answer.value;
    });

    return state.set('answers', answers).set('answerCount', completedAnswers.length);

  case constants.SET_UPLOAD:
    let uploads = state.get('uploads');
    answers = state.get('answers');

    uploads.push(action.uploadParams);

    existingAnswer = _.find(answers, answer => {
      return answer.questionnaireQuestionId == action.uploadParams.questionnaireQuestionId;
    });

    if (existingAnswer) {
      let imageIds = existingAnswer.image_ids || [];

      imageIds.push(action.uploadParams.id);

      updatedAnswer = Object.assign(existingAnswer, {
        image_ids: imageIds
      });

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      answers.push({
        questionnaireQuestionId: action.uploadParams.questionnaireQuestionId,
        image_ids: [action.uploadParams.id]
      });
    }

    return state.set('uploads', uploads).set('answers', answers).set('uploadCount', uploads.length);

  case constants.REMOVE_UPLOAD:
    let upload = action.upload;
    uploads = state.get('uploads');
    answers = state.get('answers');
    existingAnswer = _.find(answers, answer => {
      return answer.questionnaireQuestionId == upload.questionnaireQuestionId;
    });

    _.remove(existingAnswer.image_ids, function(image_id) {
      return upload.id == image_id;
    });

    _.remove(uploads, function(u) {
      return u.id == upload.id;
    });

    return state.set('answers', answers).set('uploads', uploads).set('uploadCount', uploads.length);

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
