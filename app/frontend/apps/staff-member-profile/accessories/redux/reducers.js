import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';

import * as constants from './constants';

const initialState = fromJS({
  accessories: [],
  accessoryRequests: [],
  mPayslipStartDate: null,
  mPayslipEndDate: null,
});

const accessoriesReducer = handleActions(
  {
    [constants.LOAD_INITIAL_STATE]: (state, action) => {
      const [accessToken, accessories, accessoryRequests, payslipStartDate, payslipEndDate] = oFetch(
        action.payload,
        'accessToken',
        'accessories',
        'accessoryRequests',
        'payslipStartDate',
        'payslipEndDate',
      );
      window.boss.accessToken = accessToken;

      return state
        .setIn(['accessories'], fromJS(accessories))
        .setIn(['accessoryRequests'], fromJS(accessoryRequests))
        .setIn(['mPayslipEndDate'], payslipEndDate ? safeMoment.uiDateParse(payslipEndDate) : null)
        .setIn(['mPayslipStartDate'], payslipStartDate ? safeMoment.uiDateParse(payslipStartDate) : null);
    },
    [constants.ADD_ACCESSORY]: (state, action) => {
      const newAccessory = action.payload;

      return state.updateIn(['accessoryRequests'], requests => {
        return requests.push(fromJS(newAccessory));
      });
    },
    [constants.UPDATE_ACCESSORY_REQUEST]: (state, action) => {
      const request = action.payload;
      const index = state.get('accessoryRequests').findIndex(item => item.get('id') === request.id);
      return state.setIn(['accessoryRequests', index], fromJS(request));
    },
    [constants.LOAD_ACCESSORY_REQUESTS]: (state, action) => {
      const [accessories, accessoryRequests, payslipStartDate, payslipEndDate] = oFetch(
        action.payload,
        'accessories',
        'accessoryRequests',
        'payslipStartDate',
        'payslipEndDate',
      );
      return state
        .setIn(['accessories'], fromJS(accessories))
        .setIn(['accessoryRequests'], fromJS(accessoryRequests))
        .setIn(['mPayslipEndDate'], payslipEndDate ? safeMoment.uiDateParse(payslipEndDate) : null)
        .setIn(['mPayslipStartDate'], payslipStartDate ? safeMoment.uiDateParse(payslipStartDate) : null);
    },
  },
  initialState,
);

export default accessoriesReducer;
