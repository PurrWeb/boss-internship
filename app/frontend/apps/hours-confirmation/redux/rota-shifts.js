import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { rotaShifts } = action.payload;
      return fromJS(rotaShifts);
    },
    [types.DONE_PERIOD]: (state, action) => {
      const periods = oFetch(action.payload, 'periods');
      const rotaedShifts = oFetch(
        periods,
        'rotaedShifts',
      );
      const rotaedShiftsIds = rotaedShifts.map(shift => oFetch(shift, 'id'));
      return state.filter(shift => !rotaedShiftsIds.includes(shift.get('id')));
    },
  },
  initialState,
);
