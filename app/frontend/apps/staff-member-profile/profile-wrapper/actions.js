import { createAction } from 'redux-actions';

import {
  updateAvatar,
  disableStaffMember,
  enableStaffMemberRequest,
  updateEmploymentDetails,
  updatePersonalDetails,
  updateContactDetails,
  forceRetakeAvatarRequest,
} from './requests';

import {
  INITIAL_LOAD,
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,
  SHOW_DISABLE_MODAL,
  HIDE_DISABLE_MODAL,
  SHOW_EDIT_AVATAR_MODAL,
  HIDE_EDIT_AVATAR_MODAL,
  UPDATE_STAFF_MEMBER,
  UPDATE_DOWNLOAD_LINK_LAST_SENT_AT,
} from './constants';

export const forceRetakeAvatar = staffMemberId => (dispatch, getState) => {
  return forceRetakeAvatarRequest(staffMemberId).then(resp => {
    dispatch(updateStaffMember(resp.data));
  });
};

export const updateAvatarRequest = avatarUrl => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  return updateAvatar({ staffMemberId, avatarUrl }).then(resp => {
    dispatch(hideEditAvatarModal());
    dispatch(updateStaffMember(resp.data));
  });
};

export const disableStaffMemberRequest = ({ neverRehire, reason }) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return disableStaffMember({ staffMemberId, neverRehire, reason }).then(resp => {
    dispatch(hideDisableStaffMemberModal());
    dispatch(updateStaffMember(resp.data));
  });
};

export const enableStaffMember = payload => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return enableStaffMemberRequest({ ...payload, staffMemberId }).then(resp => {
    dispatch(updateStaffMember(resp.data));
  });
};

export const updateEmploymentDetailsRequest = payload => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updateEmploymentDetails({ ...payload, staffMemberId }).then(resp => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    return resp.data;
  });
};

export const updatePersonalDetailsRequest = payload => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updatePersonalDetails({ ...payload, staffMemberId }).then(resp => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    return resp.data;
  });
};

export const updateContactDetailsRequest = payload => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updateContactDetails({ ...payload, staffMemberId }).then(resp => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    return resp.data;
  });
};

export const initialProfileLoad = createAction(INITIAL_LOAD);

export const editProfile = createAction(EDIT_PROFILE);
export const cancelEditProfile = createAction(CANCEL_EDIT_PROFILE);

export const showDisableStaffMemberModal = createAction(SHOW_DISABLE_MODAL);
export const hideDisableStaffMemberModal = createAction(HIDE_DISABLE_MODAL);

export const showEditAvatarModal = createAction(SHOW_EDIT_AVATAR_MODAL);
export const hideEditAvatarModal = createAction(HIDE_EDIT_AVATAR_MODAL);
export const updateStaffMember = createAction(UPDATE_STAFF_MEMBER);
export const updateDownloadLinkLastSentAt = createAction(UPDATE_DOWNLOAD_LINK_LAST_SENT_AT);
