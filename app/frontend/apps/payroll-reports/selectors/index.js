import { createSelector } from 'reselect';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import _ from 'underscore';
import safeMoment from '~/lib/safe-moment';

export const staffTypesSelector = state => state.get('staffTypes');
export const financeReportsSelector = state => state.get('financeReports');
export const staffMembersSelector = state => state.get('staffMembers');
export const payRateFilterSelector = state => state.getIn(['page', 'payRateFilter']);
export const startDateSelector = state => state.getIn(['page', 'startDate']);

export const getFilteredFinanceReports = createSelector(
  financeReportsSelector,
  payRateFilterSelector,
  (financeReports, payRateFilter) => {
    if (payRateFilter === 'all') {
      return financeReports;
    } else {
      return financeReports.filter(financeReport => {
        const payRateType = _.last(financeReport.get('payRateDescription').split('/')) === 'h' ? 'hourly' : 'weekly';
        return payRateType === payRateFilter;
      });
    }
  },
);

export const getStaffTypesWithStaffMembers = createSelector(
  staffTypesSelector,
  staffMembersSelector,
  (staffTypes, staffMembers) => {
    return staffTypes.map(staffType => {
      const staffMembersForStaffType = staffMembers
        .filter(staffMember => staffMember.get('staffTypeId') === staffType.get('id'))
        .groupBy(staffMember => staffMember.get('id'));
      return staffType.set('staffMembers', staffMembersForStaffType);
    });
  },
);

export const getReportsWithCalculations = createSelector(getFilteredFinanceReports, financeReports =>
  financeReports.map(financeReport => {
    const owedHours = financeReport.get('owedHoursMinuteCount') / 60;
    const weeklyHours =
      financeReport.get('mondayHoursCount') +
      financeReport.get('tuesdayHoursCount') +
      financeReport.get('wednesdayHoursCount') +
      financeReport.get('thursdayHoursCount') +
      financeReport.get('fridayHoursCount') +
      financeReport.get('saturdayHoursCount') +
      financeReport.get('sundayHoursCount');
    const payRateType = _.last(financeReport.get('payRateDescription').split('/')) === 'h' ? 'hourly' : 'weekly';
    const acessories = financeReport.get('accessoriesCents') / 100;
    return financeReport
      .set('weeklyHours', weeklyHours)
      .set('owedHours', owedHours)
      .set('acessories', acessories)
      .set('payRateType', payRateType);
  }),
);

export const getWeekDates = createSelector(startDateSelector, startDate => {
  const date = safeMoment.uiDateParse(startDate);
  return Immutable.List([1, 2, 3, 4, 5, 6, 7]).map(weekDay => {
    const currentDate = date.isoWeekday(weekDay);
    return currentDate.format('DD-MM-YYYY');
  });
});

export const getStaffTypesWithFinanceReports = createSelector(
  getStaffTypesWithStaffMembers,
  getReportsWithCalculations,
  (staffTypes, financeReports) =>
    staffTypes.map(staffType => {
      const reports = financeReports.filter(financeReport =>
        staffType.get('staffMembers').has(financeReport.get('staffMemberId')),
      );
      return staffType.set('reports', reports);
    }),
);