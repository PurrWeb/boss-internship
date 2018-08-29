import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import { ALL } from '../../constants';

import * as types from '../types';

const initialState = Immutable.fromJS({
  activeFilter: ALL,
  numberFilter: null,
});

export default handleActions(
  {
    [types.CHANGE_ACTIVE_FILTER]: (state, action) => {
      const activeFilter = oFetch(action, 'payload.filter');
      return state.set('activeFilter', activeFilter);
    },
    [types.CHANGE_CARD_NUMBER_FILTER]: (state, action) => {
      const numberFilter = oFetch(action, 'payload.filter');
      return state.set('numberFilter', numberFilter);
    },
  },
  initialState,
);
