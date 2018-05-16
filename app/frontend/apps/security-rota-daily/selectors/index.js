import { createSelector } from 'reselect';
import getVenueColor from '~/lib/get-venue-color';

export const rotasSelector = state => state.getIn(['page', 'rotas']);
export const venueIdsForCurrentDaySelector = state => state.getIn(['page', 'venueIdsForCurrentDay']);
export const venuesSelector = state => state.getIn(['page', 'venues']);
export const staffTypesSelector = state => state.getIn(['page', 'staffTypes']);
export const rotaDateSelector = state => state.getIn(['page', 'date']);
export const rotaShiftsSelector = state => state.getIn(['page', 'rotaShifts']);
export const staffMembersSelector = state => state.getIn(['page', 'staffMembers']);
export const venuesFilterIdsSelector = state => state.getIn(['page', 'venuesFilterIds']);

export const getVenueTypes = createSelector(
  venuesSelector,
  venueIdsForCurrentDaySelector,
  rotaShiftsSelector,
  (venues, venueIdsForCurrentDay, rotaShifts) => {
    return venues.filter(v => venueIdsForCurrentDay.has(`${v.get('type')}_${v.get('id')}`)).map(v => {
      return v.set('color', getVenueColor(v.get('id'))).set(
        'count',
        rotaShifts.reduce((acc, rotaShift) => {
          if (rotaShift.get('venueId') === v.get('id') && rotaShift.get('venueType') === v.get('type')) {
            return acc + 1;
          }
          return acc;
        }, 0),
      );
    });
  },
);

export const getRotaShifts = createSelector(
  rotaShiftsSelector,
  venuesFilterIdsSelector,
  (rotaShifts, venuesFilterIds) => {
    if (venuesFilterIds.size === 0) {
      return rotaShifts.toJS();
    } else {
      return rotaShifts
        .filter(rotaShift => venuesFilterIds.includes(`${rotaShift.get('venueType')}_${rotaShift.get('venueId')}`))
        .toJS();
    }
  },
);
