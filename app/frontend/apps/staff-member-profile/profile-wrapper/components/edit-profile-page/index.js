import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';

import EmploymentDetailsForm from './employment-details-form';
import PersonalDetailsForm from './personal-details-form';
import ContactDetailsForm from './contact-details-form';

const EditProfilePage = ({
    venues,
    staffTypes,
    payRates,
    genderValues,
    staffMember,
    onSubmissionComplete,
  }) => {

  const contactDetailsFormInitial = {
    email_address: staffMember.get('email'),
    phone_number: staffMember.get('phone_number'),
    address: staffMember.get('address'),
    postcode: staffMember.get('postcode'),
    country: staffMember.get('country'),
    county: staffMember.get('county'),
  }

  const personaletailsFormInitial = {
    first_name: staffMember.get('first_name'),
    surname: staffMember.get('surname'),
    gender: staffMember.get('gender'),
    date_of_birth: moment(staffMember.get('date_of_birth'), 'DD-MM-YYYY'),
  }

  const employmentDetailsFormInitial = {
    master_venue: staffMember.get('master_venue'),
    other_venues: staffMember.get('other_venues').toJS(),
    starts_at: moment(staffMember.get('starts_at'), 'DD-MM-YYYY'),
    staff_type: staffMember.get('staff_type'),
    sia_badge_number: staffMember.get('sia_badge_number'),
    sia_badge_expiry_date: moment(staffMember.get('sia_badge_expiry_date') || moment(), 'DD-MM-YYYY'),
    national_insurance_number: staffMember.get('national_insurance_number'),
    day_preference: staffMember.get('day_preference'),
    hours_preference: staffMember.get('hours_preference'),
    pay_rate: staffMember.get('pay_rate'),
    employment_status: staffMember.get('status_statement'),
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
              venues={venues}
              staffTypes={staffTypes}
              onSubmissionComplete={onSubmissionComplete}
              payRates={payRates}
            />
          </TabPanel>
          <TabPanel
            selectedClassName="boss-content-switcher__chapter_state_visible"
            className="boss-content-switcher__chapter"
          >
            <PersonalDetailsForm
              initialValues={personaletailsFormInitial}
              venues={venues}
              staffTypes={staffTypes}
              payRates={payRates}
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
