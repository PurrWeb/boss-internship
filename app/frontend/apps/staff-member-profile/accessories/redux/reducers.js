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
      const [accessToken, accessories, accessoryRequests, sPayslipStartDate, sPayslipEndDate] = oFetch(
        action.payload,
        'accessToken',
        'accessories',
        'accessoryRequests',
        'sPayslipStartDate',
        'sPayslipEndDate',
      );
      window.boss.accessToken = accessToken;

      return state
        .setIn(['accessories'], fromJS(accessories))
        .setIn(['accessoryRequests'], fromJS(accessoryRequests))
        .setIn(['mPayslipEndDate'], sPayslipEndDate ? safeMoment.uiDateParse(sPayslipEndDate) : null)
        .setIn(['mPayslipStartDate'], sPayslipStartDate ? safeMoment.uiDateParse(sPayslipStartDate) : null);
    },
    [constants.ADD_ACCESSORY]: (state, action) => {
      const newAccessory = oFetch(action.payload, 'accessoryRequest');

      return state.updateIn(['accessoryRequests'], requests => {
        return requests.push(fromJS(newAccessory));
      });
    },
    [constants.UPDATE_ACCESSORY_REQUEST]: (state, action) => {
      const request = oFetch(action.payload, 'accessoryRequest');
      const index = state.get('accessoryRequests').findIndex(item => item.get('id') === oFetch(request, 'id'));
      return state.setIn(['accessoryRequests', index], fromJS(request));
    },
    [constants.LOAD_ACCESSORY_REQUESTS]: (state, action) => {
      const [accessories, accessoryRequests, sPayslipStartDate, sPayslipEndDate] = oFetch(
        action.payload,
        'accessories',
        'accessoryRequests',
        'sPayslipStartDate',
        'sPayslipEndDate',
      );
      return state
        .setIn(['accessories'], fromJS(accessories))
        .setIn(['accessoryRequests'], fromJS(accessoryRequests))
        .setIn(['mPayslipEndDate'], sPayslipEndDate ? safeMoment.uiDateParse(sPayslipEndDate) : null)
        .setIn(['mPayslipStartDate'], sPayslipStartDate ? safeMoment.uiDateParse(sPayslipStartDate) : null);
    },
  },
  initialState,
);

export default accessoriesReducer;
