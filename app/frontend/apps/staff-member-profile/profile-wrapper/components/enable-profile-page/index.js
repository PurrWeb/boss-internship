import React from 'react';

import EnableProfileForm from './enable-profile-form';
import moment from 'moment';

const EnableProfilePage = ({
    staffMember,
    venues,
    staffTypes,
    payRates,
    genderValues,
  }) => {

  const initialValues = {
    first_name: staffMember.get('first_name'),
    surname: staffMember.get('surname'),
    avatar: staffMember.get('avatar'),
    gender: staffMember.get('gender'),
    date_of_birth: moment(staffMember.get('date_of_birth')),
    master_venue: staffMember.get('master_venue'),
    other_venues: staffMember.get('other_venues'),
    starts_at: moment(staffMember.get('starts_at'), 'DD-MM-YYYY'),
    email_address: staffMember.get('email'),
    address: staffMember.get('address'),
    country: staffMember.get('country'),
    county: staffMember.get('county'),
    postcode: staffMember.get('postcode'),
    phone_number: staffMember.get('phone_number'),
    staff_type: staffMember.get('staff_type'),
    national_insurance_number: staffMember.get('national_insurance_number'),
    day_preference: staffMember.get('day_preference'),
    hours_preference: staffMember.get('hours_preference'),
    pay_rate: staffMember.get('pay_rate'),
    status_statement: staffMember.get('status_statement'),
    sia_badge_number: staffMember.get('sia_badge_number'),
    sia_badge_expiry_date: moment(staffMember.get('sia_badge_expiry_date') || moment(), 'DD-MM-YYYY'),
  }
  return (
    <EnableProfileForm
      initialValues={initialValues}
      staffMember={staffMember}
      genderValues={genderValues}
      staffTypes={staffTypes}
      payRates={payRates}
      venues={venues}
    />
  )
}


export default EnableProfilePage;