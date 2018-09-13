import { createAction } from 'redux-actions';
import axios from 'axios';
import notify from '~/components/global-notification';
import safeMoment from '~/lib/safe-moment';
import { apiRoutes, appRoutes } from '~/lib/routes';

import { updateAvatar } from './requests';

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
  FILTER,
} from './constants';

export const deleteOwedHours = owedHourId => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);

  return axios
    .delete(`/api/v1/staff_members/${staffMemberId}/owed_hours/${owedHourId}`, {
      headers: {
        Authorization: `Token token="${accessToken}"`,
      },
    })
    .then(resp => {
      dispatch({
        type: DELETE_OWED_HOURS,
        payload: owedHourId,
      });
      notify('Owed Hours Deleted Successfully', {
        interval: 5000,
        status: 'success',
      });
    })
    .catch(() => {
      notify('Deleting Owed Hours Failed', {
        interval: 5000,
        status: 'error',
      });
    });
};

export const editOwedHours = ({ startsAt, endsAt, date, note, id, payslipDate }) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formatedDate = date.format('DD-MM-YYYY');
  const formatedPayslipDate = payslipDate.format('DD-MM-YYYY');

  return axios
    .put(
      `/api/v1/staff_members/${staffMemberId}/owed_hours/${id}`,
      {
        startsAt: startsAt,
        endsAt: endsAt,
        note: note,
        date: formatedDate,
        payslipDate: formatedPayslipDate,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      dispatch({
        type: EDIT_OWED_HOURS_SUCCESS,
        payload: { id, data: resp.data },
      });
      dispatch({
        type: CLOSE_EDIT_OWED_HOURS_MODAL,
      });
      notify('Staff Member Owed Hours Updated Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

export const addOwedHours = ({ startsAt, endsAt, date, note }) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const formatedDate = date ? date.format('DD-MM-YYYY') : null;

  return axios
    .post(
      `/api/v1/staff_members/${staffMemberId}/owed_hours`,
      {
        startsAt: startsAt === 0 || startsAt ? startsAt : null,
        endsAt: endsAt || null,
        note: note || null,
        date: formatedDate || null,
      },
      {
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      },
    )
    .then(resp => {
      dispatch({
        type: ADD_OWED_HOURS_SUCCESS,
        payload: resp.data,
      });
      dispatch({
        type: CLOSE_OWED_HOURS_MODAL,
      });
      notify('Staff Member Owed Hours Added Successfully', {
        interval: 5000,
        status: 'success',
      });
    });
};

export const openEditModal = owedHour => {
  return {
    type: OPEN_EDIT_OWED_HOURS_MODAL,
    payload: owedHour,
  };
};

export const closeEditModal = () => {
  return {
    type: CLOSE_EDIT_OWED_HOURS_MODAL,
  };
};

export const initialLoad = createAction(INITIAL_LOAD);
export const addNewOwedHours = createAction(ADD_NEW_OWED_HOUR);
export const cancelAddNewOwedHours = createAction(CANCEL_ADD_NEW_OWED_HOUR);
export const cancelEditOwedHours = createAction(CLOSE_EDIT_OWED_HOURS_MODAL);

export const filter = (sStartDate, sEndDate, sPayslipStartDate, sPayslipEndDate) => (dispatch, getState) => {
  const accessToken = getState().getIn(['profile', 'accessToken']);
  const staffMemberId = getState().getIn(['profile', 'staffMember', 'id']);
  const mStartDate = sStartDate && safeMoment.uiDateParse(sStartDate);
  const mEndDate = sEndDate && safeMoment.uiDateParse(sEndDate);
  const mPayslipStartDate = sPayslipStartDate && safeMoment.uiDateParse(sPayslipStartDate);
  const mPayslipEndDate = sPayslipEndDate && safeMoment.uiDateParse(sPayslipEndDate);
  const apiGetUrl = apiRoutes.staffMemberProfileOwedHoursIndex.getPath({
    staffMemberId: staffMemberId,
    mStartDate: mStartDate,
    mEndDate: mEndDate,
    mPayslipStartDate: mPayslipStartDate,
    mPayslipEndDate: mPayslipEndDate,
  });
  const webGetUrl = appRoutes.staffMemberOwedHours({
    staffMemberId: staffMemberId,
    mStartDate: mStartDate,
    mEndDate: mEndDate,
    mPayslipStartDate: mPayslipStartDate,
    mPayslipEndDate: mPayslipEndDate,
  });
  return axios
    .get(apiGetUrl, {
      headers: {
        Authorization: `Token token="${accessToken}"`,
      },
    })
    .then(resp => {
      dispatch({
        type: FILTER,
        payload: resp.data,
      });
      window.history.pushState('state', 'title', `${webGetUrl}`);
    });
};
