import {
  TOGGLE_FILTER,
  SET_FILTER_DATE_RANGE,
  SET_FILTER_CREATED_BY,
  SET_FILTER_SUBMISSION_STATUS,
} from '../constants/action-names';

import utils from '~/lib/utils';

import {fillSubmitions} from './venue-actions';

import axios from 'axios';

export const toggleFilter = () => {
  return {
    type: TOGGLE_FILTER,
  };
}

export const setFilterDateRange = ({startDate, endDate}) => {
  return {
    type: SET_FILTER_DATE_RANGE,
    payload: {startDate, endDate},
  }
}

export const setFilterCreatetBy = (userId) => {
  return {
    type: SET_FILTER_CREATED_BY,
    payload: userId,
  }
}

export const setFilterSubmissionStatus = (status) => {
  return {
    type: SET_FILTER_SUBMISSION_STATUS,
    payload: status,
  }
}

export const search = (currentPage) => (dispatch, getState) => {
  const accessToken  = getState().get('accessToken');
  const venueId = getState().getIn(['currentVenue', 'id']);
  const filter = getState().get('filter');
  const page = currentPage || getState().getIn(['pagination', 'currentPage']);
  const params = {
    venue_id: venueId,
    start_date: filter.getIn(['range', 'startDate']) ? filter.getIn(['range', 'startDate']).format('DD-MM-YYYY') : undefined,
    end_date: filter.getIn(['range', 'endDate']) ? filter.getIn(['range', 'endDate']).format('DD-MM-YYYY') : undefined,
    created_by: filter.get('createdBy'),
    status: filter.get('status'),
    page: page,
  };
  const newParams = utils.insertUrlParams(params);
  return axios.get('/api/v1/checklist_submissions', {
    params: params,
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch(fillSubmitions(resp.data));
    window.history.pushState('state', 'title', `checklist_submissions?${newParams}`);
  })
}
