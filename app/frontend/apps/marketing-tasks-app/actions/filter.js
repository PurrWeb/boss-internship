import axios from 'axios';
import { apiRoutes } from '~/lib/routes'
import { CALL_API } from 'redux-api-middleware';
import constants from '../constants'

export function setFilterParams(filterParams) {
  return {
    type: constants.SET_FILTER_PARAMS,
    filterParams
  };
}

export function queryPaginatedMarketingTasks(params) {
  let filterParams = getFilterParams(params);

  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.marketingTasks.getPath() + '?' + $.param(filterParams)}`,
      method: apiRoutes.marketingTasks.method,
      types: [
        constants.GET_PAGINATED_MARKETING_REQUEST,
        constants.GET_PAGINATED_MARKETING_RECEIVE,
        constants.GET_PAGINATED_MARKETING_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function queryFilteredMarketingTasks(params) {
  let filterParams = getFilterParams(params);

  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.marketingTasks.getPath() + '?' + $.param(filterParams)}`,
      method: apiRoutes.marketingTasks.method,
      types: [
        constants.GET_MARKETING_REQUEST,
        constants.GET_MARKETING_RECEIVE,
        constants.GET_MARKETING_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

function getFilterParams(params) {
  let dueAtStartDate, dueAtEndDate, completedAtStartDate, completedAtEndDate, assignedToUser;

  if (params.startDate['dueAt']) {
    dueAtStartDate = params.startDate['dueAt'].format('DD/MM/YYYY');
  }

  if (params.endDate['dueAt']) {
    dueAtEndDate = params.endDate['dueAt'].format('DD/MM/YYYY');
  }

  if (params.startDate['completedAt']) {
    completedAtStartDate = params.startDate['completedAt'].format('DD/MM/YYYY');
  }

  if (params.endDate['completedAt']) {
    completedAtEndDate = params.endDate['completedAt'].format('DD/MM/YYYY');
  }

  if (params.assignedToUser) {
    assignedToUser = params.assignedToUser.value
  }

  return {
    dueAtStartDate: dueAtStartDate,
    dueAtEndDate: dueAtEndDate,
    completedAtStartDate: completedAtStartDate,
    completedAtEndDate: completedAtEndDate,
    lateTaskOnly: params.lateTaskOnly,
    statuses: params.statuses,
    venues: params.venues,
    assignedToUser: assignedToUser,
    assignedToSelf: params.assignedToSelf,
    page: params.page || 1
  }
}
