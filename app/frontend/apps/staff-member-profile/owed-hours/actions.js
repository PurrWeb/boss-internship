import { createAction } from 'redux-actions';
import axios from 'axios';

import {
  updateAvatar,
} from './requests';

import {
  INITIAL_LOAD,
  ADD_NEW_OWED_HOUR,
  CANCEL_ADD_NEW_OWED_HOUR,
  ADD_OWED_HOURS_SUCCESS,
  CLOSE_OWED_HOURS_MODAL,
  DELETE_OWED_HOURS,
  OPEN_EDIT_OWED_HOURS_MODAL,
  EDIT_OWED_HOURS_SUCCESS,
  CLOSE_EDIT_OWED_HOURS_MODAL,
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

export const deleteOwedHours = (owedHourId) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  axios.delete(`/api/v1/staff_members/${staffMemberId}/owed_hours/${owedHourId}`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    console.log(resp.data);
    dispatch({
      type: DELETE_OWED_HOURS,
      payload: resp.data,
    });
  });
}

export const editOwedHours = ({start_date, ends_date, holidays_type, note, id}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id'])
  const formateStartDate = start_date.format('DD-MM-YYYY');
  const formatedEndDate = ends_date.format('DD-MM-YYYY');
  
  return axios.put(`/api/v1/staff_members/${staffMemberId}/holidays/${id}`, {
    start_date: formateStartDate,
    end_date: formatedEndDate,
    note: note,
    holiday_type: holidays_type.value
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: EDIT_OWED_HOURS_SUCCESS,
      payload: resp.data
    });
    dispatch({
      type: CLOSE_EDIT_OWED_HOURS_MODAL
    })
  });
}

export const addOwedHours = ({start_time, end_time, date, note}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formatedDate = date.format('DD-MM-YYYY')
  
  return axios.post(`/api/v1/staff_members/${staffMemberId}/owed_hours`, {
    startsAt: start_time,
    endsAt: end_time,
    note: note,
    date: formatedDate
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: ADD_OWED_HOURS_SUCCESS,
      payload: resp.data
    });
    dispatch({
      type: CLOSE_OWED_HOURS_MODAL
    })
  });
}

export const openEditModal = (owedHour) => {
  return {
    type: OPEN_EDIT_OWED_HOURS_MODAL,
    payload: owedHour,
  };
}

export const closeEditModal = () => {
  return {
    type: CLOSE_EDIT_OWED_HOURS_MODAL,
  };
}


export const initialLoad = createAction(INITIAL_LOAD);
export const addNewOwedHours = createAction(ADD_NEW_OWED_HOUR);
export const cancelAddNewOwedHours = createAction(CANCEL_ADD_NEW_OWED_HOUR);
