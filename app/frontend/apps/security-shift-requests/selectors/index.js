import { createSelector } from 'reselect';

export const securityShiftRequestsSelector = state =>
  state
    .get('securityShiftRequests')
    .map(securityShiftRequest =>
      securityShiftRequest.set(
        'createdShift',
        rotaShiftsSelector(state).find(rotaShift => rotaShift.get('id') === securityShiftRequest.createdShiftId) ||
          null,
      ),
    );

export const rotaShiftsSelector = state => state.get('rotaShifts');

export const getPendingSecurityShiftRequests = createSelector(securityShiftRequestsSelector, securityShiftRequests => {
  return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') === 'pending');
});

export const getCompletedSecurityShiftRequests = createSelector(
  securityShiftRequestsSelector,
  securityShiftRequests => {
    return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') !== 'pending');
  },
);
