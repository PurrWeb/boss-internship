import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.fromJS({
  pageNumber: 1,
  totalPages: null,
  totalCount: null,
  perPage: 10,
});

export default handleActions(
  {
    [types.LOAD_WTL_CLIENTS]: (state, action) => {
      const totalCount = oFetch(action, 'payload.totalCount');
      const totalPages = oFetch(action, 'payload.totalPages');
      const perPage = oFetch(action, 'payload.perPage');
      return state
        .set('totalCount', totalCount)
        .set('totalPages', totalPages)
        .set('perPage', perPage);
    },
    [types.SET_WTL_CLIENTS]: (state, action) => {
      const totalCount = oFetch(action, 'payload.totalCount');
      const totalPages = oFetch(action, 'payload.totalPages');
      const perPage = oFetch(action, 'payload.perPage');
      return state
        .set('totalCount', totalCount)
        .set('totalPages', totalPages)
        .set('perPage', perPage)
        .set('pageNumber', 1);
    },
    [types.INCREMENT_PAGE]: (state, action) => {
      return state.update('pageNumber', pageNumber => {
        return parseInt(pageNumber) + 1;
      });
    },
  },
  initialState,
);
