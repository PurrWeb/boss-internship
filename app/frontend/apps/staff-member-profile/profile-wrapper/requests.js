import axios from 'axios';
import safeMoment from "~/lib/safe-moment";
import {SECURITY_TYPE_ID} from './constants';

const accessToken = window.boss.accessToken;

const http = axios.create();

export const updateAvatar = ({staffMemberId, avatarUrl}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_avatar`, {
    avatar_base64: avatarUrl,
  });
}

export const disableStaffMember = ({staffMemberId, neverRehire, reason}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  return http.post(`/api/v1/staff_members/${staffMemberId}/disable`, {
    never_rehire: !!neverRehire,
    disable_reason: reason,
  });
}

export const enableStaffMember = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  const {
    staffMemberId,
    staffType,
    siaBadgeNumber,
    siaBadgeExpiryDate,
  } = payload;

  const values = {...payload, startsAt: safeMoment.iso8601Parse(payload.startsAt).format("DD-MM-YYYY")}

  let requestParams = {}

  if (staffType === SECURITY_TYPE_ID) {
    requestParams = {
      ...values,
      siaBadgeNumber,
      siaBadgeExpiryDate: safeMoment.uiDateParse(siaBadgeExpiryDate).format("DD-MM-YYYY")
    }
  } else {
    requestParams = {
      ...values,
      siaBadgeNumber: null,
      siaBadgeExpiryDate: null,
    }
  }

  return http.post(`/api/v1/staff_members/${staffMemberId}/enable`, requestParams);
}

export const updateEmploymentDetails = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
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
    starts_at: safeMoment.iso8601Parse(starts_at).format("DD-MM-YYYY"),
    employment_status,
    pay_rate_id: pay_rate,
    other_venue_ids: other_venues,
    staff_type_id: staff_type,
  }

  if (staff_type === SECURITY_TYPE_ID) {
    fields = {
      ...fields,
      master_venue_id: null,
      sia_badge_number,
      sia_badge_expiry_date: safeMoment.uiDateParse(sia_badge_expiry_date).format("DD-MM-YYYY")
    }
  } else {
    fields = {
      ...fields,
      sia_badge_number: null,
      sia_badge_expiry_date: null,
      master_venue_id: master_venue
    }
  }
  
  return http.post(`/api/v1/staff_members/${staffMemberId}/update_employment_details`, fields);
}

export const updatePersonalDetails = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  const {
    staffMemberId,
    gender,
    date_of_birth,
    first_name,
    surname
  } = payload;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_personal_details`, {
    gender: gender ? gender.toLowerCase() : null,
    date_of_birth: date_of_birth ? safeMoment.uiDateParse(date_of_birth).format("DD-MM-YYYY") : null,
    first_name,
    surname
  });
}

export const updateContactDetails = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  
  const {
    staffMemberId,
  } = payload;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_contact_details`, {
    ...payload
  });
}
