import { createAction } from 'redux-actions';
import notify from '~/components/global-notification';

import {
  updateAvatar,
  disableStaffMember,
  enableStaffMember,
  updateEmploymentDetails,
  updatePersonalDetails,
  updateContactDetails
} from './requests';

import {
  UPDATE_AVATAR,
  INITIAL_LOAD,
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,
  ENABLE_PROFILE,
  CANCEL_ENABLE_PROFILE,
  SHOW_DISABLE_MODAL,
  HIDE_DISABLE_MODAL,
  SHOW_EDIT_AVATAR_MODAL,
  HIDE_EDIT_AVATAR_MODAL,
  UPDATE_STAFF_MEMBER,
  UPDATE_DOWNLOAD_LINK_LAST_SENT_AT
} from './constants';

export const updateAvatarRequest = (avatarUrl) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  return updateAvatar({staffMemberId, avatarUrl})
    .then((resp) => {
      dispatch(hideEditAvatarModal());
      dispatch(updateStaffMember(resp.data));
      notify('Avatar Updated Successfully', {
        interval: 5000,
        status: 'success'
      });
      window.scrollTo(0, 0);
    }).catch(() => {
      notify('Updating Avatar Failed', {
        interval: 5000,
        status: 'error'
      });
    });
}

export const disableStaffMemberRequest = ({neverRehire, reason}) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return disableStaffMember({staffMemberId, neverRehire, reason}).then((resp) => {
    dispatch(hideDisableStaffMemberModal());
    dispatch(updateStaffMember(resp.data));
    window.scrollTo(0, 0);
    notify('Staff Member Disabled Successfully', {
      interval: 5000,
      status: 'success'
    });
  }).catch(() => {
    notify('Disabling Staff Member Failed', {
      interval: 5000,
      status: 'error'
    });
  });
}

export const enableStaffMemberRequest = (payload) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return enableStaffMember({...payload, staffMemberId}).then((resp) => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEnableProfile());
    window.scrollTo(0, 0);
    notify('Staff Member Enabled Successfully', {
      interval: 5000,
      status: 'success'
    });
  });
}

export const updateEmploymentDetailsRequest = (payload) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updateEmploymentDetails({...payload, staffMemberId}).then((resp) => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    window.scrollTo(0, 0);
    notify('Staff Member Employment Details Updated Successfully', {
      interval: 5000,
      status: 'success'
    });
    return resp.data;
  });
}

export const updatePersonalDetailsRequest = (payload) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updatePersonalDetails({...payload, staffMemberId}).then((resp) => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    window.scrollTo(0, 0);
    notify('Staff Member Personal Details Updated Successfully', {
      interval: 5000,
      status: 'success'
    });
    return (resp.data);
  });
}

export const updateContactDetailsRequest = (payload) => (dispatch, getState) => {
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  return updateContactDetails({...payload, staffMemberId}).then((resp) => {
    dispatch(updateStaffMember(resp.data));
    dispatch(cancelEditProfile());
    window.scrollTo(0, 0);
    notify('Staff Member Contact Details Updated Successfully', {
      interval: 5000,
      status: 'success'
    });
    return resp.data;
  });
}

export const initialProfileLoad = createAction(INITIAL_LOAD);

export const editProfile = createAction(EDIT_PROFILE);
export const cancelEditProfile = createAction(CANCEL_EDIT_PROFILE);

export const enableProfile = createAction(ENABLE_PROFILE);
export const cancelEnableProfile = createAction(CANCEL_ENABLE_PROFILE);

export const showDisableStaffMemberModal = createAction(SHOW_DISABLE_MODAL);
export const hideDisableStaffMemberModal = createAction(HIDE_DISABLE_MODAL);

export const showEditAvatarModal = createAction(SHOW_EDIT_AVATAR_MODAL);
export const hideEditAvatarModal = createAction(HIDE_EDIT_AVATAR_MODAL);
export const updateStaffMember = createAction(UPDATE_STAFF_MEMBER);
export const updateDownloadLinkLastSentAt = createAction(UPDATE_DOWNLOAD_LINK_LAST_SENT_AT);
