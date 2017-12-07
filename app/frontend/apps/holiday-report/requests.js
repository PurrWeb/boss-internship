import http from '~/lib/request-api';
import utils from '~/lib/utils';
import oFetch from 'o-fetch';

export const createHolidayRequest = (values) => {
  const {staffMember, startDate, endDate, holidayType, note} = values;
  const staffMemberId = oFetch(staffMember, 'value');

  return http().post(`/api/v1/staff_members/${staffMemberId}/holidays`, {
    start_date: startDate ? startDate.format(utils.commonDateFormat) : null,
    end_date: endDate ? endDate.format(utils.commonDateFormat) : null,
    holiday_type: holidayType,
    note: note,
  });
}
