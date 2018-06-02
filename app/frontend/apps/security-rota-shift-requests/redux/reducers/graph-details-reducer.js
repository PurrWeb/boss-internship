import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.fromJS({graphDetails: null, isOpen: false});
export default handleActions(
  {
    [types.SHOW_GRAPH_DETAILS]: (state, action) => {
      const graphDetails = oFetch(action.payload, 'graphDetails');
      return state.set('graphDetails', Immutable.fromJS(graphDetails)).set('isOpen', true);
    },
    [types.CLOSE_GRAPH_DETAILS]: state => {
      return state.set('graphDetails', null).set('isOpen', false);
    },
  },
  initialState,
);
