import { createAction } from 'redux-actions';
import axios from 'axios';

import {
  updateAvatar,
} from './requests';

import {
  UPDATE_AVATAR,
  INITIAL_LOAD,
  ADD_NEW_HOLIDAY,
  CANCEL_ADD_NEW_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  CLOSE_HOLIDAY_MODAL,
  DELETE_HOLIDAY,
  FILTER,
} from './constants';

// export const updateAvatar = createAction(UPDATE_AVATAR);

export const updateAvatarRequest = (staffMemberId, avatarUrl) => (dispatch, getState) => {
  updateAvatar({staffMemberId, avatarUrl})
    .then((resp) => {
      console.log(resp);
    })
    .catch((error) => {

    })
}

export const deleteHoliday = (holidayId) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);

  axios.delete(`/api/v1/holidays/${holidayId}`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: DELETE_HOLIDAY,
      payload: resp.data.holiday,
    });
  });
}

export const addHoliday = ({start_date, ends_date, holidays_type, note}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id'])
  
  axios.post(`/api/v1/staff_members/${staffMemberId}/holidays`, {
    start_date: start_date.format('DD-MM-YYYY'),
    end_date: ends_date.format('DD-MM-YYYY'),
    note: note,
    holiday_type: holidays_type.value
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: ADD_HOLIDAY_SUCCESS,
      payload: resp.data
    });
    dispatch({
      type: CLOSE_HOLIDAY_MODAL
    })
  });
}

export const filter = (startDate, endDate) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);

  axios.get(`/api/v1/holidays?startDate=${startDate}&endDate=${endDate}`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: FILTER,
      payload: resp.data
    })
  });
}

export const initialLoad = createAction(INITIAL_LOAD);
export const addNewHoliday = createAction(ADD_NEW_HOLIDAY);
export const cancelAddNewHoliday = createAction(CANCEL_ADD_NEW_HOLIDAY);
