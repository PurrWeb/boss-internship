import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form/immutable';

import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormEmployementStatus from '~/components/boss-form/boss-form-employement-status';

import {updateEmploymentDetailsRequest} from '../../actions';

const validate = values => {
  const errors = {}
  return errors;
}
import {updateEmploymentDetails} from '../../requests';

let EmploymentDetailsForm = ({
    handleSubmit,
    submitting,
    venues,
    staffTypes,
    payRates,
    onSubmissionComplete,
    staffType,
  }) => {
  
  const submission = (values, dispatch) => {
    return dispatch(updateEmploymentDetailsRequest(values.toJS()))
      .then((resp) => {
        onSubmissionComplete(resp);
      })
      .catch((resp) => {
        const errors = resp.response.data.errors;
        if (errors) {
          window.scrollTo(0, 0);
          throw new SubmissionError(errors);
        }
      });
  }
  
  return (
    <form
      onSubmit={handleSubmit(submission)}
    >
      <header className="boss-content-switcher__header">
        <h2 className="boss-content-switcher__title">Employment Details</h2>
      </header>
      <Field
        component={BossFormSelect}
        name="master_venue"
        required
        label="Main Venue"
        optionLabel="name"
        optionValue="id"
        placeholder="Select main venue ..."
        options={venues.toJS()}
      />
      
      <Field
        component={BossFormSelect}
        name="other_venues"
        label="Other Venues"
        optionLabel="name"
        optionValue="id"
        multi
        placeholder="Select other venues ..."
        options={venues.toJS()}
      />

      <Field
        component={BossFormSelect}
        required
        name="staff_type"
        label="Staff Type"
        optionLabel="name"
        optionValue="id"
        placeholder="Select staff type ..."
        options={staffTypes.toJS()}
      />

      <Field
        name="starts_at"
        component={BossFormCalendar}
        label="Start Date"
        required
      />

      <Field
        component={BossFormSelect}
        required
        name="pay_rate"
        label="Pay Rate"
        optionLabel="name"
        optionValue="id"
        placeholder="Select pay rate ..."
        options={payRates.toJS()}
      />

      <Field
        name="day_preference"
        component={BossFormInput}
        type="text"
        label="Day Preference"
      />

      <Field
        name="hours_preference"
        component={BossFormInput}
        type="text"
        label="Hours Preference"
      />

      <Field
        component={BossFormInput}
        required
        name="national_insurance_number"
        type="text"
        label="National Insurance Number"
      />

      <Field
        component={BossFormEmployementStatus}
        required
        name="employment_status"
        label="Starter Employement Status Statement"
      />

      <div className="boss-form__field boss-form__field_justify_end">
        <button
          className="boss-button boss-form__submit boss-form__submit_adjust_single"
          type="submit"
          disabled={submitting}
        >Save</button>
      </div>
    </form>
  )
}

EmploymentDetailsForm = reduxForm({
  form: 'employment-details-form',
  validate,
})(EmploymentDetailsForm);

const selector = formValueSelector('employment-details-form')

const mapStateToProps = (state) => {
  return {
    staffType: selector(state, 'staff_type'),
  }
};

export default connect(mapStateToProps)(EmploymentDetailsForm);
