import oFetch from 'o-fetch';
import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import * as _ from 'lodash';

import {
  INITIALIZE,
  LOAD_REPORT,
  UPLOAD_ERROR,
  SET_UPLOAD_IN_PROGRESS,
  UPLOAD_PAGE,
  RESET_APPLICATION,
  REPORT_PAGE,
  REPORT_PAGE_PROCCESSED_MODE,
  REPORT_PAGE_PARSE_ERROR_MODE
} from './constants';

const initialGlobalState = fromJS({
  currentPage: UPLOAD_PAGE
})
const globalReducer = handleActions({
  [INITIALIZE]: (state, action) => {
    const payload = oFetch(action, 'payload');
    const accessToken = oFetch(payload, 'accessToken');

    return state.
      set('accessToken', accessToken);
  },
  [RESET_APPLICATION]: (state, action) => {
    const accessToken = oFetch(state.toJS(), 'accessToken');
    return initialGlobalState.
      set("accessToken", accessToken);
  },
  [LOAD_REPORT]: (state, action) => {
    return state.
      set("currentPage", REPORT_PAGE);
  }
}, initialGlobalState);

const initialUploadPageState = fromJS({
  uploadInProgress: false,
  uploadErrors: []
})
const uploadPageReducer = handleActions({
  [INITIALIZE]: (state, action) => {
    //Init stuff here
    return state;
  },
  [RESET_APPLICATION]: (state, action) => {
    return initialUploadPageState;
  },
  [LOAD_REPORT]: (state, action) => {
    return state.
      set('uploadInProgress', false);
  },
  [UPLOAD_ERROR]: (state, action) => {
    return state.
      set('uploadInProgress', false).
      set('uploadErrors', oFetch(action.payload, 'message'));
  },
  [SET_UPLOAD_IN_PROGRESS]: (state, action) => {
    const newValue = oFetch(action, 'payload');
    return state.
      set('uploadInProgress', newValue);
  }
}, initialUploadPageState);

const initialReportPageState = fromJS({});
const reportPageReducer = handleActions({
  [RESET_APPLICATION]: (state, action) => {
    return initialReportPageState;
  },
  [LOAD_REPORT]: (state, action) => {
    const payload = oFetch(action, 'payload');
    const resultType = oFetch(payload, 'resultType');

    switch (resultType) {
      case "process":
        return state.
          set('mode', REPORT_PAGE_PROCCESSED_MODE).
          set('createdPayments', oFetch(payload, 'createdPayments')).
          set('updatedPayments', oFetch(payload, 'updatedPayments')).
          set('skippedInvalidPayments', oFetch(payload, 'skippedInvalidPayments')).
          set('skippedExistingPayments', oFetch(payload, 'skippedExistingPayments'))
        break;
      case "parse_error":
        return state.
          set('mode', REPORT_PAGE_PARSE_ERROR_MODE).
          set('headerRows', oFetch(payload, 'headerRows')).
          set('titleRowErrors', oFetch(payload, 'titleRowErrors')).
          set('headerRowErrors', oFetch(payload, 'headerRowErrors'))
        break;
      default:
        throw Error.new(`unsupprted result type ${resultType} encountered`)
    }
  }
}, initialReportPageState);

export default combineReducers({
  global: globalReducer,
  uploadPage: uploadPageReducer,
  reportPage: reportPageReducer
});
