import { createAction } from 'redux-actions';
import axios from 'axios';
import notify from '~/components/global-notification';

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
  OPEN_EDIT_HOLIDAY_MODAL,
  EDIT_HOLIDAY_SUCCESS,
  CLOSE_EDIT_HOLIDAY_MODAL,
  FILTER,
  UPDATE_HOLIDAYS_COUNT,
} from './constants';

export const updateAvatarRequest = (staffMemberId, avatarUrl) => (dispatch, getState) => {
  updateAvatar({staffMemberId, avatarUrl})
    .then((resp) => {

    })
    .catch((error) => {

    })
}

export const deleteHoliday = (holidayId) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  axios.delete(`/api/v1/staff_members/${staffMemberId}/holidays/${holidayId}`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: DELETE_HOLIDAY,
      payload: resp.data,
    });
    updateHolidaysCount(accessToken, staffMemberId).then(resp => {
      dispatch({
        type: UPDATE_HOLIDAYS_COUNT,
        payload: resp.data,
      });
    });
    notify('Staff Member Holiday Deleted Successfully', {
      interval: 5000,
      status: 'success'
    });
  }).catch(() => {
    notify('Deliting Staff Member Holiday was Failed', {
      interval: 5000,
      status: 'error'
    });
  });
}

export const editHoliady = ({startDate, endDate, holidayType, note, id}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id'])
  const formateStartDate = startDate.format('DD-MM-YYYY');
  const formatedEndDate = endDate.format('DD-MM-YYYY');

  return axios.put(`/api/v1/staff_members/${staffMemberId}/holidays/${id}`, {
    start_date: formateStartDate,
    end_date: formatedEndDate,
    note: note,
    holiday_type: holidayType
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: EDIT_HOLIDAY_SUCCESS,
      payload: resp.data
    });
    updateHolidaysCount(accessToken, staffMemberId).then(resp => {
      dispatch({
        type: UPDATE_HOLIDAYS_COUNT,
        payload: resp.data,
      });
    });
    dispatch({
      type: CLOSE_EDIT_HOLIDAY_MODAL
    });
    notify('Staff Member Holiday Updated Successfully', {
      interval: 5000,
      status: 'success'
    });
  });
}

export const addHoliday = ({startDate, endDate, holidayType, note}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id'])
  const formateStartDate = startDate ? startDate.format('DD-MM-YYYY') : null;
  const formatedEndDate = endDate ? endDate.format('DD-MM-YYYY') : null;
  
  return axios.post(`/api/v1/staff_members/${staffMemberId}/holidays`, {
    start_date: formateStartDate,
    end_date: formatedEndDate,
    note: note,
    holiday_type: holidayType
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: ADD_HOLIDAY_SUCCESS,
      payload: resp.data,
    });
    updateHolidaysCount(accessToken, staffMemberId).then(resp => {
      dispatch({
        type: UPDATE_HOLIDAYS_COUNT,
        payload: resp.data,
      });
    });
    dispatch({
      type: CLOSE_HOLIDAY_MODAL
    });
    notify('Staff Member Holiday Added Successfully', {
      interval: 5000,
      status: 'success'
    });
  });
}

const updateHolidaysCount = (accessToken, staffMemberId) => {
  return axios.get(`/api/v1/staff_members/${staffMemberId}/holidays/holidays_count`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  });
}

export const filter = (startDate, endDate) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  axios.get(`/api/v1/staff_members/${staffMemberId}/holidays?start_date=${startDate}&end_date=${endDate}`,
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: FILTER,
      payload: resp.data
    });
    window.history.pushState('state', 'title', `holidays?start_date=${startDate}&end_date=${endDate}`);
  });
}

export const openEditModal = (holiday) => {
  return {
    type: OPEN_EDIT_HOLIDAY_MODAL,
    payload: holiday,
  };
}

export const closeEditModal = () => {
  return {
    type: CLOSE_EDIT_HOLIDAY_MODAL,
  };
}


export const initialLoad = createAction(INITIAL_LOAD);
export const addNewHoliday = createAction(ADD_NEW_HOLIDAY);
export const cancelAddNewHoliday = createAction(CANCEL_ADD_NEW_HOLIDAY);
