import constants from '../constants';
import { RSAA } from 'redux-api-middleware';
import humps from 'humps';
import confirm from '~/lib/confirm-utils';

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

export const checkAnswer = (answer) => (dispatch, getState) => {
  const uploads = getState().venueHealthCheck.get('uploads');
  const wrongFiles = getState().venueHealthCheck.get('wrongFiles');

  const hasInvalidUploads = uploads.filter(upload => {
    return upload.questionnaireQuestionId === answer.questionnaireQuestionId && upload.id === undefined;
  }).length > 0;
  if (hasInvalidUploads) {
    confirm('You have invalid files, please delete them', {
      title: 'WARNING',
      actionButtonText: 'Ok',
    });
    return false;
  } else {
    dispatch(setAnswer({...answer}));
    return true;
  }
}

export function deleteUpload(upload) {
  return {
    type: constants.REMOVE_UPLOAD,
    upload
  };
}

export function saveAnswers(questionnaireId, answers, venueId) {
  let token = window.boss.venueHealthCheck.accessToken;
  let params = {
    response: {
      venue_id: venueId,
      questionnaire_id: questionnaireId,
      questionnaire_answers_attributes: humps.decamelizeKeys(answers)
    }
  }
  return {
    [RSAA]: {
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
