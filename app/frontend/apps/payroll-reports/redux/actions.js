import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changePayRateFilter = createAction(types.CHANGE_PAY_RATE_FILTER);
