import { createAction } from 'redux-actions';
import utils from '~/lib/utils';
import moment from 'moment';
import notify from '~/components/global-notification';
import URLSearchParams from 'url-search-params';

import {
  INITIAL_LOAD,
  SHOW_RECORD_REFLOAT,
  HIDE_RECORD_REFLOAT,
  ADD_MACHINES_REFLOAT,
} from './constants';

import {
  createMachinesRefloatRequest,
} from './requests';

export const initialLoad = createAction(INITIAL_LOAD);
export const showRecordRefloat = createAction(SHOW_RECORD_REFLOAT);
export const hideRecordRefloat = createAction(HIDE_RECORD_REFLOAT);
export const addMachinesRefloat = createAction(ADD_MACHINES_REFLOAT);

export const createMachinesRefloat = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  const formatedValues = {
    calculatedFloatTopup: values.calculatedFloatTopup * 100,
    calculatedMoneyBanked: values.calculatedMoneyBanked * 100,
    moneyBanked: values.moneyBanked * 100,
    floatTopup: values.floatTopup * 100,
  }

  return createMachinesRefloatRequest({ values: {...values, ...formatedValues}, venueId})
    .then((resp) => {
      dispatch(addMachinesRefloat(resp.data))
      dispatch(hideRecordRefloat());
      window.scrollTo(0, 0);
      notify('Machine Refloat Created Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}

export const filterMachinesRefloat = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);
  
  const formatedValues = {
    startDate: values.startDate && utils.formatRotaUrlDate(values.startDate),
    endDate: values.endDate && utils.formatRotaUrlDate(values.endDate),
  }

  let queryString = new URLSearchParams(window.location.search);
  formatedValues.startDate ? queryString.set('start_date', formatedValues.startDate) : queryString.delete('start_date');
  formatedValues.endDate ? queryString.set('end_date', formatedValues.endDate) : queryString.delete('end_date');
  values.machineId ? queryString.set('machine_id', values.machineId) : queryString.delete('machine_id');
  values.userId ? queryString.set('user_id', values.userId) : queryString.delete('user_id');
  const link = `${window.location.href.split('?')[0]}?${queryString.toString()}`
  window.location.href = link;
}
