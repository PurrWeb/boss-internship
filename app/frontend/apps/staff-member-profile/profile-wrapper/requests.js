import safeMoment from '~/lib/safe-moment';
import { SECURITY_TYPE_ID } from './constants';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import http from '~/lib/request-api';
import { apiRoutes } from '~/lib/routes';
export const markRetakeAvatarRequest = staffMemberId => {
  return http(
    {
      successMessage: 'Force Retake Successfully',
      errorMessage: 'Force Retake Failed',
    },
    5000,
  ).post(apiRoutes.markRetakeAvatar.getPath(staffMemberId));
};

export const updateAvatar = ({ staffMemberId, avatarUrl }) => {
  return http({ successMessage: 'Avatar Updated Successfully', errorMessage: 'Updating Avatar Failed' }, 5000).post(
    `/api/v1/staff_members/${staffMemberId}/update_avatar`,
    {
      avatar_base64: avatarUrl,
    },
  );
};

export const disableStaffMember = ({ staffMemberId, neverRehire, reason }) => {
  return http(
    { successMessage: 'Staff Member Disabled Successfully', errorMessage: 'Disabling Staff Member Failed' },
    5000,
  ).post(`/api/v1/staff_members/${staffMemberId}/disable`, {
    never_rehire: !!neverRehire,
    disable_reason: reason,
  });
};

export const enableStaffMemberRequest = params => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const startsAt = safeMoment.iso8601Parse(oFetch(params, 'startsAt')).format(utils.apiDateFormat);

  return http(
    { successMessage: 'Staff Member Enabled Successfully', errorMessage: 'Enabling Staff Member Failed' },
    5000,
  ).post(`/api/v1/staff_members/${staffMemberId}/enable`, { startsAt });
};

export const updateEmploymentDetails = payload => {
  const {
    staffMemberId,
    national_insurance_number,
    sage_id,
    hours_preference,
    day_preference,
    starts_at,
    employment_status,
    pay_rate,
    master_venue,
    other_venues,
    staff_type,
    sia_badge_expiry_date,
    sia_badge_number,
  } = payload;

  let fields = {
    national_insurance_number,
    sage_id,
    hours_preference_note: hours_preference,
    day_preference_note: day_preference,
    starts_at: starts_at.format("DD-MM-YYYY"),
    employment_status,
    pay_rate_id: pay_rate,
    other_venue_ids: other_venues,
    staff_type_id: staff_type,
  };

  if (staff_type === SECURITY_TYPE_ID) {
    fields = {
      ...fields,
      master_venue_id: null,
      sia_badge_number,
      sia_badge_expiry_date: sia_badge_expiry_date.format('DD-MM-YYYY'),
    };
  } else {
    fields = {
      ...fields,
      sia_badge_number: null,
      sia_badge_expiry_date: null,
      master_venue_id: master_venue,
    };
  }

  return http(
    {
      successMessage: 'Staff Member Employment Details Updated Successfully',
      errorMessage: 'Updating Employment Details Failed',
    },
    5000,
  ).post(`/api/v1/staff_members/${staffMemberId}/update_employment_details`, fields);
};

export const updatePersonalDetails = payload => {
  const { staffMemberId, gender, date_of_birth, first_name, surname } = payload;

  return http(
    {
      successMessage: 'Staff Member Personal Details Updated Successfully',
      errorMessage: 'Updating Personal Details Failed',
    },
    5000,
  ).post(`/api/v1/staff_members/${staffMemberId}/update_personal_details`, {
    gender: gender ? gender.toLowerCase() : null,
    date_of_birth: date_of_birth ? date_of_birth.format("DD-MM-YYYY") : null,
    first_name,
    surname,
  });
};

export const updateContactDetails = payload => {
  const { staffMemberId } = payload;

  return http(
    {
      successMessage: 'Staff Member Contact Details Updated Successfully',
      errorMessage: 'Updating Contact Details Failed',
    },
    5000,
  ).post(`/api/v1/staff_members/${staffMemberId}/update_contact_details`, {
    ...payload,
  });
};
