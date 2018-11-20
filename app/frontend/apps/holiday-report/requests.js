import http from '~/lib/request-api';
import utils from '~/lib/utils';
import oFetch from 'o-fetch';

export const createHolidayRequest = values => {
  const { staffMember, startDate, endDate, holidayType, note } = values;
  const staffMemberId = oFetch(staffMember, 'value');

  return http({
    successMessage: 'Holiday created successfully',
  }).post(`/api/v1/staff_members/${staffMemberId}/holidays`, {
    start_date: startDate ? startDate.format(utils.commonDateFormat) : null,
    end_date: endDate ? endDate.format(utils.commonDateFormat) : null,
    holiday_type: holidayType,
    note: note,
  });
};

export const createHolidayRequestRequest = values => {
  const { staffMember, startDate, endDate, holidayType, note } = values;
  const staffMemberId = oFetch(staffMember, 'value');

  return http({
    successMessage: 'Request created successfully. Holiday will display on this page when request is accepted',
  }).post(`/api/v1/holiday-requests`, {
    start_date: startDate ? startDate.format(utils.commonDateFormat) : null,
    end_date: endDate ? endDate.format(utils.commonDateFormat) : null,
    holiday_type: holidayType,
    note: note,
    staff_member_id: staffMemberId,
  });
};
