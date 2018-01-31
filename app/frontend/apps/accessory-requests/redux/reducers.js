import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import * as constants from './constants';

const initialState = fromJS({
  currentVenue: null,
  accessories: [],
  accessoryRequests: [],
  accessoryRefundRequests: [],
  staffMembers: [],
  venues: [],
  pagination: {
    pageNumber: 1,
  },
});

const accessoryRequestsReducer = handleActions(
  {
    [constants.LOAD_INITIAL_STATE]: (state, action) => {
      const { accessToken, currentVenue, venues } = action.payload;

      window.boss.accessToken = accessToken;
      return state
        .set('currentVenue', currentVenue)
        .set('venues', fromJS(venues));
    },
    [constants.SET_VENUE]: (state, action) => {
      const venueId = action.payload;
      return state.set('currentVenue', venueId);
    },
    [constants.UPDATE_REQUEST]: (state, action) => {
      const request = action.payload;
      const index = state
        .get('accessoryRequests')
        .findIndex(item => item.get('id') === request.id);
      return state.setIn(['accessoryRequests', index], fromJS(request));
    },
    [constants.UPDATE_REFUND_REQUEST]: (state, action) => {
      const request = action.payload;
      const index = state
        .get('accessoryRefundRequests')
        .findIndex(item => item.get('id') === request.id);
      return state.setIn(['accessoryRefundRequests', index], fromJS(request));
    },
    [constants.LOAD_INITIAL_ACCESSORY_REQUESTS]: (state, action) => {
      const {
        pagination,
        accessories,
        accessoryRequests,
        accessoryRefundRequests,
        staffMembers,
      } = action.payload;
      return state
        .set('pagination', fromJS(pagination))
        .updateIn(['accessories'], items => items.concat(fromJS(accessories)))
        .set('accessoryRequests', fromJS(accessoryRequests))
        .set('accessoryRefundRequests', fromJS(accessoryRefundRequests))
        .set('staffMembers', fromJS(staffMembers));
    },
    [constants.DROP_PAGE_NUMBER]: (state, action) => {
      return state
        .setIn(['pagination', 'pageNumber'], 1)
        .setIn(['accessories'], fromJS([]));
    },
    [constants.LOAD_MORE]: (state, action) => {
      return state.updateIn(['pagination', 'pageNumber'], pageNumber => {
        return parseInt(pageNumber) + 1;
      });
    },
  },
  initialState,
);

export default combineReducers({
  accessoryRequestsPage: accessoryRequestsReducer,
  form: formReducer,
});
