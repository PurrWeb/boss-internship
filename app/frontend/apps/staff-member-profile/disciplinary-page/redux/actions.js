import { createAction } from 'redux-actions';
import * as types from './types';
import * as requests from '../requests';
import * as constants from '../constants';

export const loadDisciplinariesSuceed = createAction(types.LOAD_DISCIPLINARIES_SUCCEED);
export const addDisciplinarySucceed = createAction(types.ADD_DISCIPLINARY_SUCCEED);
export const disableDisciplinarySucceed = createAction(types.DISABLE_DISCIPLINARY_SUCCEED);

export const addDisciplinary = params => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  return requests.addDisciplinaryRequest({ ...params, staffMemberId }).then(resp => {
    dispatch(addDisciplinarySucceed(resp.data));
  });
};

export const disableDisciplinary = ({ disciplinaryId }) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const show = getState().getIn(['filter', 'show']);
  const isShowDisabled = show.includes(constants.DISABLED);
  return requests.disableDisciplinaryRequest({ staffMemberId, disciplinaryId }).then(resp => {
    dispatch(disableDisciplinarySucceed({ ...resp.data, isShowDisabled }));
  });
};

export const loadDisciplinaries = ({ queryString }) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  return requests.loadDisciplinariesRequest({ queryString, staffMemberId }).then(resp => {
    dispatch(loadDisciplinariesSuceed(resp.data));
    return resp;
  });
};
