import { createSelector } from 'reselect';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';

export const securityShiftRequestsSelector = state => state.get('securityShiftRequests');
export const rotaShiftsSelector = state => state.get('rotaShifts');
export const staffMembersSelector = state => state.get('staffMembers');
export const shiftRequestsPermissionsSelector = state => state.getIn(['permissions', 'shiftRequests']);
export const weekStartDateSelector = state => state.getIn(['pageOptions', 'startDate']);
export const weekEndDateSelector = state => state.getIn(['pageOptions', 'endDate']);

export const inWeekShiftRequestsSelector = createSelector(
  securityShiftRequestsSelector,
  weekStartDateSelector,
  weekEndDateSelector,
  (securityShiftRequests, weekStartDate, weekEndDate) => {
    return securityShiftRequests.filter(securityShiftRequest => {
      const jsSecurityShiftRequest = securityShiftRequest.toJS();
      const mWeekStartDate = safeMoment.uiDateParse(weekStartDate);
      const mWeekEndsDate = safeMoment.uiDateParse(weekEndDate);
      const mShiftStartsAt = safeMoment.iso8601Parse(oFetch(jsSecurityShiftRequest, 'startsAt'));
      const mShiftEndsAt = safeMoment.iso8601Parse(oFetch(jsSecurityShiftRequest, 'startsAt'));
      return utils.shiftInRotaWeek({
        mWeekStartDate,
        mWeekEndsDate,
        mShiftStartsAt,
        mShiftEndsAt,
      });
    });
  },
);

export const mappedShiftRequestsSelector = createSelector(
  rotaShiftsSelector,
  inWeekShiftRequestsSelector,
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
  return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') === 'pending');
});

export const getCompletedSecurityShiftRequests = createSelector(mappedShiftRequestsSelector, securityShiftRequests => {
  return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') !== 'pending');
});
