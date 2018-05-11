import { createSelector } from 'reselect';
import { SecurityVenue } from './models';

export const securityVenuesSelector = state => state.get('securityVenues');

export const getSecurityVenues = createSelector(securityVenuesSelector, securityVenues => {
  return securityVenues.map(
    securityVenue =>
      new SecurityVenue({
        id: securityVenue.get('id'),
        name: securityVenue.get('name'),
        address: securityVenue.get('address'),
        lat: securityVenue.get('lat'),
        lng: securityVenue.get('lng'),
      }),
  );
});
