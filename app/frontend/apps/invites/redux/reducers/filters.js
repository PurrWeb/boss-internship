import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import { ANY } from '../../constants';
import * as types from '../types';

const initialState = Immutable.Map({
  status: ANY,
  role: ANY,
});

export default handleActions(
  {
    [types.SET_INITIAL_FILTERS]: (state, action) => {
      const status = oFetch(action, 'payload.status');
      const role = oFetch(action, 'payload.role');
      return Immutable.fromJS({ status, role });
    },
    [types.CHANGE_ROLE_FILTER]: (state, action) => {
      const role = oFetch(action, 'payload.role');
      return state.set('role', role);
    },
    [types.CHANGE_STATUS_FILTER]: (state, action) => {
      const status = oFetch(action, 'payload.status');
      return state.set('status', status);
    },
  },
  initialState,
);
