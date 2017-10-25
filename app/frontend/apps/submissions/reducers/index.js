import { fromJS, Map, List } from 'immutable';
import safeMoment from "~/lib/safe-moment";

import {
  INITIAL,
  TOGGLE_FILTER,
  CHANGE_VENUE,
  FILL_SUBMISSIONS_DATA,
  OPEN_DETAILS_MODAL,
  CLOSE_DETAILS_MODAL,
  SET_FILTER_DATE_RANGE,
  SET_FILTER_CREATED_BY,
  SET_FILTER_SUBMISSION_STATUS,
  CHANGE_PAGE,
} from '../constants/action-names';

const ACTION_HANDLERS = {
  [INITIAL]: (state, action) => {
    let status = null;
    let momentStartDate = null;
    let momentEndDate = null;

    const {
      venues,
      submissions,
      currentVenue,
      accessToken,
      currentPage,
      size,
      perPage,
      created_by,
      startDate,
      endDate,
    } = action.payload;

    if (action.payload.status === "false") {
      status = false;
    } else if(action.payload.status === "true"){
      status = true;
    }

    if (!!startDate && !!endDate) {
      momentStartDate = safeMoment.uiDateParse(startDate);
      momentEndDate = safeMoment.uiDateParse(endDate);
    }

    state = state
      .set('venues', fromJS(venues))
      .set('submissions', fromJS(submissions))
      .set('currentVenue', fromJS(currentVenue))
      .set('accessToken', fromJS(accessToken))
      .setIn(['pagination', 'currentPage'], parseInt(currentPage))
      .setIn(['pagination', 'size'], size)
      .setIn(['pagination', 'perPage'], perPage)
      .setIn(['pagination', 'pageCount'], Math.ceil(size / perPage))
      .setIn(['filter', 'status'], status)
      .setIn(['filter', 'createdBy'], created_by)
      .setIn(['filter', 'range', 'startDate'], momentStartDate)
      .setIn(['filter', 'range', 'endDate'], momentEndDate);

    return state;
  },
  [FILL_SUBMISSIONS_DATA]: (state, action) => {
    return state
      .set('submissions', fromJS(action.payload.submissions))
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
  [TOGGLE_FILTER]: (state) => {
    return state
      .set('isFilterOpen', !state.get('isFilterOpen'));
  },
  [SET_FILTER_DATE_RANGE]: (state, action) => {
    const {startDate, endDate} = action.payload;
    return state
      .setIn(['filter', 'range', 'startDate'], startDate)
      .setIn(['filter', 'range', 'endDate'], endDate);
  },
  [SET_FILTER_CREATED_BY]: (state, action) => {
    return state
      .setIn(['filter', 'createdBy'], action.payload)
  },
  [SET_FILTER_SUBMISSION_STATUS]: (state, action) => {
    return state
      .setIn(['filter', 'status'], action.payload);
  },
  [OPEN_DETAILS_MODAL]: (state, action) => {
    return state
      .set('isDetailsOpen', true)
      .set('detailedSubmission', fromJS(action.payload))
  },
  [CLOSE_DETAILS_MODAL]: (state) => {
    return state
      .set('isDetailsOpen', false)
      .set('detailedSubmission', fromJS({}))
  },

}

const initialState = fromJS({
  venues: [],
  isFilterOpen: false,
  submissions: [],
  currentVenue: {},
  isDetailsOpen: false,
  detailedSubmission: {},
  accessToken: null,
  pagination: {
    currentPage: 1,
    size: null,
    perPage: null,
    pageCount: null,
  },
  filter: {
    range: {
      startDate: null,
      endDate: null,
    },
    createdBy: null,
    status: null,
  }
});

export default function submissionsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
