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
    [types.DONE_PERIOD]: (state, action) => {
      const periods = oFetch(action.payload, 'periods');
      const hoursAcceptancePeriods = oFetch(
        periods,
        'hoursAcceptancePeriods',
      );
      const hoursAcceptancePeriodsIds = hoursAcceptancePeriods.map(period => oFetch(period, 'id'));

      return state.filter(period => !hoursAcceptancePeriodsIds.includes(period.get('hoursAcceptancePeriod')));
    },
    [types.FORCE_CLOCK_OUT]: (state, action) => {
      const { hoursAcceptanceBreaks } = action.payload;
      return state.update(breaks =>
        breaks.concat(fromJS(hoursAcceptanceBreaks)),
      );
    },
  },
  initialState,
);
