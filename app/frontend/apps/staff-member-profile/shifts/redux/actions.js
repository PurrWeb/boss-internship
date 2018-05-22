import { createAction } from 'redux-actions';
import { INITIAL_LOAD } from './types';

export const initialLoad = createAction(INITIAL_LOAD);