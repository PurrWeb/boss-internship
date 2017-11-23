import { createAction } from 'redux-actions';
import notify from '~/components/global-notification';

import {
  sendPasswordSetupEmailRequest,
  resendPasswordSetupEmailRequest,
  revokePasswordSetupEmailRequest
} from './requests';

export const sendPasswordSetupEmail = (staffMember) => (dispatch, getState) => {
  return sendPasswordSetupEmailRequest(staffMember)
    .then(resp => {
      dispatch(updateStaffMember(resp.data));
      return resp;
    })
}

export const resendPasswordSetupEmail = (staffMember) => (dispatch, getState) => {
  return resendPasswordSetupEmailRequest(staffMember)
    .then(resp => {
      dispatch(updateStaffMember(resp.data));
      return resp;
    })
}

export const revokePasswordSetupEmail = (staffMember) => (dispatch, getState) => {
  return revokePasswordSetupEmailRequest(staffMember)
    .then(resp => {
      dispatch(updateStaffMember(resp.data));
      return resp;
    })
}
