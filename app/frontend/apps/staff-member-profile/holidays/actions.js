import { createAction } from 'redux-actions';

import {
  updateAvatar,
} from './requests';

import {
  UPDATE_AVATAR,
  INITIAL_LOAD,
  ADD_NEW_HOLIDAY,
  CANCEL_ADD_NEW_HOLIDAY,
} from './constants';

// export const updateAvatar = createAction(UPDATE_AVATAR);

export const updateAvatarRequest = (staffMemberId, avatarUrl) => (dispatch, getState) => {
  updateAvatar({staffMemberId, avatarUrl})
    .then((resp) => {
    })
    .catch((error) => {
    })
}

export const initialLoad = createAction(INITIAL_LOAD);
export const addNewHoliday = createAction(ADD_NEW_HOLIDAY);
export const cancelAddNewHoliday = createAction(CANCEL_ADD_NEW_HOLIDAY);
