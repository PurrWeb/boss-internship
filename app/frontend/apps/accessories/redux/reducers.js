import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import * as constants from './constants';

const initialState = fromJS({
  accessories: [],
  pageData: {
    currentVenue: null,
  },
  pagination : {
    pageNumber: 1,
  }
});

const accessoriesReducer = handleActions({
  [constants.LOAD_INITIAL_STATE]: (state, action) => {
    const {
      accessToken,
      currentVenue,
    } = action.payload;

    window.boss.accessToken = accessToken;
    return state
      .setIn(['pageData', 'currentVenue'], currentVenue)
  },
  [constants.LOAD_INITIAL_ACCESSORIES]: (state, action) => {
    const {accessories, pagination} = action.payload;
    return state
      .updateIn(['accessories'], items => items.concat(fromJS(accessories)))
      .set('pagination', fromJS(pagination))
  },
  [constants.UPDATE_ACCESSORY]: (state, action) => {
    const accessory = action.payload;
    const accessoryIndex = state.get('accessories').findIndex(item => item.get('id') === accessory.id);
    return state
      .setIn(['accessories', accessoryIndex], fromJS(accessory));
  },
  [constants.ADD_ACCESSORY]: (state, action) => {
    const accessory = action.payload;
    return state
      .updateIn(['accessories'], accessories => accessories.unshift(fromJS(accessory)));
  },
  [constants.REMOVE_LAST]: (state, action) => {
    return state
      .updateIn(['accessories'], accessories => accessories.delete(-1));
  },
  [constants.LOAD_MORE]: (state, action) => {
    return state
      .updateIn(['pagination', 'pageNumber'], pageNumber => {
        return parseInt(pageNumber) + 1;
      });
  },
  [constants.INCREMENT_TOTAL]: (state, action) => {
    return state
      .updateIn(['pagination', 'totalCount'], totalCount => {
        return parseInt(totalCount) + 1;
      });
  },
  [constants.DROP_PAGE_NUMBER]: (state, action) => {
    return state
      .setIn(['pagination', 'pageNumber'], 1)
      .setIn(['accessories'], fromJS([]))
  },

}, initialState);

export default combineReducers({
  page: accessoriesReducer,
  form: formReducer,
})
