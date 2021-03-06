export const PAYROLL_REPORT_STATUS_DONE_STATUS = 'done';
export const PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE = 'show_all';
export const PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE = 'salary_only';
export const PAYROLL_REPORT_WITH_OWED_HOURS_FILTER_TYPE = 'with_owed_hours';
export const PAYROLL_REPORT_WITH_HOLIDAYS_FILTER_TYPE = 'with_holidays';
export const PAYROLL_REPORT_WITH_ACCESSORIES_FILTER_TYPE = 'with_accessories';

export const FILTER_TABS = [
  PAYROLL_REPORT_WITH_ACCESSORIES_FILTER_TYPE,
  PAYROLL_REPORT_WITH_HOLIDAYS_FILTER_TYPE,
  PAYROLL_REPORT_WITH_OWED_HOURS_FILTER_TYPE,
  PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE,
  PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE,
];

export const FILTER_TITLES = {
  [PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE]: 'Show All',
  [PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE]: 'Salary Only',
  [PAYROLL_REPORT_WITH_OWED_HOURS_FILTER_TYPE]: 'Owed Hours Only',
  [PAYROLL_REPORT_WITH_HOLIDAYS_FILTER_TYPE]: 'Paid Holidays Only',
  [PAYROLL_REPORT_WITH_ACCESSORIES_FILTER_TYPE]: 'Accessories Only',
};
