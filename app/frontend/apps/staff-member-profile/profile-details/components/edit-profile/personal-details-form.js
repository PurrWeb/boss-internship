import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';

import {updatePersonalDetailsRequest} from '../../actions';

const validate = values => {
  const errors = {}

  return errors;
}

const submission = (values, dispatch) => {
  return dispatch(updatePersonalDetailsRequest(values.toJS())).catch((resp) => {
    const errors = resp.response.data.errors;
    if (errors) {
      throw new SubmissionError(errors);
    }
  });
}

const PersonalDetailsForm = ({
    handleSubmit,
    submitting,
    genderValues,
    ...props
  }) => {

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
        options={genderValues.toJS()}
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
