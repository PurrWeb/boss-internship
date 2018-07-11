import { createSelector } from 'reselect';
import Immutable from 'immutable';
import RotaDate from '~/lib/rota-date';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';

export const securityShiftRequestsSelector = state => state.get('securityShiftRequests');
export const rotaShiftsSelector = state => state.get('rotaShifts');
export const staffMembersSelector = state => state.get('staffMembers');
export const shiftRequestsPermissionsSelector = state => state.getIn(['permissions', 'shiftRequests']);
export const weekStartDateSelector = state => state.getIn(['pageOptions', 'startDate']);
export const weekEndDateSelector = state => state.getIn(['pageOptions', 'endDate']);
export const chosenDateSelector = state => state.getIn(['pageOptions', 'chosenDate']);
export const venueIdSelector = state => state.getIn(['pageOptions', 'venueId']);

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


export const getShiftRequestForEachWeekDay = createSelector(
  weekStartDateSelector,
  mappedShiftRequestsSelector,
  (uiDate, securityShiftRequests) => {
    const date = safeMoment.uiDateParse(uiDate);

    return Immutable.List([1, 2, 3, 4, 5, 6, 7, 8]).map(weekDay => {
      if (weekDay === 8) {
        return Immutable.Map({
          weekDay: 'All',
          date: 'All',
          count: securityShiftRequests.size,
          shiftRequests: securityShiftRequests,
        });
      }
      const currentDate = date.isoWeekday(weekDay);

      const shiftRequests = securityShiftRequests.filter(shiftRequest => {
        const currentRotaDate = new RotaDate({
          dateOfRota: currentDate.toDate(),
        });
        return currentRotaDate.isShiftBelongsToRotaDay({
          shiftStartsAt: shiftRequest.get('startsAt'),
        });
      });
      const count = shiftRequests.size;
      return Immutable.Map({
        weekDay: currentDate.format('dddd'),
        date: currentDate.format('DD-MM-YYYY'),
        count,
        shiftRequests,
      });
    });
  },
);

export const getWeekDaysWithCount = createSelector(
  getShiftRequestForEachWeekDay,
  (shiftRequestsForEachWeekDay) => {
      return shiftRequestsForEachWeekDay.map(day =>
        Immutable.Map({
          weekDay: day.get('weekDay'),
          date: day.get('date'),
          count: day.get('count'),
        }),
      );
  },
);


export const getShiftRequestsForChosenDate = createSelector(
  chosenDateSelector,
  getShiftRequestForEachWeekDay,
  (chosenDate, shiftRequestsForEachWeekDay) => {
      return shiftRequestsForEachWeekDay
        .find(day => day.get('date') === chosenDate)
        .get('shiftRequests');
  },
);


export const getPendingSecurityShiftRequests = createSelector(getShiftRequestsForChosenDate, securityShiftRequests => {
  return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') === 'pending');
});

export const getCompletedSecurityShiftRequests = createSelector(getShiftRequestsForChosenDate, securityShiftRequests => {
  return securityShiftRequests.filter(securityShiftRequest => securityShiftRequest.get('status') !== 'pending');
});