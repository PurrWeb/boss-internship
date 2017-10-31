import Immutable from 'immutable';
import constants from '../constants';
import oFetch from "o-fetch";

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
  wrongFiles: [],
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
  let id;
  let wrongFiles;
  
  switch (action.type) {
  case constants.INITIAL_LOAD:
    let questions = action.initialData.questions.slice(0, 5);

    return state.set(
      'questionnaire', action.initialData.questionnaire
    ).set(
      'questions', questions
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
      'questionCount', questions.length
    ).set(
      'frontend', Object.assign({}, state.get('frontend'), { loading: true })
    );
  case constants.SET_ANSWER:
    let completedAnswers;

    let questionCount = state.get("questions").length;
    answers = state.get('answers');
    existingAnswer = _.find(answers, answer => {
      return answer.questionnaireQuestionId == action.answerParams.questionnaireQuestionId;
    });

    let previousCompletedAnswerCount = _.filter(answers, answer => {
      return !!answer.value;
    }).length;

    if (existingAnswer) {
      updatedAnswer = Object.assign(existingAnswer, action.answerParams);

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      answers.push(action.answerParams);
    }

    completedAnswers = _.filter(answers, answer => {
      return !!answer.value;
    });

    let completedAnswersCount = completedAnswers.length;
    if(
      (completedAnswersCount > previousCompletedAnswerCount) &&
      (completedAnswersCount >= questionCount)
    ){
      window.scrollTo(0, 0);
    }

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

      if (action.uploadParams.id) {
        imageIds.push(action.uploadParams.id);
      }

      updatedAnswer = Object.assign(existingAnswer, {
        image_ids: imageIds
      });

      answers[answers.indexOf(existingAnswer)] = updatedAnswer;
    } else {
      if (action.uploadParams.id) {
        answers.push({
          questionnaireQuestionId: action.uploadParams.questionnaireQuestionId,
          image_ids: [action.uploadParams.id]
        });
      } else {
        answers.push({
          questionnaireQuestionId: action.uploadParams.questionnaireQuestionId,
          image_ids: []
        });
      }
    }

    let wrongFiles = state.get('wrongFiles');
    if (action.uploadParams.id === undefined) {
      if (!wrongFiles.includes(action.uploadParams.questionnaireQuestionId)) {
        wrongFiles = wrongFiles.concat([action.uploadParams.questionnaireQuestionId]);
      }
    }

    return state
      .set('uploads', uploads)
      .set('answers', answers)
      .set('uploadCount', uploads.length)
      .set('wrongFiles', wrongFiles)


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
      return (u.id === upload.id && u.id !== undefined) || (upload.uuid !== undefined && u.uuid === upload.uuid);
    });

    wrongFiles = state.get('wrongFiles');

    wrongFiles = wrongFiles.reduce((sum, current) => {
      let wrongUploads = state.get('uploads').filter(item => item.questionnaireQuestionId === upload.questionnaireQuestionId && item.id === undefined);
      if (current !== upload.questionnaireQuestionId) {
        return sum.concat([current]);
      }
      if (wrongUploads.length !== 0) {
        return sum.concat([current] );
      }
      return sum;
    }, []);

    return state
      .set('answers', answers)
      .set('uploads', uploads)
      .set('uploadCount', uploads.length)
      .set('wrongFiles', wrongFiles)

  case constants.SAVE_ANSWERS_REQUEST:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { saving: true })
    );
  case constants.SAVE_ANSWERS_RECEIVE:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { saving: false, saved: true })
    ).set(
      'savedResponseId', oFetch(action.payload, "questionnaire_response_id")
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
