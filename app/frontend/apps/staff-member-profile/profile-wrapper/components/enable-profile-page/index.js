import React from 'react';
import oFetch from 'o-fetch';

import EnableProfileForm from './enable-profile-form';
import moment from 'moment';
import safeMoment from "~/lib/safe-moment"

const EnableProfilePage = ({
    staffMember,
    accessibleVenues,
    staffTypes,
    accessiblePayRates,
    genderValues,
  }) => {

  let staffMemberData = staffMember.toJS();
  let siaBadgeExpiryDateString = staffMemberData.sia_badge_expiry_date;
  let siaBadgeExpiryDate = siaBadgeExpiryDateString ? safeMoment.uiDateParse(siaBadgeExpiryDateString) : moment();
  let dateOfBirthString = staffMemberData.date_of_birth;
  let dateOfBirth = dateOfBirthString ? safeMoment.uiDateParse(dateOfBirthString) : null;

  const initialValues = {
    firstName: staffMember.get('first_name'),
    surname: staffMember.get('surname'),
    avatar: staffMember.get('avatar'),
    gender: staffMember.get('gender'),
    dateOfBirth: dateOfBirth,
    mainVenue: staffMember.get('master_venue'),
    otherVenues: staffMember.get('other_venues'),
    startsAt: safeMoment.uiDateParse(staffMember.get('starts_at')),
    emailAddress: staffMember.get('email'),
    address: staffMember.get('address'),
    country: staffMember.get('country'),
    county: staffMember.get('county'),
    postcode: staffMember.get('postcode'),
    phoneNumber: staffMember.get('phone_number'),
    staffType: staffMember.get('staff_type'),
    nationalInsuranceNumber: staffMember.get('national_insurance_number'),
    dayPreferenceNote: staffMember.get('day_preference'),
    hoursPreferenceNote: staffMember.get('hours_preference'),
    payRate: staffMember.get('pay_rate'),
    employmentStatus: staffMember.get('status_statement'),
    siaBadgeNumber: staffMember.get('sia_badge_number'),
    siaBadgeExpiryDate: siaBadgeExpiryDate,
    sageId: oFetch(staffMemberData, 'sageId')
  }
  return (
    <EnableProfileForm
      initialValues={initialValues}
      staffMember={staffMember}
      genderValues={genderValues}
      staffTypes={staffTypes}
      payRates={accessiblePayRates}
      venues={accessibleVenues}
    />
  )
}


export default EnableProfilePage;
