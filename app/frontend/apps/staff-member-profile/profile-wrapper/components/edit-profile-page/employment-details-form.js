import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form/immutable';

import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormEmployementStatus from '~/components/boss-form/boss-form-employement-status';
import notify from '~/components/global-notification';

import {updateEmploymentDetailsRequest} from '../../actions';
import {SECURITY_TYPE_ID} from '../../constants';

const validate = values => {
  const errors = {}
  return errors;
}

import {updateEmploymentDetails} from '../../requests';

let EmploymentDetailsForm = ({
    handleSubmit,
    submitting,
    staffTypes,
    accessiblePayRates,
    accessibleVenues,
    onSubmissionComplete,
    isSecurityStaff,
    dispatch,
  }) => {

  const submission = (values, dispatch) => {
    return dispatch(updateEmploymentDetailsRequest(values.toJS()))
    .catch((resp) => {
        notify('Updating Employment Details Failed', {
          interval: 5000,
          status: 'error'
        });

        const errors = resp.response.data.errors;
        if (errors) {
          window.scrollTo(0, 0);
          throw new SubmissionError(errors);
        }
      });
  }

  const renderSecurityStaffFields = () => {
    return [<Field
      key={'sia_badge_number'}
      name="sia_badge_number"
      component={BossFormInput}
      type="text"
      label="SIA badge number"
    />,
    <Field
      key={'sia_badge_expiry_date'}
      component={BossFormCalendar}
      required
      name="sia_badge_expiry_date"
      label="SIA badge expiry date"
    />]
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
        disabled={isSecurityStaff}
        optionLabel="name"
        optionValue="id"
        placeholder="Select main venue ..."
        options={accessibleVenues}
      />

      <Field
        component={BossFormSelect}
        name="other_venues"
        label="Other Venues"
        optionLabel="name"
        optionValue="id"
        multi
        placeholder="Select other venues ..."
        options={accessibleVenues}
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

      { isSecurityStaff && renderSecurityStaffFields() }

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
        options={accessiblePayRates}
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
       component={BossFormInput}
       required
       name="sage_id"
       type="text"
       label="Sage ID"
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
  onChange: (values, dispatch, props) => {
    if(values.get('staff_type') === SECURITY_TYPE_ID) {
      dispatch(change('employment-details-form', 'master_venue', null));
    }
  },
  validate,
})(EmploymentDetailsForm);

const selector = formValueSelector('employment-details-form');

const mapStateToProps = (state) => {
  return {
    isSecurityStaff: selector(state, 'staff_type') === SECURITY_TYPE_ID,
  }
};

export default connect(mapStateToProps)(EmploymentDetailsForm);
