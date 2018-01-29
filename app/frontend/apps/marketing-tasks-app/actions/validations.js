import constants from '../constants';
import { createAction } from 'redux-actions';
import safeMoment from "~/lib/safe-moment"
import { CREATE_DASHBOARD_MESSAGE, SET_FRONTEND_STATE } from '../constants';
import notify from '~/components/global-notification';

import {
  createGeneralTaskRequest,
  editGeneralTaskRequest,
  createMusicTaskRequest,
  editMusicTaskRequest,
  createSportsTaskRequest,
  editSportsTaskRequest,
  createArtworkTaskRequest,
  editArtworkTaskRequest,
  assignUserToTaskRequest
} from './api-calls';

export const SetFrontendState = createAction('SET_FRONTEND_STATE');
export const updateMarketingTask = createAction('UPDATE_MARKETING_TASK_RECEIVE');

function convertRichToHtmlAndCheckIfEmpty(value) {
  if (value.getEditorState().getCurrentContent().hasText()) {
    return value.toString('html');
  }
  return '';
}

export const createGeneralTask = (values) => (dispatch, getState) => {
  return createGeneralTaskRequest({ values: { ...values }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Created Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showCreateTaskModal: false,
        taskType: null
      }));
    });
}

export const editGeneralTask = (values) => (dispatch, getState) => {
  return editGeneralTaskRequest({ values: { ...values }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Edited Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showEditTaskModal: false,
        taskType: null
      }));

      dispatch(updateMarketingTask(resp));
    });
}

export const createMusicTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return createMusicTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Created Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showCreateTaskModal: false,
        taskType: null
      }));
    });
}

export const editMusicTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return editMusicTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Edited Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showEditTaskModal: false,
        taskType: null
      }));
    });
}

export const createSportsTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return createSportsTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Created Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showCreateTaskModal: false,
        taskType: null
      }));
    });
}

export const editSportsTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return editSportsTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Edited Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showEditTaskModal: false,
        taskType: null
      }));
    });
}

export const createArtworkTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return createArtworkTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Created Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showCreateTaskModal: false,
        taskType: null
      }));
    });
}

export const editArtworkTask = (values) => (dispatch, getState) => {
  let start_time = '';

  if (values.date && values.time) {
    start_time = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return editArtworkTaskRequest({ values: { ...values, start_time }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Edited Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showEditTaskModal: false,
        taskType: null
      }));
    });
}

export const assignUserToTask = (values) => (dispatch, getState) => {
  return assignUserToTaskRequest({ values: { ...values }})
    .then((resp) => {
      // window.scrollTo(0, 0);
      notify('Task Assigned Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        showAssignedToModal: false,
        taskType: null
      }));
    });
}
