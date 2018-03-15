import { createAction } from 'redux-actions';
import notify from '~/components/global-notification';
import oFetch from 'o-fetch'

import {
  sendMobileAppDownloadEmailRequest,
  sendPasswordSetupEmailRequest,
  resendPasswordSetupEmailRequest,
  revokePasswordSetupEmailRequest
} from './requests';

import {
  updateStaffMember,
  updateDownloadLinkLastSentAt,
} from '../profile-wrapper/actions';

export const sendMobileAppDownloadEmail = (endpointUrl, appName, mobileAppId) => (dispatch, getState) => {
  return sendMobileAppDownloadEmailRequest(endpointUrl, appName, mobileAppId)
    .then((resp) => {
      const sentAt = oFetch(resp.data, 'sentAt');
      dispatch(updateDownloadLinkLastSentAt({
        mobileAppId: mobileAppId,
        sentAt: sentAt}))
      return resp;
    })
}

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
