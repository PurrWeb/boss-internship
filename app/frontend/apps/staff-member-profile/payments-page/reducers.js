import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import {
  INITIAL_PAGE_LOAD
} from './constants';

const initialGlobalState = fromJS({
  accessToken: null
})

export const globalReducer = handleActions({
  [INITIAL_PAGE_LOAD]: (state, action) => {
    return state;
  }
}, initialGlobalState);
