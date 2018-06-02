import { createSelector } from 'reselect';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import moment from 'moment';
import RotaDate from '~/lib/rota-date';
import getVenueColor from '~/lib/get-venue-color';
import staffMembers from '../../../reducers/staff-member';
import rotaShifts from '../../hours-confirmation/redux/rota-shifts';
import { isShiftRequestOverlapped } from '../utils';

export const shiftRequestsPermissionsSelector = state => state.getIn(['permissions', 'shiftRequests']);
export const startDateSelector = state => oFetch(state.get('page'), 'startDate');
export const chosenDateSelector = state => oFetch(state.get('page'), 'chosenDate');
export const selectedVenuesSelector = state => oFetch(state.get('page'), 'selectedVenues');
export const weekShiftRequestsSelector = state =>
  state
    .get('weekShiftRequests')
    .map(weekShiftRequest =>
      weekShiftRequest.set(
        'permissions',
        shiftRequestsPermissionsSelector(state).find((shiftRequestPermission, id) => id == weekShiftRequest.get('id')),
      ),
    );
export const venuesSelector = state => state.get('venues');
export const weekRotasSelector = state => state.get('weekRotas');
export const staffMembersSelector = state => state.get('staffMembers');
export const weekRotaShiftsSelector = state => state.get('weekRotaShifts');

export const assigningShiftRequestSelector = state => state.get('assigningShiftRequest');

export const getShiftRequestForEachWeekDay = createSelector(
  startDateSelector,
  weekShiftRequestsSelector,
  (uiDate, securityShiftRequests) => {
    const date = safeMoment.uiDateParse(uiDate);

    return Immutable.List([1, 2, 3, 4, 5, 6, 7, 8]).map(weekDay => {
      if (weekDay === 8) {
        return Immutable.Map({
          weekDay: 'All',
          date: 'All',
          count: securityShiftRequests.size,
          shiftRequests: securityShiftRequests,
        });
      }
      const currentDate = date.isoWeekday(weekDay);

      const shiftRequests = securityShiftRequests.filter(shiftRequest => {
        const currentRotaDate = new RotaDate({
          dateOfRota: currentDate.toDate(),
        });
        return currentRotaDate.isShiftBelongsToRotaDay({
          shiftStartsAt: shiftRequest.get('startsAt'),
        });
      });
      const count = shiftRequests.size;
      return Immutable.Map({
        weekDay: currentDate.format('dddd'),
        date: currentDate.format('DD-MM-YYYY'),
        count,
        shiftRequests,
      });
    });
  },
);

export const getShiftRequestsForChosenDate = createSelector(
  chosenDateSelector,
  selectedVenuesSelector,
  getShiftRequestForEachWeekDay,
  venuesSelector,
  (chosenDate, selectedVenues, shiftRequestsForEachWeekDay, venues) => {
    if (selectedVenues.length === 0) {
      return shiftRequestsForEachWeekDay
        .find(day => day.get('date') === chosenDate)
        .get('shiftRequests')
        .map(shiftRequest =>
          shiftRequest.set(
            'venueName',
            venues.find(venue => venue.get('id') === shiftRequest.get('venueId')).get('name'),
          ),
        );
    } else {
      return shiftRequestsForEachWeekDay
        .find(day => day.get('date') === chosenDate)
        .get('shiftRequests')
        .filter(shiftRequest => selectedVenues.includes(shiftRequest.get('venueId')))
        .map(shiftRequest =>
          shiftRequest.set(
            'venueName',
            venues.find(venue => venue.get('id') === shiftRequest.get('venueId')).get('name'),
          ),
        );
    }
  },
);

export const getWeekDaysWithCount = createSelector(
  selectedVenuesSelector,
  getShiftRequestForEachWeekDay,
  (selectedVenues, shiftRequestsForEachWeekDay) => {
    if (selectedVenues.length === 0) {
      return shiftRequestsForEachWeekDay.map(day =>
        Immutable.Map({
          weekDay: day.get('weekDay'),
          date: day.get('date'),
          count: day.get('count'),
        }),
      );
    } else {
      return shiftRequestsForEachWeekDay.map(day => {
        const count = day
          .get('shiftRequests')
          .filter(shiftRequest => selectedVenues.includes(shiftRequest.get('venueId'))).size;
        return Immutable.Map({
          weekDay: day.get('weekDay'),
          date: day.get('date'),
          count,
        });
      });
    }
  },
);

export const getVenueTypesForWeek = createSelector(
  venuesSelector,
  weekShiftRequestsSelector,
  (venues, shiftRequests) => {
    return venues
      .map(venue => {
        return venue.set('color', getVenueColor(venue.get('id')));
      })
      .filter(venue => shiftRequests.groupBy(shiftRequest => shiftRequest.get('venueId')).has(venue.get('id')));
  },
);

export const getRotaShiftsForChosenDay = createSelector(
  assigningShiftRequestSelector,
  weekRotaShiftsSelector,
  weekRotasSelector,
  (assigningShiftRequest, weekRotaShifts, weekRotas) => {
    if (!assigningShiftRequest) {
      return Immutable.List();
    }
    const rotaDate = new RotaDate({
      shiftStartsAt: assigningShiftRequest.startsAt,
    });

    return weekRotaShifts
      .filter(rotaShift => {
        return rotaDate.isShiftBelongsToRotaDay({
          shiftStartsAt: rotaShift.get('startsAt'),
        });
      })
      .map(rotaShift => {
        const venueId = weekRotas.find(rota => rota.get('id') === rotaShift.get('rotaId')).get('venueId');
        return rotaShift.set('venueId', venueId);
      });
  },
);

export const getStaffMembersWithIsConflicting = createSelector(
  staffMembersSelector,
  getRotaShiftsForChosenDay,
  assigningShiftRequestSelector,
  (staffMembers, rotaShifts, shiftRequest) => {
    if (!shiftRequest) {
      return Immutable.List();
    }
    const shiftRequestStartDate = new Date(oFetch(shiftRequest, 'startsAt'));
    const shiftRequestEndDate = new Date(oFetch(shiftRequest, 'endsAt'));

    return staffMembers.map(staffMember => {
      const staffMemberId = staffMember.get('id');

      const isOverlapped = isShiftRequestOverlapped({
        rotaShifts,
        staffMemberId,
        shiftRequestStartDate,
        shiftRequestEndDate,
      });

      const ownRotaShifts = rotaShifts.filter(rotaShift => rotaShift.get('staffMemberId') === staffMemberId);

      return staffMember.set('isOverlapped', isOverlapped).set('rotaShifts', ownRotaShifts);
    });
  },
);

export const getRotasForChosenDay = createSelector(
  getRotaShiftsForChosenDay,
  weekRotasSelector,
  (rotaShifts, weekRotas) => {
    return weekRotas.filter(rota => {
      return rotaShifts.groupBy(rotaShift => rotaShift.get('rotaId')).has(rota.get('id'));
    });
  },
);

export const getVenueTypesForChosenDate = createSelector(
  venuesSelector,
  getRotasForChosenDay,
  getRotaShiftsForChosenDay,
  (venues, rotas, rotaShifts) => {
    return venues.filter(venue => rotas.groupBy(rota => rota.get('venueId')).has(venue.get('id'))).map(venue => {
      return venue.set('color', getVenueColor(venue.get('id'))).set(
        'count',
        rotaShifts.reduce((acc, rotaShift) => {
          if (rotaShift.get('venueId') === venue.get('id')) {
            return acc + 1;
          }
          return acc;
        }, 0),
      );
    });
  },
);
