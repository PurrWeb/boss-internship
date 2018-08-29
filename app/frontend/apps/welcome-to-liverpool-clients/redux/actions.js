import { createAction } from 'redux-actions';
import * as types from './types';
import {  } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changeFilter = createAction(types.CHANGE_FILTER);
