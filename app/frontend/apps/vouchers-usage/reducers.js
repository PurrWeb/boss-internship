import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import moment from 'moment';
import { handleActions } from 'redux-actions';

import {INITIAL} from './constants'

const initialState = fromJS({
  voucher: null,
  usages: [],
  filter: {
    status: "all",
    startDate: null,
    endDate: null,
  },
  pagination: {
    currentPage: 1,
    size: null,
    perPage: null,
    pageCount: null,
  }
});

const voucherUsagesReducer = handleActions({
  [INITIAL]: (state, action) => {
    let momentStartDate = null;
    let momentEndDate = null;
    
    const {
      startDate,
      endDate,
      voucher,
      usages,
      status,
      page,
      perPage,
      size
    } = action.payload;

    if (!!startDate && !!endDate) {
      momentStartDate = moment(startDate, "YYYY-MM-DD");
      momentEndDate = moment(endDate, "YYYY-MM-DD");
    }

    return state
      .set('voucher', fromJS(voucher))
      .set('usages', fromJS(usages))
      .setIn(['filter', 'status'], status)
      .setIn(['filter', 'startDate'], momentStartDate)
      .setIn(['filter', 'endDate'], momentEndDate)
      .setIn(['pagination', 'currentPage'], parseInt(page))
      .setIn(['pagination', 'size'], size)
      .setIn(['pagination', 'perPage'], perPage)
      .setIn(['pagination', 'pageCount'], Math.ceil(size / perPage))
   }
}, initialState);

export default combineReducers({
  page: voucherUsagesReducer,
})
