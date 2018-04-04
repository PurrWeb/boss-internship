import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

import { getSecurityRotaDayData } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const updateSecurityRotaWeeklyDay = createAction(
  types.UPDATE_SECURITY_ROTA_WEEKLY_DAY,
);
export const updateSecurityRotaWeeklyDayStart = createAction(
  types.UPDATE_SECURITY_ROTA_WEEKLY_DAY_START,
);

export const getSecurityRotaDayDataAction = options => (dispatch, getState) => {
  dispatch(updateSecurityRotaWeeklyDayStart());
  return getSecurityRotaDayData(options).then(response => {
    dispatch(updateSecurityRotaWeeklyDay(response.data));
    const date = oFetch(options, 'date');
    window.history.pushState(
      'state',
      'title',
      `security_rotas?highlight_date=${date}`,
    );
  });
};
