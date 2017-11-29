import axios from 'axios';
import { apiRoutes } from '~/lib/routes'
import { CALL_API } from 'redux-api-middleware';
import constants from '../constants'

const http = axios.create();

function venueIds(venues) {
  if (!venues) return;

  return venues.map((v) => { return parseInt(v.value) });
}

export function getDashboardMessagesRequest(params) {
  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.dashboardMessages.getPath() + '?' + $.param(params)}`,
      method: apiRoutes.dashboardMessages.method,
      types: [
        constants.GET_DASHBOARD_MESSAGE_REQUEST,
        constants.GET_DASHBOARD_MESSAGE_RECEIVE,
        constants.GET_DASHBOARD_MESSAGE_FAILURE,
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.messageBoard.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function disableDasboardMessageRequest(dashboardMessage) {
  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.disableDashboardMessages.getPath(dashboardMessage.id) }`,
      method: apiRoutes.disableDashboardMessages.method,
      types: [
        constants.DISABLE_DASHBOARD_MESSAGE_REQUEST,
        constants.DISABLE_DASHBOARD_MESSAGE_RECEIVE,
        constants.DISABLE_DASHBOARD_MESSAGE_FAILURE,
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.messageBoard.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function restoreDasboardMessageRequest(dashboardMessage) {
  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.restoreDashboardMessages.getPath(dashboardMessage.id)}`,
      method: apiRoutes.restoreDashboardMessages.method,
      types: [
        constants.RESTORE_DASHBOARD_MESSAGE_REQUEST,
        constants.RESTORE_DASHBOARD_MESSAGE_RECEIVE,
        constants.RESTORE_DASHBOARD_MESSAGE_FAILURE,
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.messageBoard.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export const createDashboardMessageRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.messageBoard.accessToken}"`;

  const { values } = requestData;

  return http.post(`/api/v1/dashboard_messages`, {
    to_all_venues: values.toAllVenues,
    title: values.title,
    message: values.message,
    published_time: values.publishDate,
    venue_ids: venueIds(values.venueIds),
  });
}

export const updateDashboardMessageRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.messageBoard.accessToken}"`;

  const { values } = requestData;

  return http.put(`/api/v1/dashboard_messages/${values.id}`, {
    to_all_venues: values.toAllVenues,
    title: values.title,
    message: values.message,
    published_time: values.publishDate,
    venue_ids: venueIds(values.venueIds),
  });
}
