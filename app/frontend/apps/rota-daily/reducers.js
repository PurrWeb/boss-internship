import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import SafeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

import {
  INITIAL_LOAD,
  ADD_NEW_SHIFT,
  CANCEL_ADD_NEW_SHIFT,
  SHOW_GRAPH_DETAILS,
  CLOSE_GRAPH_DETAILS,
  UPDATE_ROTA_SHIFT,
  DELETE_ROTA_SHIFT,
  ADD_ROTA_SHIFT,
  OPEN_MULTIPLE_SHIFT,
  CLOSE_MULTIPLE_SHIFT,
  SET_MULTIPLE_SHIFT_STAFF_ID,
  SET_STAFF_TYPES_FILTER,
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
  ADD_ROTA,
} from './constants';

const initialState = fromJS({
  accessToken: null,
  rotaDate: null,
  currentVenue: null,
  staffTypes: [],
  staffMembers: [],
  rotaShifts: [],
  rota: null,
  rotas: [],
  isAddingNewShift: false,
  isGraphDetailsOpen: false,
  graphDetails: null,
  isMultipleShift: false,
  multipleShiftStaffId: null,
  staffTypesFilterIds: [],
});

const rotaDailyReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      accessToken,
      currentVenue,
      staffTypes,
      staffMembers,
      weekRotaShifts,
      rotaShifts,
      rota,
      venues,
      holidays,
      rotas,
    } = action.payload;

    const imWeekRotaShifts = fromJS(weekRotaShifts);
    const imHolidays = fromJS(holidays);
    const imVenues = fromJS(venues);
    const imRotas = fromJS(rotas);
    const imStaffMembers = fromJS(staffMembers).map(staffMember => {
      const {weekRotaShifts, hoursOnWeek} = utils.calculateStaffRotaShift(staffMember, imWeekRotaShifts, imRotas, imVenues);
      console.log(staffMember.get('id'), weekRotaShifts, hoursOnWeek);
      const holidays = imHolidays.filter(holiday => holiday.getIn(['staff_member', 'id']) === staffMember.get('id'));
      const holidaysOnWeek = holidays.reduce((summ, holiday) => {
        return summ = summ + holiday.get('days');
      }, 0);

      return staffMember
        .set('weekRotaShifts', weekRotaShifts)
        .set('hoursOnWeek', hoursOnWeek || 0)
        .set('holidays', holidays)
        .set('holidaysOnWeek', holidaysOnWeek || 0)
    });
    return state
      .set('accessToken', accessToken)
      .set('currentVenue', fromJS(currentVenue))
      .set('staffTypes', fromJS(staffTypes))
      .set('staffMembers', imStaffMembers)
      .set('rotas', imRotas)
      .set('rota', fromJS(rota))
      .set('rotaShifts', fromJS(rotaShifts))
      .set('weekRotaShifts', imWeekRotaShifts)
      .set('venues', imVenues)
      .set('holidays', imHolidays)
  },
  [ADD_NEW_SHIFT]: (state) => {
    return state.set('isAddingNewShift', true)
  },
  [CANCEL_ADD_NEW_SHIFT]: (state) => {
    return state.set('isAddingNewShift', false)
  },
  [SHOW_GRAPH_DETAILS]: (state, action) => {
    return state
      .set('graphDetails', fromJS(action.payload))
      .set('isGraphDetailsOpen', true)
  },
  [CLOSE_GRAPH_DETAILS]: (state) => {
    return state
      .set('graphDetails', null)
      .set('isGraphDetailsOpen', false)
  },
  [ADD_ROTA]: (state, action) => {
    const rota = oFetch(action.payload, 'rota');
    const rotas = state.get('rotas');

    if (rotas.findIndex(r => r.get('id') === oFetch(rota, 'id')) === -1) {
      return state.update('rotas', rotas => rotas.push(fromJS(rota)));
    }
    return state;
  },
  [UPDATE_STAFF_MEMBER_SHIFT_INFO]: (state, action) => {
    const staffMemberId = action.payload;
    const staffMemberIndex = state.get('staffMembers').findIndex(staffMember => staffMember.get('id') === staffMemberId);
    const imRotas = state.get('rotas');
    const imVenues = state.get('venues');

    return state.update('staffMembers', staffMembers => {
      return staffMembers.update(staffMemberIndex, staffMember => {
        const imWeekRotaShifts = state.get('weekRotaShifts');
        const {weekRotaShifts, hoursOnWeek} = utils.calculateStaffRotaShift(staffMember, imWeekRotaShifts, imRotas, imVenues);
        return staffMember
          .set('weekRotaShifts', weekRotaShifts)
          .set('hoursOnWeek', hoursOnWeek)
      })
    });
  },
  [UPDATE_ROTA_SHIFT]: (state, action) => {
    const {
      id,
      starts_at,
      ends_at,
      shift_type,
    } = action.payload;

    const shiftIndex = state.get('rotaShifts').findIndex(shift => shift.get('id') === id);
    const weekShiftIndex = state.get('weekRotaShifts').findIndex(shift => shift.get('id') === id);

    return state.update('rotaShifts', shifts => {
      return shifts.update(shiftIndex, shift => {
          return shift
            .set('starts_at', starts_at)
            .set('ends_at', ends_at)
            .set('shift_type', shift_type)
        });
    }).update('weekRotaShifts', shifts => {
      return shifts.update(weekShiftIndex, shift => {
          return shift
            .set('starts_at', starts_at)
            .set('ends_at', ends_at)
            .set('shift_type', shift_type)
        });
    })
  },
  [ADD_ROTA_SHIFT]: (state, action) => {
    const {
      id,
      rota,
      staff_member,
      starts_at,
      ends_at,
      shift_type,
    } = action.payload;

    const newRotaShift = {
      id,
      starts_at,
      ends_at,
      shift_type,
      staff_member: staff_member,
      rota: rota,
    }
    return state
      .update('rotaShifts', shifts => shifts.push(fromJS(newRotaShift)))
      .update('weekRotaShifts', shifts => shifts.push(fromJS(newRotaShift)));
  },
  [DELETE_ROTA_SHIFT]: (state, action) => {
    const shift_id = action.payload;
    const shiftIndex = state.get('rotaShifts').findIndex(shift => shift.get('id') === shift_id);
    const weekShiftIndex = state.get('weekRotaShifts').findIndex(shift => shift.get('id') === shift_id);

    return state.update('rotaShifts', shifts => {
      return shifts.delete(shiftIndex);
    }).update('weekRotaShifts', shifts => {
      return shifts.delete(weekShiftIndex);
    })
  },
  [OPEN_MULTIPLE_SHIFT]: (state) => {
    return state.set('isMultipleShift', true)
  },
  [CLOSE_MULTIPLE_SHIFT]: (state) => {
    return state.set('isMultipleShift', false)
  },
  [SET_MULTIPLE_SHIFT_STAFF_ID]: (state, action) => {
    return state.set('multipleShiftStaffId', action.payload)
  },
  [SET_STAFF_TYPES_FILTER]: (state, action) => {
    return state.set('staffTypesFilterIds', fromJS(action.payload))
  },
}, initialState);

export default combineReducers({
  page: rotaDailyReducer,
  form: formReducer,
})
