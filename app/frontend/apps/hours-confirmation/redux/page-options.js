import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = fromJS({});
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { pageOptions } = action.payload;
      return fromJS(pageOptions);
    },
    [types.UPDATE_PERIOD_STATUS]: (state, action) => {
      const userPeriodPermissions = oFetch(
        action.payload,
        'userPeriodPermissions',
      );
      const periodId = oFetch(userPeriodPermissions, 'id');
      return state.update('userPeriodsPermissions', userPeriodsPermissions => {
        const permissionIndex = userPeriodsPermissions.findIndex(
          permission => permission.get('id') === periodId,
        );
        if (permissionIndex === -1) {
          return userPeriodsPermissions.push(fromJS(userPeriodPermissions));
        }
        return userPeriodsPermissions.update(
          permissionIndex,
          (permission) => permission.set('permitted', oFetch(userPeriodPermissions, 'permitted')),
        );
      });
    },
  },
  initialState,
);
