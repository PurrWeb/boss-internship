import axios from 'axios';
import safeMoment from "~/lib/safe-moment";
import {SECURITY_TYPE_ID} from './constants';
import oFetch from 'o-fetch';
import utils from "~/lib/utils";

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

  const staffMemberId = oFetch(payload, 'staffMemberId');
  const staffType = oFetch(payload, 'staffType');
  const siaBadgeNumber = oFetch(payload, 'siaBadgeNumber');
  const siaBadgeExpiryDate = oFetch(payload, 'siaBadgeExpiryDate');
  const address = oFetch(payload, 'address');
  const avatar = oFetch(payload, 'avatar');
  const country = oFetch(payload, 'country');
  const county = oFetch(payload, 'county');
  const dateOfBirth = safeMoment.iso8601Parse(oFetch(payload, 'dateOfBirth')).format(utils.apiDateFormat);
  const dayPreferenceNote = oFetch(payload, 'dayPreferenceNote');
  const emailAddress = oFetch(payload, 'emailAddress');
  const firstName = oFetch(payload, 'firstName');
  const surname = oFetch(payload, 'surname');
  const gender = oFetch(payload, 'gender');
  const hoursPreferenceNote = oFetch(payload, 'hoursPreferenceNote');
  const mainVenue = oFetch(payload, 'mainVenue');
  const nationalInsuranceNumber = oFetch(payload, 'nationalInsuranceNumber');
  const otherVenues = oFetch(payload, 'otherVenues');
  const payRate = oFetch(payload, 'payRate');
  const phoneNumber = oFetch(payload, 'phoneNumber');
  const postcode = oFetch(payload, 'postcode');
  const employmentStatus = oFetch(payload, 'employmentStatus');
  const sageId = oFetch(payload, 'sageId');
  const startsAt = safeMoment.iso8601Parse(oFetch(payload, 'startsAt')).format(utils.apiDateFormat)

  let requestParams = {
    staffMemberId,
    staffType,
    siaBadgeNumber,
    siaBadgeExpiryDate,
    employmentStatus,
    address,
    avatar,
    country,
    county,
    dateOfBirth,
    dayPreferenceNote,
    emailAddress,
    firstName,
    surname,
    gender,
    hoursPreferenceNote,
    mainVenue,
    nationalInsuranceNumber,
    otherVenues,
    payRate,
    phoneNumber,
    postcode,
    sageId,
    staffType,
    startsAt
  };

  if (staffType === SECURITY_TYPE_ID) {
    const siaBadgeExpiryDate = oFetch(payload, 'siaBadgeExpiryDate');
    const siaBadgeNumber = oFetch(payload, 'siaBadgeNumber');
    requestParams['siaBadgeNumber'] = siaBadgeNumber;
    requestParams['siaBadgeExpiryDate'] = safeMoment.uiDateParse(siaBadgeExpiryDate).format(utils.apiDateFormat)
  } else {
    requestParams['siaBadgeNumber'] = null;
    requestParams['siaBadgeExpiryDate'] = null;
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
