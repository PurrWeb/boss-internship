import { createSelector } from 'reselect';

export const securityShiftRequestsSelector = state =>
  state.get('securityShiftRequests');
export const rotaShiftsSelector = state => state.get('rotaShifts');
export const staffMembersSelector = state => state.get('staffMembers');

export const mappedShiftRequestsSelector = createSelector(
  rotaShiftsSelector,
  securityShiftRequestsSelector,
  staffMembersSelector,
  (rotaShifts, securityShiftRequests, staffMembers) => {
    return securityShiftRequests.map(securityShiftRequest =>
      securityShiftRequest
        .set(
          'createdShift',
          rotaShifts.find(
            rotaShift =>
              rotaShift.get('id') ===
              securityShiftRequest.get('createdShiftId'),
          ) || null,
        )
        .update(
          'createdShift',
          createdShift =>
            createdShift
              ? createdShift.set(
                  'staffMember',
                  staffMembers.find(
                    staffMember =>
                      staffMember.get('id') ===
                      createdShift.get('staffMemberId'),
                  ),
                )
              : null,
        ),
    );
  },
);

export const getPendingSecurityShiftRequests = createSelector(
  mappedShiftRequestsSelector,
  securityShiftRequests => {
    return securityShiftRequests.filter(
      securityShiftRequest => securityShiftRequest.get('status') === 'pending',
    );
  },
);

export const getCompletedSecurityShiftRequests = createSelector(
  mappedShiftRequestsSelector,
  securityShiftRequests => {
    return securityShiftRequests.filter(
      securityShiftRequest => securityShiftRequest.get('status') !== 'pending',
    );
  },
);
