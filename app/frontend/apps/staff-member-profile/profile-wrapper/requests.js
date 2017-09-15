import axios from 'axios';
import moment from 'moment';
import {SECURITY_TYPE_ID} from './constants';

const accessToken = window.boss.store.accessToken;

const http = axios.create();

export const updateAvatar = ({staffMemberId, avatarUrl}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_avatar`, {
    avatar_base64: avatarUrl,
  });
}

export const disableStaffMember = ({staffMemberId, neverRehire, reason}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;

  return http.post(`/api/v1/staff_members/${staffMemberId}/disable`, {
    never_rehire: !!neverRehire,
    disable_reason: reason,
  });
}

export const enableStaffMember = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;

  const {
    staffMemberId,
    pinCode,
    gender,
    phone_number,
    date_of_birth,
    starts_at,
    national_insurance_number,
    hours_preference,
    avatar,
    day_preference,
    status_statement,
    first_name,
    pay_rate,
    surname,
    staff_type,
    master_venue,
    other_venues,
    address,
    postcode,
    country,
    county,
    email_address,
    sia_badge_number,
    sia_badge_expiry_date,
  } = payload;

  let requestParams = {
    pin_code: pinCode,
    gender: gender,
    phone_number,
    date_of_birth,
    starts_at: moment(starts_at).format("DD-MM-YYYY"),
    national_insurance_number,
    hours_preference_note: hours_preference,
    avatar_base64: avatar,
    day_preference_note: day_preference,
    employment_status: status_statement,
    staff_type_id: staff_type,
    pay_rate_id: pay_rate,
    other_venue_ids: other_venues,
    email_address,
    first_name,
    surname,
    address,
    postcode,
    country,
    county,
    main_venue_id: master_venue,
  }

  if (staff_type === SECURITY_TYPE_ID) {
    requestParams = {
      ...requestParams,
      sia_badge_number,
      sia_badge_expiry_date: moment(sia_badge_expiry_date).format("DD-MM-YYYY")
    }
  } else {
    requestParams = {
      ...requestParams,
      sia_badge_number: null,
      sia_badge_expiry_date: null,
    }
  }

  return http.post(`/api/v1/staff_members/${staffMemberId}/enable`, requestParams);
}

export const updateEmploymentDetails = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;
  const {
    staffMemberId,
    national_insurance_number,
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
    hours_preference_note: hours_preference,
    day_preference_note: day_preference,
    starts_at: moment(starts_at).format("DD-MM-YYYY"),
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
      sia_badge_expiry_date: moment(sia_badge_expiry_date).format("DD-MM-YYYY")
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
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;

  const {
    staffMemberId,
    gender,
    date_of_birth,
    first_name,
    surname
  } = payload;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_personal_details`, {
    gender: gender ? gender.toLowerCase() : null,
    date_of_birth: date_of_birth ? moment(date_of_birth).format("DD-MM-YYYY") : null,
    first_name,
    surname
  });
}

export const updateContactDetails = (payload) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;
  
  const {
    staffMemberId,
  } = payload;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_contact_details`, {
    ...payload
  });
}
