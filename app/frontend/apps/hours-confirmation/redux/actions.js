import { createAction } from 'redux-actions';
import * as types from './types';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
