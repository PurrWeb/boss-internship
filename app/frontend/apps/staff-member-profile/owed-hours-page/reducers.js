import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';

import {
  INITIAL_LOAD,
  ADD_NEW_OWED_HOUR,
  CANCEL_ADD_NEW_OWED_HOUR,
  DELETE_OWED_HOURS,
  EDIT_OWED_HOURS_SUCCESS,
  OPEN_EDIT_OWED_HOURS_MODAL,
  CLOSE_OWED_HOURS_MODAL,
  ADD_OWED_HOURS_SUCCESS,
  CANCEL_EDIT_OWED_HOURS,
  CLOSE_EDIT_OWED_HOURS_MODAL,
  FILTER,
} from './constants';

const initialState = fromJS({
  staffMember: fromJS({}),
  accessToken: null,
  owedHours: fromJS([]),
  newOwedHour: false,
  editOwedHour: false,
  editedOwedHours: fromJS({}),
  startDate: null,
  endDate: null,
  payslipStartDate: null,
  payslipEndDate: null,
  permissionsData: fromJS({}),
});

const owedHoursReducer = handleActions(
  {
    [INITIAL_LOAD]: (state, action) => {
      const {
        staffMember,
        accessToken,
        owedHours,
        startDate,
        endDate,
        payslipStartDate,
        payslipEndDate,
      } = action.payload;

      const permissionsData = oFetch(action.payload, 'permissionsData');
      const canEnable = oFetch(permissionsData, 'canEnable');
      const owedHoursPermissions = oFetch(permissionsData, 'owedHoursTab.owed_hours');
      const canCreateOwedHours = oFetch(permissionsData, 'owedHoursTab.canCreateOwedHours');

      return state
        .set('staffMember', fromJS(staffMember))
        .set('accessToken', fromJS(accessToken))
        .set('owedHours', fromJS(owedHours))
        .set('startDate', startDate ? safeMoment.uiDateParse(startDate) : null)
        .set('endDate', endDate ? safeMoment.uiDateParse(endDate) : null)
        .set('payslipStartDate', payslipStartDate ? safeMoment.uiDateParse(payslipStartDate) : null)
        .set('payslipEndDate', payslipEndDate ? safeMoment.uiDateParse(payslipEndDate) : null)
        .set('permissionsData', fromJS({ canEnable, owedHoursPermissions, canCreateOwedHours }));
    },
    [ADD_NEW_OWED_HOUR]: state => {
      return state.set('newOwedHour', true);
    },
    [ADD_OWED_HOURS_SUCCESS]: (state, action) => {
      const owedHour = oFetch(action, 'payload.owedHour');
      const owedHourId = oFetch(owedHour, 'id');
      const permissions = oFetch(action, 'payload.permissions');

      return state
        .update('owedHours', owedHours => owedHours.push(fromJS(owedHour)))
        .updateIn(['permissionsData', 'owedHoursPermissions'], owedHoursPermissions =>
          owedHoursPermissions.set(owedHourId, fromJS(permissions)),
        );
    },
    [OPEN_EDIT_OWED_HOURS_MODAL]: (state, action) => {
      return state.set('editedOwedHours', fromJS(action.payload)).set('editOwedHour', true);
    },
    [CLOSE_EDIT_OWED_HOURS_MODAL]: (state, action) => {
      return state.set('editedOwedHours', fromJS({})).set('editOwedHour', false);
    },
    [EDIT_OWED_HOURS_SUCCESS]: (state, action) => {
      const oldOwedHourId = oFetch(action, 'payload.id');
      const owedHour = oFetch(action, 'payload.data.owedHour');
      const owedHourId = oFetch(owedHour, 'id');
      if (oldOwedHourId === owedHourId) {
        return state;
      }
      const permissions = oFetch(action, 'payload.data.permissions');

      return state
        .update('owedHours', owedHours => {
          return owedHours.filter(owedHour => owedHour.get('id') !== oldOwedHourId).push(fromJS(owedHour));
        })
        .updateIn(['permissionsData', 'owedHoursPermissions'], owedHoursPermissions =>
          owedHoursPermissions.set(owedHourId, fromJS(permissions)),
        );
    },
    [CLOSE_OWED_HOURS_MODAL]: state => {
      return state.set('newOwedHour', false);
    },
    [CANCEL_ADD_NEW_OWED_HOUR]: state => {
      return state.set('newOwedHour', false);
    },
    [DELETE_OWED_HOURS]: (state, action) => {
      const owedHourId = action.payload;

      return state.update('owedHours', owedHours => owedHours.filter(owedHour => owedHour.get('id') !== owedHourId));
    },
    [FILTER]: (state, action) => {
      const { owedHours, startDate, endDate, payslipStartDate, payslipEndDate } = action.payload;

      const permissionsData = oFetch(action.payload, 'permissionsData');
      const canEnable = oFetch(permissionsData, 'canEnable');
      const owedHoursPermissions = oFetch(permissionsData, 'owedHoursTab.owed_hours');
      const canCreateOwedHours = oFetch(permissionsData, 'owedHoursTab.canCreateOwedHours');

      return state
        .set('owedHours', fromJS(owedHours || []))
        .set('startDate', startDate ? safeMoment.uiDateParse(startDate) : null)
        .set('endDate', endDate ? safeMoment.uiDateParse(endDate) : null)
        .set('payslipStartDate', payslipStartDate ? safeMoment.uiDateParse(payslipStartDate) : null)
        .set('payslipEndDate', payslipEndDate ? safeMoment.uiDateParse(payslipEndDate) : null)
        .set('permissionsData', fromJS({ canEnable, owedHoursPermissions, canCreateOwedHours }));
    },
  },
  initialState,
);

export default owedHoursReducer;
