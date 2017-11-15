import constants from '../constants';
import { createAction } from 'redux-actions';

export const SetFrontendState = createAction('SET_FRONTEND_STATE');
export const SetSelectedMessage = createAction('SET_SELECTED_MESSAGE');

export const setFrontendState = (values) => (dispatch, getState) => {
  return dispatch(SetFrontendState(values));
}

export const setSelectedMessage = (values) => (dispatch, getState) => {
  return dispatch(SetSelectedMessage(values));
}