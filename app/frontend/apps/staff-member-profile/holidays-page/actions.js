import { createAction } from 'redux-actions';
import axios from 'axios';
import oFetch from 'o-fetch';
import notify from '~/components/global-notification';
import { apiRoutes } from '~/lib/routes';
import safeMoment from "~/lib/safe-moment";

import { updateAvatar } from './requests';

import {
  UPDATE_AVATAR,
  INITIAL_LOAD,
  ADD_NEW_HOLIDAY,
  CANCEL_ADD_NEW_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  ADD_HOLIDAY_REQUEST_SUCCESS,
  CLOSE_HOLIDAY_MODAL,
  DELETE_HOLIDAY,
  OPEN_EDIT_HOLIDAY_MODAL,
  EDIT_HOLIDAY_SUCCESS,
  CLOSE_EDIT_HOLIDAY_MODAL,
  FILTER,
  UPDATE_HOLIDAYS_COUNT,
  DELETE_HOLIDAY_REQUEST,
  EDIT_HOLIDAY_REQUEST_SUCCESS,
  ADD_NEW_HOLIDAY_PERMISSION,
  ADD_NEW_HOLIDAY_REQUEST_PERMISSION,
} from './constants';

export const updateAvatarRequest = (staffMemberId, avatarUrl) => (
  dispatch,
  getState,
) => {
  updateAvatar({ staffMemberId, avatarUrl })
    .then(resp => {})
    .catch(error => {});
};

export const deleteHoliday = holidayId => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  axios
    .delete(`/api/v1/staff_members/${staffMemberId}/holidays/${holidayId}`, {
      headers: {
        Authorization: `Token token="${accessToken}"`,
      },
    })
    .then(resp => {
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
      notify('Holiday Deleted Successfully', {
        interval: 5000,
        status: 'success',
      });
    })
    .catch(() => {
      notify('Deleting Holiday Failed', {
        interval: 5000,
        status: 'error',
      });
    });
};

export const deleteHolidayRequest = holidayId => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  axios
    .delete(`/api/v1/holiday-requests/${holidayId}`, {
      params: {
        staff_member_id: staffMemberId,
      },
      headers: {
        Authorization: `Token token="${accessToken}"`,
      },
    })
    .then(resp => {
      dispatch({
        type: DELETE_HOLIDAY_REQUEST,
        payload: resp.data,
      });
      notify('Holiday Request Deleted Successfully', {
        interval: 5000,
        status: 'success',
      });
    })
    .catch(() => {
      notify('Deleting Holiday Request Failed', {
        interval: 5000,
        status: 'error',
      });
    });
};

