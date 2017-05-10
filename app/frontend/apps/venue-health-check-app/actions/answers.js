import constants from '../constants';
import { CALL_API } from 'redux-api-middleware';
import humps from 'humps';

export function setAnswer(answerParams) {
  return {
    type: constants.SET_ANSWER,
    answerParams
  };
}

export function setUpload(uploadParams) {
  return {
    type: constants.SET_UPLOAD,
    uploadParams
  };
}

export function saveAnswers(questionnaireId, answers) {
  let token = window.boss.venueHealthCheck.accessToken;
  let params = {
    response: {
      questionnaire_id: questionnaireId,
      questionnaire_answers_attributes: humps.decamelizeKeys(answers)
    }
  }

  return {
    [CALL_API]: {
      endpoint: `/api/v1/questionnaires/${questionnaireId}/questionnaire_responses`,
      method: 'POST',
      types: [
        constants.SAVE_ANSWERS_REQUEST,
        constants.SAVE_ANSWERS_RECEIVE,
        constants.SAVE_ANSWERS_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(params)
    }
  }
}
