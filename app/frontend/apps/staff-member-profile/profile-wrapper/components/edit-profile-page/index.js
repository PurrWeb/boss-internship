import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import safeMoment from "~/lib/safe-moment";
import oFetch from "o-fetch";

import EmploymentDetailsForm from './employment-details-form';
import PersonalDetailsForm from './personal-details-form';
import ContactDetailsForm from './contact-details-form';
import humanize from 'string-humanize';

const EditProfilePage = ({
    accessibleVenues,
    staffTypes,
    accessiblePayRates,
    genderValues,
    staffMember,
    onSubmissionComplete,
  }) => {
  let staffMemberData = staffMember.toJS();
  const contactDetailsFormInitial = {
    email_address: oFetch(staffMemberData, 'email'),
    phone_number: oFetch(staffMemberData, 'phone_number'),
    address: oFetch(staffMemberData, 'address'),
    postcode: oFetch(staffMemberData, 'postcode'),
    country: oFetch(staffMemberData, 'country'),
    county: oFetch(staffMemberData, 'county'),
  }

  let sDateOfBirth = oFetch(staffMemberData, 'date_of_birth');
  const personaletailsFormInitial = {
    first_name: oFetch(staffMemberData, 'first_name'),
    surname: oFetch(staffMemberData, 'surname'),
    gender: humanize(oFetch(staffMemberData, 'gender')),
    date_of_birth: sDateOfBirth && safeMoment.uiDateParse(sDateOfBirth)
  }

  let sSiaBadgeExpiryDate = oFetch(staffMemberData, 'sia_badge_expiry_date');
  let mSiaBadgeExpiryDate = sSiaBadgeExpiryDate && safeMoment.uiDateParse(sSiaBadgeExpiryDate);
  const employmentDetailsFormInitial = {
    master_venue: oFetch(staffMemberData, 'master_venue'),
    other_venues: oFetch(staffMemberData, 'other_venues'),
    sage_id: oFetch(staffMemberData, 'sageId'),
    starts_at: safeMoment.uiDateParse(oFetch(staffMemberData, 'starts_at')),
    staff_type: oFetch(staffMemberData, 'staff_type'),
    sia_badge_number: oFetch(staffMemberData, 'sia_badge_number'),
    sia_badge_expiry_date: mSiaBadgeExpiryDate,
    national_insurance_number: oFetch(staffMemberData, 'national_insurance_number'),
    day_preference: oFetch(staffMemberData, 'day_preference'),
    hours_preference: oFetch(staffMemberData, 'hours_preference'),
    pay_rate: oFetch(staffMemberData, 'pay_rate'),
    employment_status: oFetch(staffMemberData, 'status_statement'),
  }

  return (
    <div className="boss-content-switcher">
      <Tabs
        className="boss-content-switcher__inner"
        selectedTabClassName="boss-content-switcher__nav-link_state_active"
      >
        <TabList className="boss-content-switcher__nav boss-content-switcher__side">
          <Tab className="boss-content-switcher__nav-link">Employment Details</Tab>
          <Tab className="boss-content-switcher__nav-link">Personal Details</Tab>
          <Tab className="boss-content-switcher__nav-link">Contact Details</Tab>
        </TabList>

        <section className="boss-content-switcher__chapters">
          <TabPanel
            selectedClassName="boss-content-switcher__chapter_state_visible"
            className="boss-content-switcher__chapter"
          >
            <EmploymentDetailsForm
              initialValues={employmentDetailsFormInitial}
              staffTypes={staffTypes}
              onSubmissionComplete={onSubmissionComplete}
              accessiblePayRates={accessiblePayRates}
              accessibleVenues={accessibleVenues}
            />
          </TabPanel>
          <TabPanel
            selectedClassName="boss-content-switcher__chapter_state_visible"
            className="boss-content-switcher__chapter"
          >
            <PersonalDetailsForm
              initialValues={personaletailsFormInitial}
              venues={accessibleVenues}
              staffTypes={staffTypes}
              payRates={accessiblePayRates}
              genderValues={genderValues}
              onSubmissionComplete={onSubmissionComplete}
            />
          </TabPanel>
          <TabPanel
            selectedClassName="boss-content-switcher__chapter_state_visible"
            className="boss-content-switcher__chapter"
          >
            <ContactDetailsForm
              initialValues={contactDetailsFormInitial}
              onSubmissionComplete={onSubmissionComplete}
            />
          </TabPanel>
        </section>
      </Tabs>
    </div>
  )
}

export default EditProfilePage;
