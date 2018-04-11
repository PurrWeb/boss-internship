import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import humanize from 'string-humanize';
import notify from '~/components/global-notification';

import {updatePersonalDetailsRequest} from '../../actions';

const validate = values => {
  const errors = {}

  return errors;
}

const PersonalDetailsForm = ({
    handleSubmit,
    submitting,
    genderValues,
    onSubmissionComplete,
    ...props
  }) => {

  const submission = (values, dispatch) => {
    return dispatch(updatePersonalDetailsRequest(values.toJS()))
      .catch((resp) => {
        notify('Updating Personal Details Failed', {
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

  const capitalizedGenderValues = genderValues.map(gender => humanize(gender));

  return (
    <form
      onSubmit={handleSubmit(submission)}
    >
      <header className="boss-content-switcher__header">
        <h2 className="boss-content-switcher__title">Personal Details</h2>
      </header>
      
      <Field
        component={BossFormInput}
        required
        name="first_name"
        type="text"
        label="First Name"
      />
      <Field
        component={BossFormInput}
        required
        name="surname"
        type="text"
        label="Surname"
      />
      <Field
        component={BossFormSelect}
        name="gender"
        required
        label="Gender"
        placeholder="Select gender ..."
        options={capitalizedGenderValues.toJS()}
      />
      <Field
        name="date_of_birth"
        component={BossFormCalendar}
        label="Date of birth"
        required
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

export default reduxForm({
  form: 'personal-details-form',
  validate,
})(PersonalDetailsForm);
