import { fromJS, Map, List } from 'immutable';
import moment from 'moment';

import {
  INITIAL,
  OPEN_ADD_VOUCHER_MODAL,
  CLOSE_ADD_VOUCHER_MODAL,
  ADD_VOUCHER_SUCCESS,
  DELETE_VOUCHER,
  FILL_VOUCHERS_DATA,
  CHANGE_VENUE,
  CHANGE_PAGE,
  CHANGE_STATUS_FILTER,
} from '../constants/action-names'

const ACTION_HANDLERS = {
  [INITIAL]: (state, action) => {
    let momentStartDate = null;
    let momentEndDate = null;

    const {
      venues,
      vouchers,
      currentVenue,
      accessToken,
      page,
      size,
      status,
      perPage,
      startDate,
      endDate,
    } = action.payload;

    if (!!startDate && !!endDate) {
      momentStartDate = moment(startDate, "YYYY-MM-DD");
      momentEndDate = moment(endDate, "YYYY-MM-DD");
    }

    state = state
      .set('venues', fromJS(venues))
      .set('vouchers', fromJS(vouchers))
      .set('currentVenue', fromJS(currentVenue))
      .set('accessToken', fromJS(accessToken))
      .set('isVoucherModalOpen', false)
      .setIn(['pagination', 'currentPage'], parseInt(page))
      .setIn(['pagination', 'size'], size)
      .setIn(['pagination', 'perPage'], perPage)
      .setIn(['pagination', 'pageCount'], Math.ceil(size / perPage))
      .setIn(['filter', 'status'], status)
      .setIn(['filter', 'range', 'startDate'], momentStartDate)
      .setIn(['filter', 'range', 'endDate'], momentEndDate);
    
    return state;
  },
  [OPEN_ADD_VOUCHER_MODAL]: (state) => {
    return state
      .set('isVoucherModalOpen', true)
  },
  [CLOSE_ADD_VOUCHER_MODAL]: (state) => {
    return state
      .set('isVoucherModalOpen', false)
  },
  [ADD_VOUCHER_SUCCESS]: (state, action) => {
    return state
      .update('vouchers', arr => arr.push(fromJS(action.payload)))
  },
  [DELETE_VOUCHER]: (state, action) => {
    const vouchers = state.get('vouchers');
    const index = vouchers.findIndex(voucher => voucher.get('id') === action.payload.id);

    return state
      .set('vouchers', vouchers.update(index, () => fromJS(action.payload)))
  },
  [FILL_VOUCHERS_DATA]: (state, action) => {
    return state
      .set('vouchers', fromJS(action.payload.vouchers))
      .set('currentVenue', fromJS(action.payload.current_venue))
      .setIn(['pagination', 'currentPage'], parseInt(action.payload.page))
      .setIn(['pagination', 'size'], action.payload.size)
      .setIn(['pagination', 'perPage'], action.payload.per_page)
      .setIn(['pagination', 'pageCount'], Math.ceil(action.payload.size / action.payload.per_page))
  },
  [CHANGE_VENUE]: (state, action) => {
    return state
      .set('currentVenue', fromJS(action.payload))
  },
  [CHANGE_PAGE]: (state, action) => {
    return state
      .setIn(['pagination', 'currentPage'], action.payload)
  },
  [CHANGE_STATUS_FILTER]: (state) => {
    let status = null;
    const currentStatus = state.getIn(['filter', 'status']);
    
    if (currentStatus === 'all') {
      status = 'active'
    } else {
      status = 'all'
    }

    return state
      .setIn(['filter', 'status'], status)

  },
}

const initialState = fromJS({
  vouchers: [],
  venues: [],
  accessToken: null,
  currentVenue: null,
  isVoucherModalOpen: false,
  filter: {
    range: {
      startDate: null,
      endDate: null,
    },
    status: null,
  },
  pagination: {
    currentPage: 1,
    size: null,
    perPage: null,
    pageCount: null,
  },
});

export default function vouchersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
