import { createSelector } from 'reselect';
import safeMoment from '~/lib/safe-moment';
export const HOLIDAY_TYPE = 'holiday';
export const HOLIDAY_REQUEST_TYPE = 'holiday_request';

const holidaysSelector = state => state.getIn(['holidays','holidays']).map(holiday => holiday.set('type', HOLIDAY_TYPE));
const holidayRequestsSelector = state => state.getIn(['holidays','holidayRequests']).map(holidayRequest => holidayRequest.set('type', HOLIDAY_REQUEST_TYPE));

export const getHolidaysData = createSelector(
  holidaysSelector,
  holidayRequestsSelector,
  (
    holidays,
    holidayRequests,
  ) => holidayRequests.concat(holidays).sort((a, b) => {
    const mA = safeMoment.uiDateParse(a.get('start_date'));
    const mB = safeMoment.uiDateParse(b.get('start_date'));

    if (mA.isBefore(mB)) { return -1; }
    if (mA.isAfter(mB)) { return 1; }
    if (mA.isSame(mB)) { return 0; }
  }));
