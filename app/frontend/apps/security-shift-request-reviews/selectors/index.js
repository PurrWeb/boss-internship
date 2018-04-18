import { createSelector } from 'reselect';

export const securityShiftRequestsSelector = state =>
  state.get('securityShiftRequests');

export const venuesSelector = state =>
  state.get('venues');

export const getVenueById = createSelector(
  venuesSelector,
  venues => venueId => venues.find(venue => venue.get('id') === venueId),
);

export const getPendingSecurityShiftRequests = createSelector(
  securityShiftRequestsSelector,
  securityShiftRequests => {
    return securityShiftRequests
      .filter(
        securityShiftRequest =>
          securityShiftRequest.get('status') === 'pending',
      )
      .sort((a, b) => a.get('venueId') - b.get('venueId'))
      .groupBy(securityShiftRequest => securityShiftRequest.get('venueId'));
  },
);

export const getCompletedSecurityShiftRequests = createSelector(
  securityShiftRequestsSelector,
  securityShiftRequests => {
    return securityShiftRequests
      .filter(
        securityShiftRequest =>
          securityShiftRequest.get('status') !== 'pending',
      )
      .sort((a, b) => a.get('venueId') - b.get('venueId'))
      .groupBy(securityShiftRequest => securityShiftRequest.get('venueId'));
  },
);
