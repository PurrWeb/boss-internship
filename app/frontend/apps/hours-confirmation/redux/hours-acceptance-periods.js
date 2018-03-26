import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import moment from 'moment';
import uuid from 'uuid/v1';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { hoursAcceptancePeriods } = action.payload;
      return fromJS(hoursAcceptancePeriods).map(hoursAcceptancePeriod =>
        hoursAcceptancePeriod.set(
          'frontendId',
          hoursAcceptancePeriod.get('id'),
        ),
      );
    },
    [types.UPDATE_PERIOD_DATA]: (state, action) => {
      const frontendId = action.payload.get('frontendId');
      const startsAt = action.payload.get('startsAt');
      const endsAt = action.payload.get('endsAt');
      const reasonNote = action.payload.get('reasonNote');
      const breaks = action.payload.get('breaks');

      const periodForUpdateIndex = state.findIndex(
        period => period.get('frontendId') === frontendId,
      );

      return state.update(periodForUpdateIndex, period =>
        period
          .set('startsAt', startsAt)
          .set('endsAt', endsAt)
          .set('reasonNote', reasonNote),
      );
    },
    [types.UPDATE_PERIOD_STATUS]: (state, action) => {
      const updatedPeriod = oFetch(action.payload, 'hoursAcceptancePeriod');
      const frontendId = oFetch(action.payload, 'frontendId');
      const id = oFetch(updatedPeriod, 'id');

      const periodForUpdateIndex = state.findIndex(
        period => period.get('frontendId') === frontendId,
      );

      if (periodForUpdateIndex === -1) {
        throw new Error('Period must present');
      }

      return state.update(periodForUpdateIndex, period =>
        period.set('frontendId', id).merge(fromJS(updatedPeriod)),
      );
    },
    [types.ADD_NEW_ACCEPTANCE_PERIOD]: (state, action) => {
      const {
        date,
        staffMemberId,
        newStartsEndsTime,
        frontendId,
        venueId,
      } = action.payload;
      const { startsAt, endsAt } = newStartsEndsTime;
      return state.push(
        fromJS({
          frontendId,
          startsAt,
          endsAt,
          date,
          status: 'pending',
          reasonNote: null,
          staffMember: staffMemberId,
          hoursAcceptanceBreaks: [],
          acceptedAt: null,
          id: null,
          acceptedBy: null,
          venueId,
        }),
      );
    },
    [types.REMOVE_HOURS_ACCEPTANCE_PERIOD]: (state, action) => {
      const frontendId = oFetch(action.payload, 'frontendId');

      return state.filterNot(period => period.get('frontendId') === frontendId);
    },
    [types.FORCE_CLOCK_OUT]: (state, action) => {
      const { hoursAcceptancePeriod } = action.payload;
      const frontendId = oFetch(hoursAcceptancePeriod, 'id');
      return state.update(hoursAcceptancePeriods =>
        hoursAcceptancePeriods.push(
          fromJS(hoursAcceptancePeriod).set('frontendId', frontendId),
        ),
      );
    },
    [types.DONE_PERIOD]: (state, action) => {
      const periods = oFetch(action.payload, 'periods');
      const hoursAcceptancePeriods = oFetch(
        periods,
        'hoursAcceptancePeriods',
      );
      const hoursAcceptancePeriodsIds = hoursAcceptancePeriods.map(period => oFetch(period, 'id'));

      return state.filter(period => !hoursAcceptancePeriodsIds.includes(period.get('id')));
    },
  },
  initialState,
);
