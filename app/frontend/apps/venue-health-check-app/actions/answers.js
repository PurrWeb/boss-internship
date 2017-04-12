import constants from '../constants';

export function setAnswer(answerParams) {
  return {
    type: constants.SET_ANSWER,
    answerParams
  };
}
