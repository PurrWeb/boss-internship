import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import * as types from './types';

const initialState = fromJS({ loading: false });
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { date, rotas, rotaShifts } = action.payload;
      return fromJS({ date, rotas, rotaShifts, loading: false });
    },
    [types.UPDATE_SECURITY_ROTA_WEEKLY_DAY]: (state, action) => {
      const { date, rotas, rotaShifts } = action.payload;
      return fromJS({ date, rotas, rotaShifts, loading: false });
    },
    [types.UPDATE_SECURITY_ROTA_WEEKLY_DAY_START]: (state, action) => {
      return state.setIn(['loading'], true);
    },
  },
  initialState,
);
