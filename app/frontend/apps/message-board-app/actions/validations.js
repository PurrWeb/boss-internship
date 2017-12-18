import constants from '../constants';
import { createAction } from 'redux-actions';
import safeMoment from "~/lib/safe-moment"
import { CREATE_DASHBOARD_MESSAGE, SET_FRONTEND_STATE } from '../constants';
import notify from '~/components/global-notification';

import {
  createDashboardMessageRequest,
  updateDashboardMessageRequest,
  getDashboardMessagesRequest
} from './requests';

export const CreateDashboardMessage = createAction('CREATE_DASHBOARD_MESSAGE');
export const UpdateDashboardMessage = createAction('UPDATE_DASHBOARD_MESSAGE');
export const SetFrontendState = createAction('SET_FRONTEND_STATE');

function convertRichToHtmlAndCheckIfEmpty(value) {
  if (value.getEditorState().getCurrentContent().hasText()) {
    return value.toString('html');
  }
  return '';
}

export const createMessageBoard = (values) => (dispatch, getState) => {
  let publishDate = '';

  if (values.date && values.time) {
    publishDate = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return createDashboardMessageRequest({values: {...values, publishDate}})
    .then((resp) => {
      dispatch(getDashboardMessagesRequest({ page: 1 }));

      window.scrollTo(0, 0);
      notify('Dashboard Message Created Successfully', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        indexPage: true,
        createPage: false,
        updatePage: false,
      }));
    });
}

export const updateMessageBoard = (values) => (dispatch, getState) => {
  let publishDate = '';

  if (values.date && values.time) {
    publishDate = safeMoment.uiDateParse(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  return updateDashboardMessageRequest({values: {...values, publishDate}})
    .then((resp) => {
      dispatch(UpdateDashboardMessage(resp.data));

      window.scrollTo(0, 0);
      notify('Dashboard Message Updated', {
        interval: 5000,
        status: 'success'
      });

      dispatch(SetFrontendState({
        indexPage: true,
        createPage: false,
        updatePage: false,
      }));
    });
}
