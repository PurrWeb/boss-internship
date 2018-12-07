import { createSelector } from 'reselect';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import _ from 'underscore';
import safeMoment from '~/lib/safe-moment';
import {
  FINANCE_REPORT_SHOW_ALL_FILTER_TYPE,
  FINANCE_REPORT_SALARY_ONLY_FILTER_TYPE,
  FINANCE_REPORT_WITH_ACCESSORIES_FILTER_TYPE,
  FINANCE_REPORT_WITH_HOLIDAYS_FILTER_TYPE,
  FINANCE_REPORT_WITH_OWED_HOURS_FILTER_TYPE,
  FILTER_TABS,
} from '../constants';

export const staffTypesSelector = state => state.get('staffTypes');
export const financeReportsSelector = state => state.get('financeReports');
export const staffMembersSelector = state => state.get('staffMembers');
export const filterTypeSelector = state => state.getIn(['page', 'filterType']);
export const startDateSelector = state => state.getIn(['page', 'startDate']);
export const permissionsSelector = state => state.getIn(['page', 'permissions']);

const filterFactory = financeReports => {
  const filter = {
    [FINANCE_REPORT_SHOW_ALL_FILTER_TYPE]() {
      return financeReports;
    },
    [FINANCE_REPORT_SALARY_ONLY_FILTER_TYPE]() {
      return financeReports.filter(financeReport => {
        const payRateType = _.last(financeReport.get('payRateDescription').split('/')) === 'h' ? 'hourly' : 'weekly';
        return payRateType === 'weekly';
      });
    },
    [FINANCE_REPORT_WITH_OWED_HOURS_FILTER_TYPE]() {
      return financeReports.filter(financeReport => financeReport.get('owedHoursMinuteCount') > 0);
    },
    [FINANCE_REPORT_WITH_HOLIDAYS_FILTER_TYPE]() {
      return financeReports.filter(financeReport => financeReport.get('holidayDaysCount') > 0);
    },
    [FINANCE_REPORT_WITH_ACCESSORIES_FILTER_TYPE]() {
      return financeReports.filter(financeReport => financeReport.get('accessoriesCents') !== 0);
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
    const payRateAmount = _.first(financeReport.get('payRateDescription').split('/')).slice(1);
    const acessories = financeReport.get('accessoriesCents') / 100;
    const total = financeReport.get('total');
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
  (staffTypes, financeReports) => {
    return staffTypes.map(staffType => {
      const reports = financeReports.filter(financeReport =>
        staffType.get('staffMembers').has(financeReport.get('staffMemberId')),
      );
      const reportsJS = reports.toJS();
      const total = reportsJS.reduce((acc, report) => acc + oFetch(report, 'total'), 0);
      const readyReportsJS = reportsJS.filter(report => {
        return oFetch(report, 'status') === 'ready';
      });
      const requiringUpdateReportsJS = reportsJS.filter(report => {
        return oFetch(report, 'status') === 'requiring_update';
      });

      const completableReadyReports = [];
      const incompletableReadyReports = [];
      readyReportsJS.forEach(report => {
        const completionDateReached = oFetch(report, 'completionDateReached');
        const hoursPending = oFetch(report, 'hoursPending');
        const total = oFetch(report, 'total');

        if (hoursPending || !completionDateReached) {
          incompletableReadyReports.push(report);
        } else {
          completableReadyReports.push(report);
        }
      });

      const staffTypeEmpty = reportsJS.length == 0;
      const noIncompletableReportsExist = incompletableReadyReports.length === 0;
      const completeableReportsExist = completableReadyReports.length > 0;

      const allReady = staffTypeEmpty || (noIncompletableReportsExist && completeableReportsExist);
      return staffType
        .set('total', total)
        .set('reports', reports)
        .set('allReady', allReady);
    });
  },
);

export const getAllReady = createSelector(getStaffTypesWithFinanceReports, staffTypesWithFinanceReports => {
  return staffTypesWithFinanceReports.every(staffType => {
    return staffType.get('allReady') == true;
  });
});
