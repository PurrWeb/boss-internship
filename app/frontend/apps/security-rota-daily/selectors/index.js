import { createSelector } from 'reselect';
import getVenueColor from '~/lib/get-venue-color';

export const rotasSelector = state => state.getIn(['page', 'rotas']);
export const venueIdsForCurrentDaySelector = state =>
  state.getIn(['page', 'venueIdsForCurrentDay']);
export const venuesSelector = state => state.getIn(['page', 'venues']);
export const staffTypesSelector = state => state.getIn(['page', 'staffTypes']);
export const rotaDateSelector = state => state.getIn(['page', 'date']);
export const rotaShiftsSelector = state => state.getIn(['page', 'rotaShifts']);
export const staffMembersSelector = state =>
  state.getIn(['page', 'staffMembers']);
export const venuesFilterIdsSelector = state =>
  state.getIn(['page', 'venuesFilterIds']);

export const getVenueTypes = createSelector(
  venuesSelector,
  venueIdsForCurrentDaySelector,
  (venues, venueIdsForCurrentDay) =>
    venues
      .filter(v => venueIdsForCurrentDay.has(v.get('id')))
      .map(v => v.set('color', getVenueColor(v.get('id'))))
      .toJS(),
);

export const getRotaShifts = createSelector(
  rotaShiftsSelector,
  venuesFilterIdsSelector,
  (rotaShifts, venuesFilterIds) => {
    if (venuesFilterIds.size === 0) {
      return rotaShifts.toJS();
    } else {
      return rotaShifts
        .filter(rotaShift => venuesFilterIds.includes(rotaShift.get('venueId')))
        .toJS();
    }
  },
);
