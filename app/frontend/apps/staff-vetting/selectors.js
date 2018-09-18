import { createSelector } from 'reselect';
import getVenueColor from '~/lib/get-venue-color';

export const venuesSelector = venues => venues;

export const getVenueTypes = createSelector(venuesSelector, venues => {
  return venues
    .map(v => {
      return v.set('color', getVenueColor(v.get('id')));
    })
    .sortBy(v => v.get('id'))
    .toJS();
});
