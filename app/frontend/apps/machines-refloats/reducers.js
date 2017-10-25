import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import RotaDate from "~/lib/rota-date";
import moment from 'moment';

import {
  INITIAL_LOAD,
  SHOW_RECORD_REFLOAT,
  HIDE_RECORD_REFLOAT,
  ADD_MACHINES_REFLOAT,
} from './constants';

const currentDateMoment = moment(new RotaDate({ shiftStartsAt: new Date() }).getDateOfRota());

const initialState = fromJS({
  currentVenueId: null,
  accessToken: null,
  isRecordRefloat: false,
  machinesRefloats: [],
  machinesRefloatsUsers: [],
  venueMachines: [],
  filter: {
    startDate: currentDateMoment,
    endDate: currentDateMoment.add(1, 'month'),
  },
  page: 1,
  perPage: null,
});

const machinesRefloatsReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      currentVenueId,
      accessToken,
      machinesRefloats,
      machinesRefloatsUsers,
      venueMachines,
      startDate,
      endDate,
      machineId,
      userId,
      page,
      perPage,
      size,
    } = action.payload;
    
    return state
      .set('currentVenueId', currentVenueId)
      .set('accessToken', accessToken)
      .set('machinesRefloats', fromJS(machinesRefloats))
      .set('machinesRefloatsUsers', fromJS(machinesRefloatsUsers))
      .set('venueMachines', fromJS(venueMachines))
      .setIn(['pagination', 'currentPage'], parseInt(page))
      .setIn(['pagination', 'size'], size)
      .setIn(['pagination', 'perPage'], perPage)
      .setIn(['pagination', 'pageCount'], Math.ceil(size / perPage))
      .setIn(['filter', 'startDate'], moment(startDate))
      .setIn(['filter', 'endDate'], moment(endDate))
      .setIn(['filter', 'machineId'], machineId)
      .setIn(['filter', 'userId'], userId)
  },
  [SHOW_RECORD_REFLOAT]: (state) => {
    return state
      .set('isRecordRefloat', true)
  },
  [HIDE_RECORD_REFLOAT]: (state) => {
    return state
      .set('isRecordRefloat', false)
  },
  [ADD_MACHINES_REFLOAT]: (state, actions) => {
    const newRefloat = actions.payload.machines_refloat;
    return state.update('machinesRefloats', refloats => refloats.unshift(fromJS(newRefloat)));
  },
}, initialState);

export default combineReducers({
  page: machinesRefloatsReducer,
  form: formReducer,
});
