import { fromJS, Map, List, Set } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
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
  SET_VENUES_FILTER,
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
} from './constants';

const initialState = fromJS({
  accessToken: null,
  rotaDate: null,
  staffTypes: [],
  staffMembers: [],
  rotaShifts: [],
  isAddingNewShift: false,
  isGraphDetailsOpen: false,
  graphDetails: null,
  isMultipleShift: false,
  multipleShiftStaffId: null,
  venuesFilterIds: [],
});

const rotaDailyReducer = handleActions(
  {
    [INITIAL_LOAD]: (state, action) => {
      const {
        accessToken,
        date,
        holidays,
        rotaShifts,
        rotas,
        staffTypes,
        staffMembers,
        venues,
        weekRotas,
        weekRotaShifts,
      } = action.payload;

      const imWeekRotaShifts = fromJS(weekRotaShifts);
      const imHolidays = fromJS(holidays);
      const imVenues = fromJS(venues);
      const imRotas = fromJS(rotas);
      const imWeekRotas = fromJS(weekRotas);
      const imStaffMembers = fromJS(staffMembers).map(staffMember => {
        const {
          weekRotaShifts,
          hoursOnWeek,
          weekVenueIds,
        } = utils.calculateSecurityRotaShift(
          staffMember,
          imWeekRotaShifts,
          imWeekRotas,
          imVenues,
        );

        const holidays = imHolidays.filter(
          holiday => holiday.get(['staffMemberId']) === staffMember.get('id'),
        );
        const holidaysOnWeek = holidays.reduce((summ, holiday) => {
          return (summ = summ + holiday.get('days'));
        }, 0);

        return staffMember
          .set('weekRotaShifts', weekRotaShifts)
          .set('hoursOnWeek', hoursOnWeek || 0)
          .set('holidays', holidays)
          .set('holidaysOnWeek', holidaysOnWeek || 0)
          .set('weekVenueIds', weekVenueIds);
      });
      let venueIdsForCurrentDay = new Set();
      const rotaShiftsWithVenueId = fromJS(rotaShifts).map(shift => {
        const rota = imRotas.find(r => shift.get('rota') === r.get('id'));
        const venueId = rota.get('venue');
        venueIdsForCurrentDay = venueIdsForCurrentDay.add(venueId);
        return shift.set('venueId', venueId);
      });
      return state
        .set('accessToken', accessToken)
        .set('staffTypes', fromJS(staffTypes))
        .set('staffMembers', imStaffMembers)
        .set('rotas', imRotas)
        .set('rotaShifts', rotaShiftsWithVenueId)
        .set('weekRotaShifts', imWeekRotaShifts)
        .set('weekRotas', imWeekRotas)
        .set('venues', imVenues)
        .set('holidays', imHolidays)
        .set('date', date)
        .set('venueIdsForCurrentDay', venueIdsForCurrentDay);
    },
    [ADD_NEW_SHIFT]: state => {
      return state.set('isAddingNewShift', true);
    },
    [CANCEL_ADD_NEW_SHIFT]: state => {
      return state.set('isAddingNewShift', false);
    },
    [SHOW_GRAPH_DETAILS]: (state, action) => {
      return state
        .set('graphDetails', fromJS(action.payload))
        .set('isGraphDetailsOpen', true);
    },
    [CLOSE_GRAPH_DETAILS]: state => {
      return state.set('graphDetails', null).set('isGraphDetailsOpen', false);
    },
    [UPDATE_STAFF_MEMBER_SHIFT_INFO]: (state, action) => {
      const staffMemberId = action.payload;
      const staffMemberIndex = state
        .get('staffMembers')
        .findIndex(staffMember => staffMember.get('id') === staffMemberId);

      return state.update('staffMembers', staffMembers => {
        return staffMembers.update(staffMemberIndex, staffMember => {
          const imWeekRotaShifts = state.get('weekRotaShifts');
          const imWeekRotas = state.get('weekRotas');
          const imVenues = state.get('venues');
          const {
            weekRotaShifts,
            hoursOnWeek,
            weekVenueIds,
          } = utils.calculateSecurityRotaShift(
            staffMember,
            imWeekRotaShifts,
            imWeekRotas,
            imVenues,
          );
          return staffMember
            .set('weekRotaShifts', weekRotaShifts)
            .set('hoursOnWeek', hoursOnWeek || 0)
            .set('weekVenueIds', weekVenueIds);
        });
      });
    },
    [UPDATE_ROTA_SHIFT]: (state, action) => {
      const { id, startsAt, endsAt, shiftType, venueId } = action.payload;

      const shiftIndex = state
        .get('rotaShifts')
        .findIndex(shift => shift.get('id') === id);
      const weekShiftIndex = state
        .get('weekRotaShifts')
        .findIndex(shift => shift.get('id') === id);

      return state
        .update('rotaShifts', shifts => {
          return shifts.update(shiftIndex, shift => {
            return shift
              .set('startsAt', startsAt)
              .set('endsAt', endsAt)
              .set('venueId', venueId)
              .set('shiftType', shiftType);
          });
        })
        .update('weekRotaShifts', shifts => {
          return shifts.update(weekShiftIndex, shift => {
            return shift
              .set('startsAt', startsAt)
              .set('endsAt', endsAt)
              .set('shiftType', shiftType);
          });
        });
    },
    [ADD_ROTA_SHIFT]: (state, action) => {
      const {
        id,
        rota,
        staffMemberId,
        startsAt,
        endsAt,
        shiftType,
        venueId,
      } = action.payload;

      const newRotaShift = {
        id,
        startsAt,
        endsAt,
        shiftType,
        staffMemberId,
        rota,
        venueId,
      };
      const date = state.get('date');
      const isRotaExists = !!state.get('rotas').find(r => r.get('id') === rota);
      const newRota = {
        id: rota,
        venue: venueId,
        date,
        status: 'in_progress',
      };
      const venueIdsForCurrentDay = state.get('venueIdsForCurrentDay');
      return state
        .update('rotaShifts', shifts => shifts.push(fromJS(newRotaShift)))
        .update('weekRotaShifts', shifts => shifts.push(fromJS(newRotaShift)))
        .update(
          'rotas',
          rotas => (isRotaExists ? rotas : rotas.push(fromJS(newRota))),
        )
        .update(
          'weekRotas',
          weekRotas =>
            isRotaExists ? weekRotas : weekRotas.push(fromJS(newRota)),
        )
        .set('venueIdsForCurrentDay', venueIdsForCurrentDay.add(venueId));
    },
    [DELETE_ROTA_SHIFT]: (state, action) => {
      const shiftId = action.payload;
      const shiftIndex = state
        .get('rotaShifts')
        .findIndex(shift => shift.get('id') === shiftId);
      const weekShiftIndex = state
        .get('weekRotaShifts')
        .findIndex(shift => shift.get('id') === shiftId);

      return state
        .update('rotaShifts', shifts => {
          return shifts.delete(shiftIndex);
        })
        .update('weekRotaShifts', shifts => {
          return shifts.delete(weekShiftIndex);
        });
    },
    [OPEN_MULTIPLE_SHIFT]: state => {
      return state.set('isMultipleShift', true);
    },
    [CLOSE_MULTIPLE_SHIFT]: state => {
      return state.set('isMultipleShift', false);
    },
    [SET_MULTIPLE_SHIFT_STAFF_ID]: (state, action) => {
      return state.set('multipleShiftStaffId', action.payload);
    },
    [SET_VENUES_FILTER]: (state, action) => {
      return state.set('venuesFilterIds', fromJS(action.payload));
    },
  },
  initialState,
);

export default combineReducers({
  page: rotaDailyReducer,
  form: formReducer,
});
