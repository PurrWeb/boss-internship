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
    const weeklyHours =
      financeReport.get('mondayHoursCount') +
      financeReport.get('tuesdayHoursCount') +
      financeReport.get('wednesdayHoursCount') +
      financeReport.get('thursdayHoursCount') +
      financeReport.get('fridayHoursCount') +
      financeReport.get('saturdayHoursCount') +
      financeReport.get('sundayHoursCount');
    const owedHours = financeReport.get('owedHoursMinuteCount') / 60;
    const payRateType = _.last(financeReport.get('payRateDescription').split('/')) === 'h' ? 'hourly' : 'weekly';
    const payRateAmount = _.first(financeReport.get('payRateDescription').split('/')).slice(1);
    const acessories = financeReport.get('accessoriesCents') / 100;
    const total = financeReport.get('totalCents') / 100;
    return financeReport
      .set('weeklyHours', weeklyHours)
      .set('owedHours', owedHours)
      .set('acessories', acessories)
      .set('payRateType', payRateType)
      .set('total', total);
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
      const total = reports.reduce((acc, report) => acc + report.get('total'), 0);
      const allReady =
        reports.filter(report => report.get('status') === 'incomplete').size === 0 &&
        reports.filter(report => report.get('status') === 'ready').size > 0;
      return staffType
        .set('total', total)
        .set('reports', reports)
        .set('allReady', allReady);
    }),
);

export const getAllReady = createSelector(getStaffTypesWithFinanceReports, staffTypesWithFinanceReports =>
  staffTypesWithFinanceReports.reduce((acc, staffType) => {
    return acc || staffType.get('allReady');
  }, false),
);
