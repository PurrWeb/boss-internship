import { createAction } from 'redux-actions';
import {
  INITIAL_PAGE_LOAD
} from './constants';

export const initialPageLoad = () => (dispatch, getState) => {
  dispatch(loadInitialState({}));
}

export const loadInitialState = createAction(INITIAL_PAGE_LOAD);
