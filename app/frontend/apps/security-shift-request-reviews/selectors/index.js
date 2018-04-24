import { createSelector } from 'reselect';

export const shiftRequestsPermissionsSelector = state => state.getIn(['permissions', 'shiftRequests']);
export const securityShiftRequestsSelector = state => state.get('securityShiftRequests');
export const rotaShiftsSelector = state => state.get('rotaShifts');
export const venuesSelector = state => state.get('venues');
export const staffMembersSelector = state => state.get('staffMembers');

export const getVenueById = createSelector(venuesSelector, venues => venueId =>
  venues.find(venue => venue.get('id') === venueId),
);

export const mappedShiftRequestsSelector = createSelector(
  rotaShiftsSelector,
  securityShiftRequestsSelector,
  staffMembersSelector,
  shiftRequestsPermissionsSelector,
  (rotaShifts, securityShiftRequests, staffMembers, shiftRequestsPermissions) => {
    return securityShiftRequests.map(securityShiftRequest =>
      securityShiftRequest
        .set(
          'permissions',
          shiftRequestsPermissions.find((permission, key) => {
            return key == securityShiftRequest.get('id');
          }),
        )
        .set(
          'createdShift',
          rotaShifts.find(rotaShift => rotaShift.get('id') === securityShiftRequest.get('createdShiftId')) || null,
        )
        .update(
          'createdShift',
          createdShift =>
            createdShift
              ? createdShift.set(
                  'staffMember',
                  staffMembers.find(staffMember => staffMember.get('id') === createdShift.get('staffMemberId')),
                )
              : null,
        ),
    );
  },
);

export const getPendingSecurityShiftRequests = createSelector(mappedShiftRequestsSelector, securityShiftRequests => {
  return securityShiftRequests
    .filter(securityShiftRequest => securityShiftRequest.get('status') === 'pending')
    .sort((a, b) => a.get('venueId') - b.get('venueId'))
    .groupBy(securityShiftRequest => securityShiftRequest.get('venueId'));
});

export const getCompletedSecurityShiftRequests = createSelector(mappedShiftRequestsSelector, securityShiftRequests => {
  return securityShiftRequests
    .filter(securityShiftRequest => securityShiftRequest.get('status') !== 'pending')
    .sort((a, b) => a.get('venueId') - b.get('venueId'))
    .groupBy(securityShiftRequest => securityShiftRequest.get('venueId'));
});