export const editHoliady = ({ startDate, endDate, holidayType, note, id, payslipDate }) => (
  dispatch,
  getState,
) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formateStartDate = startDate.format('DD-MM-YYYY');
  const formatedEndDate = endDate.format('DD-MM-YYYY');
  const formatedPayslipDate = payslipDate.format('DD-MM-YYYY');

  return axios
    .put(
      `/api/v1/staff_members/${staffMemberId}/holidays/${id}`,
      {
        start_date: formateStartDate,
        end_date: formatedEndDate,
        note: note,
        holiday_type: holidayType,
        payslip_date: formatedPayslipDate,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      dispatch({
        type: EDIT_HOLIDAY_SUCCESS,
        payload: resp.data,
      });
      updateHolidaysCount(accessToken, staffMemberId).then(resp => {
        dispatch({
          type: UPDATE_HOLIDAYS_COUNT,
          payload: resp.data,
        });
      });
      dispatch({
        type: CLOSE_EDIT_HOLIDAY_MODAL,
      });
      notify('Holiday Updated Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

export const editHolidayRequest = ({
  startDate,
  endDate,
  holidayType,
  note,
  id,
}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formateStartDate = startDate.format('DD-MM-YYYY');
  const formatedEndDate = endDate.format('DD-MM-YYYY');

  return axios
    .put(
      `/api/v1/holiday-requests/${id}`,
      {
        start_date: formateStartDate,
        end_date: formatedEndDate,
        note: note,
        holiday_type: holidayType,
        staff_member_id: staffMemberId,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      dispatch({
        type: EDIT_HOLIDAY_REQUEST_SUCCESS,
        payload: resp.data,
      });
      dispatch({
        type: CLOSE_EDIT_HOLIDAY_MODAL,
      });
      notify('Holiday request Updated Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

export const addHoliday = ({ startDate, endDate, holidayType, note }) => (
  dispatch,
  getState,
) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formateStartDate = startDate ? startDate.format('DD-MM-YYYY') : null;
  const formatedEndDate = endDate ? endDate.format('DD-MM-YYYY') : null;

  return axios
    .post(
      `/api/v1/staff_members/${staffMemberId}/holidays`,
      {
        start_date: formateStartDate,
        end_date: formatedEndDate,
        note: note,
        holiday_type: holidayType,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      const newHoliday = oFetch(resp, 'data.holiday');
      const newPermissions = oFetch(resp, 'data.permissions');
      const newHolidayId = oFetch(newHoliday, 'id');

      dispatch({
        type: ADD_HOLIDAY_SUCCESS,
        payload: {newHoliday, newPermissions},
      });
      updateHolidaysCount(accessToken, staffMemberId).then(resp => {
        dispatch({
          type: UPDATE_HOLIDAYS_COUNT,
          payload: newHoliday,
        });
      });
      dispatch({
        type: CLOSE_HOLIDAY_MODAL,
      });
      notify('Holiday Added Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

export const addHolidayRequest = ({
  startDate,
  endDate,
  holidayType,
  note,
}) => (dispatch, getState) => {
  const accessToken = getState().getIn(['holidays', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formateStartDate = startDate ? startDate.format('DD-MM-YYYY') : null;
  const formatedEndDate = endDate ? endDate.format('DD-MM-YYYY') : null;

  return axios
    .post(
      `/api/v1/holiday-requests`,
      {
        start_date: formateStartDate,
        end_date: formatedEndDate,
        note: note,
        holiday_type: holidayType,
        staff_member_id: staffMemberId,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      const newHolidayRequest = oFetch(resp, 'data.holiday_request');
      const newPermissions = oFetch(resp, 'data.permissions');

      dispatch({
        type: ADD_HOLIDAY_REQUEST_SUCCESS,
        payload: {newHolidayRequest, newPermissions},
      });
      dispatch({
        type: CLOSE_HOLIDAY_MODAL,
      });
      notify('Holiday Request Added Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

const updateHolidaysCount = (accessToken, staffMemberId) => {
  return axios.get(
    `/api/v1/staff_members/${staffMemberId}/holidays/holidays_count`,
    {
      headers: {
        Authorization: `Token token="${accessToken}"`,
      },
    },
  );
};

export const filter = (sStartDate, sEndDate, sStartPayslipDate, sEndPayslipDate) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const mStartDate = sStartDate && safeMoment.uiDateParse(sStartDate);
  const mEndDate = sEndDate && safeMoment.uiDateParse(sEndDate);
  const mPayslipStartDate = sStartDate && safeMoment.uiDateParse(sStartDate);
  const mPayslipEndDate = sEndDate && safeMoment.uiDateParse(sEndDate);
  const getUrl = apiRoutes.staffMemberProfileHolidaysIndex.getPath({
    staffMemberId: staffMemberId,
    mStartDate: mStartDate,
    mEndDate: mEndDate,
    mPayslipStartDate: mPayslipStartDate,
    mPayslipEndDate: mPayslipEndDate
  })
  return axios
    .get(
      getUrl,
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      dispatch({
        type: FILTER,
        payload: resp.data,
      });
      window.history.pushState(
        'state',
        'title',
        `${getUrl}`,
      );
    });
};

export const openEditModal = holiday => {
  return {
    type: OPEN_EDIT_HOLIDAY_MODAL,
    payload: holiday,
  };
};

export const closeEditModal = () => {
  return {
    type: CLOSE_EDIT_HOLIDAY_MODAL,
  };
};

export const initialLoad = createAction(INITIAL_LOAD);
export const addNewHoliday = createAction(ADD_NEW_HOLIDAY);
export const cancelAddNewHoliday = createAction(CANCEL_ADD_NEW_HOLIDAY);
