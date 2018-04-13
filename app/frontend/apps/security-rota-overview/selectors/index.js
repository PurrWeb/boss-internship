import { createSelector } from 'reselect';
import oFetch from 'o-fetch';
import RotaDate from '~/lib/rota-date';
import safeMoment from '~/lib/safe-moment';
import getGroupedShiftBreakdownByTimeWithId from '~/lib/get-grouped-shift-breakdown-by-time-with-id';
import getVenueColor from '~/lib/get-venue-color';

export const GRANULARITY = 30;

const getRotaDate = date => {
  return new RotaDate({
    dateOfRota: safeMoment.uiDateParse(date).toDate(),
  });
};

export const staffMembersSelector = state =>
  state.getIn(['securityRotaOverview', 'staffMembers']);
export const dateSelector = state => state.getIn(['securityRotaDay', 'date']);
export const venuesSelector = state =>
  state.getIn(['securityRotaOverview', 'venues']);
export const rotasSelector = state => state.getIn(['securityRotaDay', 'rotas']);
export const rotaShiftsSelector = state =>
  state.getIn(['securityRotaDay', 'rotaShifts']);

export const getVenueStaffCountList = createSelector(
  venuesSelector,
  rotasSelector,
  rotaShiftsSelector,
  (venues, rotas, rotaShifts) =>
    rotas
      .map(rota => {
        const rotaData = rota.toJS();
        const rotaId = oFetch(rotaData, 'id');
        const venueId = oFetch(rotaData, 'venue');

        const venue = venues.find(venue => oFetch(venue.toJS(), 'id') === venueId).toJS();
        const currentRotaShifts = rotaShifts.filter(
          shift => oFetch(shift.toJS(), 'rota') === rotaId,
        ).toJS();
        const currentRotaStaffCount = currentRotaShifts.reduce(
          (acc, shift) => acc.add(oFetch(shift, 'staffMemberId')),
          new Set([]),
        ).size;

        return {
          id: venueId,
          name: oFetch(venue, 'name'),
          count: currentRotaStaffCount,
        };
      })
      .filter(item => oFetch(item, 'count') > 0),
);

export const getBreakdown = createSelector(
  rotaShiftsSelector,
  staffMembersSelector,
  rotasSelector,
  dateSelector,
  (rotaShifts, staffMembers, rotas, date) => {
    const rotaDate = getRotaDate(date);

    return getGroupedShiftBreakdownByTimeWithId({
      shifts: rotaShifts.toJS(),
      staff: staffMembers.toJS(),
      granularityInMinutes: GRANULARITY,
      rotaDate: rotaDate,
      groupsById: rotas.toJS().reduce((acc, rota) => {
        acc[rota.id] = rota;
        return acc;
      }, {}),
      getGroupFromShift: shift => {
        const rota = rotas.toJS().find(rota => rota.id === shift.rota);
        return rota;
      },
    });
  },
);

export const getGroups = createSelector(
  rotasSelector,
  venuesSelector,
  (rotas, venues) =>
    rotas.toJS().map((rota, i) => {
      const venue = venues.toJS().find(venue => venue.id === rota.venue);
      return {
        ...rota,
        name: venue.name,
        color: getVenueColor(venue.id),
      };
    }),
);
