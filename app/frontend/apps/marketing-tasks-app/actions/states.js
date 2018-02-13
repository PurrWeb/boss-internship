import constants from '../constants';

export function setFrontendState(payload) {
  return {
    type: constants.SET_FRONTEND_STATE,
    payload
  };
}

export function setSelectedMarketingTask(marketingTask) {
  return {
    type: constants.SET_MARKETING_TASK,
    marketingTask
  };
}

export function updateMarketingTask(data) {
  debugger
  return {
    type: constants.UPDATE_MARKETING_TASK_RECEIVE,
    data
  }
}
