import {
  SET_FILTER_DATE_RANGE,
  SET_FILTER_CREATED_BY,
  SET_FILTER_VOUCHERS_STATUS,
  CHANGE_STATUS_FILTER,
} from '../constants/action-names';

import utils from '~/lib/utils';

import {fillVouchers} from './venue-actions';

import axios from 'axios';

export const setFilterDateRange = ({startDate, endDate}) => {
  return {
    type: SET_FILTER_DATE_RANGE,
    payload: {startDate, endDate},
  }
}

export const setFilterVoucherStatus = (status) => {
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
    status: filter.get('status'),
    page: page,
  };
  const newParams = utils.insertUrlParams(params);
  axios.get('/api/v1/vouchers', {
    params: params,
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch(fillVouchers(resp.data));
    window.history.pushState('state', 'title', `vouchers?${newParams}`);
  })
}

export const changeStatusFilter = () => (dispatch) => {
  dispatch({
    type: CHANGE_STATUS_FILTER,
  });
  dispatch(search());
}
