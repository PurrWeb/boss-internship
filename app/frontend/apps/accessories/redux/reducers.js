import { fromJS, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
import oFetch from 'o-fetch';

import * as constants from './constants';

export const getHistoryByAccessoryId = state => accessoryId => {
  return state.getIn(['page', 'history']).filter(history => history.get('accessoryId') === accessoryId) || List();
};

const initialState = fromJS({
  accessories: [],
  pageData: {
    currentVenue: null,
  },
  history: [],
  pagination: {
    pageNumber: 1,
  },
});

const accessoriesReducer = handleActions(
  {
    [constants.LOAD_INITIAL_STATE]: (state, action) => {
      const { accessToken, currentVenue } = action.payload;

      window.boss.accessToken = accessToken;
      return state.setIn(['pageData', 'currentVenue'], currentVenue);
    },
    [constants.LOAD_INITIAL_ACCESSORIES]: (state, action) => {
      const { accessories, pagination } = action.payload;
      const history = oFetch(pagination, 'history');
      delete pagination.history;
      return state
        .updateIn(['accessories'], items => items.concat(fromJS(accessories)))
        .set('pagination', fromJS(pagination))
        .set('history', fromJS(history));
    },
    [constants.UPDATE_ACCESSORY]: (state, action) => {
      const accessory = action.payload;
      const accessoryIndex = state.get('accessories').findIndex(item => item.get('id') === accessory.id);
      return state.setIn(['accessories', accessoryIndex], fromJS(accessory));
    },
    [constants.UPDATE_HISTORY]: (state, action) => {
      const accessory = oFetch(action.payload, 'accessory');
      const accessoryId = oFetch(accessory, 'id');
      const accessoryHistory = oFetch(action.payload, 'history');
      const accessoryIndex = state.get('accessories').findIndex(item => item.get('id') === accessory.id);
      return state
        .update('history', history => {
          return history.filter(item => item.get('accessoryId') !== accessoryId).concat(fromJS(accessoryHistory));
        })
        .setIn(['accessories', accessoryIndex], fromJS(accessory));
    },
    [constants.ADD_ACCESSORY]: (state, action) => {
      const accessory = action.payload;
      return state.updateIn(['accessories'], accessories => accessories.unshift(fromJS(accessory)));
    },
    [constants.REMOVE_LAST]: (state, action) => {
      return state.updateIn(['accessories'], accessories => accessories.delete(-1));
    },
    [constants.LOAD_MORE]: (state, action) => {
      return state.updateIn(['pagination', 'pageNumber'], pageNumber => {
        return parseInt(pageNumber) + 1;
      });
    },
    [constants.INCREMENT_TOTAL]: (state, action) => {
      return state.updateIn(['pagination', 'totalCount'], totalCount => {
        return parseInt(totalCount) + 1;
      });
    },
    [constants.DROP_PAGE_NUMBER]: (state, action) => {
      return state.setIn(['pagination', 'pageNumber'], 1).setIn(['accessories'], fromJS([]));
    },
  },
  initialState,
);

export default combineReducers({
  page: accessoriesReducer,
  form: formReducer,
});
