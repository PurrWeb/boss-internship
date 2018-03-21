import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { hoursAcceptanceBreaks } = action.payload;
      return fromJS(hoursAcceptanceBreaks).map(hoursAcceptanceBreak =>
        hoursAcceptanceBreak.set('frontendId', hoursAcceptanceBreak.get('id')),
      );
    },
    [types.UPDATE_PERIOD_DATA]: (state, action) => {
      const breaks = action.payload.get('breaks');
      const frontendId = action.payload.get('frontendId');
      return state
        .filterNot(
          periodBreak =>
            periodBreak.get('hoursAcceptancePeriod') === frontendId,
        )
        .concat(breaks);
    },
    [types.UPDATE_PERIOD_STATUS]: (state, action) => {
      const breaks = oFetch(action.payload, 'breaks');
      const frontendId = oFetch(action.payload, 'frontendId');

      return state
        .filterNot(
          periodBreak =>
            periodBreak.get('hoursAcceptancePeriod') === frontendId,
        )
        .concat(fromJS(breaks));
    },
    [types.REMOVE_HOURS_ACCEPTANCE_PERIOD]: (state, action) => {
      const frontendId = oFetch(action.payload, 'frontendId');

      return state.filterNot(
        periodBreak => periodBreak.get('hoursAcceptancePeriod') === frontendId,
      );
    },
  },
  initialState,
);
