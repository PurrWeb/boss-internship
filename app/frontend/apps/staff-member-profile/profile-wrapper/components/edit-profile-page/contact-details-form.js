import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormInput from '~/components/boss-form/boss-form-input';
import notify from '~/components/global-notification';

import {updateContactDetailsRequest} from '../../actions';

const validate = values => {
  const errors = {}
  
  return errors;
}

const ContactDetailsForm = ({
    handleSubmit,
    submitting,
    onSubmissionComplete
  }) => {
 
  const submission = (values, dispatch) => {
    return dispatch(updateContactDetailsRequest(values.toJS()))
      .catch((resp) => {
        notify('Updating Staff Member Contact Details was Failed', {
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
        name="email_address"
        type="text"
        label="Email"
      />
      <Field
        component={BossFormInput}
        required
        name="phone_number"
        type="text"
        label="Phone number"
      />
      <Field
        component={BossFormInput}
        required
        name="address"
        type="text"
        label="Address"
      />
      <Field
        component={BossFormInput}
        required
        name="postcode"
        type="text"
        label="Postcode"
      />

      <Field
        component={BossFormInput}
        required
        name="country"
        type="text"
        label="Country"
      />

      <Field
        component={BossFormInput}
        required
        name="county"
        type="text"
        label="County"
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
  form: 'contact-details-form',
  validate,
})(ContactDetailsForm);
