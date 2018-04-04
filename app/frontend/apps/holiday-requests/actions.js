import { createAction } from 'redux-actions';

import {
  INITIAL_LOAD,
} from './constants';

export const loadInitialState = createAction(INITIAL_LOAD);

export const setInitialData = (values) => (dispatch, getState) => {
  dispatch(loadInitialState(values));
}
