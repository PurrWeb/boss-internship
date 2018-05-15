import { fromJS, Map, List, Set } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';
import SafeMoment from '~/lib/safe-moment';
import utils, { BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE } from '~/lib/utils';
import oFetch from 'o-fetch';

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
  ADD_SECURITY_VENUE_SHIFT,
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
        securityVenues,
        weekRotas,
        weekRotaShifts,
        securityVenueShifts,
        weekSecurityVenueShifts,
      } = action.payload;

      const imWeekSecurityVenueShifts = fromJS(weekSecurityVenueShifts);
      const imWeekRotaShifts = fromJS(weekRotaShifts).concat(imWeekSecurityVenueShifts);
      const imHolidays = fromJS(holidays);
      const imSecurityVenues = fromJS(securityVenues);
      const imVenues = fromJS(venues).concat(imSecurityVenues);
      const imRotas = fromJS(rotas);
      const imSecurityVenueShifts = fromJS(securityVenueShifts);
      const imWeekRotas = fromJS(weekRotas);
      const imStaffMembers = fromJS(staffMembers).map(staffMember => {
        const { weekRotaShifts, hoursOnWeek, weekVenueIds } = utils.calculateSecurityRotaShift(
          staffMember,
          imWeekRotaShifts,
          imWeekRotas,
          imVenues,
        );

        const holidays = imHolidays.filter(holiday => holiday.get(['staffMemberId']) === staffMember.get('id'));
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
      const rotaShiftsWithVenueId = fromJS(rotaShifts)
        .concat(imSecurityVenueShifts)
        .map(shift => {
          let venueId;
          if (shift.get('venueType') === BOSS_VENUE_TYPE) {
            const rota = imRotas.find(r => shift.get('rota') === r.get('id'));
            venueId = rota.get('venue');
          } else if (shift.get('venueType') === SECURITY_VENUE_TYPE) {
            venueId = shift.get('securityVenueId');
          } else {
            throw new Error('Unknow venue type');
          }
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
        .set('venueIdsForCurrentDay', venueIdsForCurrentDay)
        .set('securityVenueShifts', fromJS(securityVenueShifts));
    },
    [ADD_NEW_SHIFT]: state => {
      return state.set('isAddingNewShift', true);
    },
    [CANCEL_ADD_NEW_SHIFT]: state => {
      return state.set('isAddingNewShift', false);
    },
    [SHOW_GRAPH_DETAILS]: (state, action) => {
      return state.set('graphDetails', fromJS(action.payload)).set('isGraphDetailsOpen', true);
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
          const { weekRotaShifts, hoursOnWeek, weekVenueIds } = utils.calculateSecurityRotaShift(
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
      const { id, startsAt, endsAt, shiftType, venueType } = action.payload;
      const venueCombinedId = oFetch(action, 'payload.venueId');
      const [type, stringVenueId] = venueCombinedId.split('_');
      const venueId = Number(stringVenueId);
      if (![BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE].includes(type)) {
        throw new Error('Unknow venue type');
      }
      const shiftIndex = state.get('rotaShifts').findIndex(shift => shift.get('id') === id);
      const weekShiftIndex = state.get('weekRotaShifts').findIndex(shift => shift.get('id') === id);

      return state
        .update('rotaShifts', shifts => {
          return shifts.update(shiftIndex, shift => {
            return shift
              .set('startsAt', startsAt)
              .set('endsAt', endsAt)
              .set('venueId', venueId)
              .set('shiftType', shiftType)
              .set('venueType', venueType)
          });
        })
        .update('weekRotaShifts', shifts => {
          return shifts.update(weekShiftIndex, shift => {
            return shift
              .set('startsAt', startsAt)
              .set('endsAt', endsAt)
              .set('shiftType', shiftType)
              .set('venueType', venueType)
          });
        });
    },
    [ADD_ROTA_SHIFT]: (state, action) => {
      const { id, rota, staffMemberId, startsAt, endsAt, shiftType, venueId, venueType } = action.payload;

      const newRotaShift = {
        id,
        startsAt,
        endsAt,
        shiftType,
        staffMemberId,
        rota,
        venueId,
        venueType,
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
        .update('rotas', rotas => (isRotaExists ? rotas : rotas.push(fromJS(newRota))))
        .update('weekRotas', weekRotas => (isRotaExists ? weekRotas : weekRotas.push(fromJS(newRota))))
        .set('venueIdsForCurrentDay', venueIdsForCurrentDay.add(venueId));
    },
    [ADD_SECURITY_VENUE_SHIFT]: (state, action) => {
      const securityVenueShift = oFetch(action, 'payload');

      return state.update('rotaShifts', shifts => shifts.push(fromJS(securityVenueShift)));
    },
    [DELETE_ROTA_SHIFT]: (state, action) => {
      const { shiftId, venueType } = action.payload;

      return state
        .update('rotaShifts', rotaShifts =>
          rotaShifts.filter(shift => !(shift.get('id') === shiftId && shift.get('venueType') === venueType)),
        )
        .update('weekRotaShifts', weekRotaShifts =>
          weekRotaShifts.filter(shift => !(shift.get('id') === shiftId && shift.get('venueType') === venueType)),
        );
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
