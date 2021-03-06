import { createSelector } from 'reselect';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import _ from 'underscore';
import safeMoment from '~/lib/safe-moment';
import {
  PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE,
  PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE,
  PAYROLL_REPORT_WITH_ACCESSORIES_FILTER_TYPE,
  PAYROLL_REPORT_WITH_HOLIDAYS_FILTER_TYPE,
  PAYROLL_REPORT_WITH_OWED_HOURS_FILTER_TYPE,
  FILTER_TABS,
} from '../constants';

export const staffTypesSelector = state => state.get('staffTypes');
export const financeReportsSelector = state => state.get('financeReports');
export const staffMembersSelector = state => state.get('staffMembers');
export const filterTypeSelector = state => state.getIn(['page', 'filterType']);
export const startDateSelector = state => state.getIn(['page', 'startDate']);

const filterFactory = payRollReports => {
  const filter = {
    [PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE]() {
      return payRollReports;
    },
    [PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE]() {
      return payRollReports.filter(payRollReport => {
        const payRateType = _.last(payRollReport.get('payRateDescription').split('/')) === 'h' ? 'hourly' : 'weekly';
        return payRateType === 'weekly';
      });
    },
    [PAYROLL_REPORT_WITH_OWED_HOURS_FILTER_TYPE]() {
      return payRollReports.filter(payRollReport => payRollReport.get('owedHoursMinuteCount') > 0);
    },
    [PAYROLL_REPORT_WITH_HOLIDAYS_FILTER_TYPE]() {
      return payRollReports.filter(payRollReport => payRollReport.get('holidayDaysCount') > 0);
    },
    [PAYROLL_REPORT_WITH_ACCESSORIES_FILTER_TYPE]() {
      return payRollReports.filter(payRollReport => payRollReport.get('accessoriesCents') !== 0);
    },
  };

  return filterType => {
    return filter[filterType]();
  };
};

export const getFilteredFinanceReports = createSelector(
  financeReportsSelector,
  filterTypeSelector,
  (financeReports, filterType) => {
    if (!FILTER_TABS.includes(filterType)) {
      throw new Error(`Unsupported filter type ${filterType} encountered in ${JSON.stringify(FILTER_TABS)}`);
    }
    return filterFactory(financeReports)(filterType);
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
  (staffTypes, financeReports) => {
    return staffTypes.map(staffType => {
      const reports = financeReports.filter(financeReport =>
        staffType.get('staffMembers').has(financeReport.get('staffMemberId')),
      );
      return staffType.set('reports', reports);
    });
  },
);
