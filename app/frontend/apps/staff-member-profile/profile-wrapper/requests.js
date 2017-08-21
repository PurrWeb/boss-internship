import axios from 'axios';
import moment from 'moment';

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
    avatar_url,
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
    email_address
  } = payload;

  let requestParams = {
    pin_code: pinCode,
    gender: gender,
    phone_number,
    date_of_birth,
    starts_at: moment(starts_at).format("DD-MM-YYYY"),
    national_insurance_number,
    hours_preference_note: hours_preference,
    avatar_base64: avatar_url,
    day_preference_note: day_preference,
    employment_status: status_statement,
    staff_type_id: staff_type.value,
    main_venue_id: master_venue.value,
    pay_rate_id: pay_rate.value,
    other_venue_ids: other_venues,
    email_address,
    first_name,
    surname,
    address,
    postcode,
    country,
    county
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
  } = payload;

  return http.post(`/api/v1/staff_members/${staffMemberId}/update_employment_details`, {
    national_insurance_number,
    hours_preference_note: hours_preference,
    day_preference_note: day_preference,
    starts_at: moment(starts_at).format("DD-MM-YYYY"),
    employment_status,
    pay_rate_id: pay_rate,
    master_venue_id: master_venue,
    other_venue_ids: other_venues,
    staff_type_id: staff_type,
  });
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
    gender: gender,
    date_of_birth: moment(date_of_birth).format("DD-MM-YYYY"),
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
