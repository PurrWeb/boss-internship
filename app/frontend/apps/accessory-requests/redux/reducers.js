import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
import oFetch from 'o-fetch';
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
      return state.set('currentVenue', currentVenue).set('venues', fromJS(venues));
    },
    [constants.SET_VENUE]: (state, action) => {
      const venueId = action.payload;
      return state.set('currentVenue', venueId);
    },
    [constants.UPDATE_REQUEST]: (state, action) => {
      const request = action.payload;
      const index = state.get('accessoryRequests').findIndex(item => item.get('id') === request.id);
      return state.setIn(['accessoryRequests', index], fromJS(request));
    },
    [constants.REMOVE_REQUEST]: (state, action) => {
      const request = oFetch(action.payload, 'accessoryRequest');
      const accessory = oFetch(action.payload, 'accessory');
      return state
        .updateIn(['accessoryRequests'], accessoryRequests => {
          return accessoryRequests.filter(item => item.get('id') !== oFetch(request, 'id'));
        })
        .updateIn(['accessories'], accessories => {
          const accessoryIndex = accessories.findIndex(item => item.get('id') === oFetch(accessory, 'id'));
          return accessories.set(accessoryIndex, fromJS(accessory));
        });
    },
    [constants.UPDATE_REFUND_REQUEST]: (state, action) => {
      const request = action.payload;
      const index = state.get('accessoryRefundRequests').findIndex(item => item.get('id') === request.id);
      return state.setIn(['accessoryRefundRequests', index], fromJS(request));
    },
    [constants.REMOVE_REFUND_REQUEST]: (state, action) => {
      const request = oFetch(action.payload, 'accessoryRefundRequest');
      const accessory = oFetch(action.payload, 'accessory');
      return state
        .updateIn(['accessoryRefundRequests'], accessoryRefundRequests => {
          return accessoryRefundRequests.filter(item => item.get('id') !== oFetch(request, 'id'));
        })
        .updateIn(['accessories'], accessories => {
          const accessoryIndex = accessories.findIndex(item => item.get('id') === oFetch(accessory, 'id'));
          return accessories.set(accessoryIndex, fromJS(accessory));
        });
    },
    [constants.REMOVE_ACCESSORY]: (state, action) => {
      const accessoryId = oFetch(action, 'payload');
      return state
        .updateIn(['accessories'], accessories => {
          return accessories.filter(item => item.get('id') !== accessoryId);
        })
        .updateIn(['pagination', 'totalCount'], totalCount => totalCount - 1);
    },
    [constants.LOAD_INITIAL_ACCESSORY_REQUESTS]: (state, action) => {
      const [
        pagination,
        accessories,
        accessoryRequests,
        accessoryRefundRequests,
        staffMembers,
        permissionsData,
      ] = oFetch(
        action.payload,
        'pagination',
        'accessories',
        'accessoryRequests',
        'accessoryRefundRequests',
        'staffMembers',
        'permissionsData',
      );

      return state
        .set('pagination', fromJS(pagination))
        .set('accessories', fromJS(accessories))
        .set('accessoryRequests', fromJS(accessoryRequests))
        .set('accessoryRefundRequests', fromJS(accessoryRefundRequests))
        .set('staffMembers', fromJS(staffMembers))
        .set('permissionsData', fromJS(permissionsData));
    },
    [constants.DROP_PAGE_NUMBER]: (state, action) => {
      return state.setIn(['pagination', 'pageNumber'], 1).setIn(['accessories'], fromJS([]));
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
