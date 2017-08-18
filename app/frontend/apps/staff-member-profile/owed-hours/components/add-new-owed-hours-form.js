
import React from 'react';

import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormTextarea from '~/components/boss-form/boss-form-textarea';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormInput from '~/components/boss-form/boss-form-input';

import {addOwedHours} from '../actions';

const validate = values => {
  const errors = {}
  
  if (!values.get('date')) {
    errors.date = "You must fill date"
  }

  if (!values.get('startsAt')) {
    errors.start_time = "You mast fill start time"
  }

  if (!values.get('endsAt')) {
    errors.end_time = "You mast fill end time"
  }

  return errors;
}

const submission = (values, dispatch) => {
  return dispatch(addOwedHours(values.toJS())).catch((resp) => {
    const errors = resp.response.data.errors;
    if (errors) {
      let base = {};

      if (errors.base) {
        base = {
          _error: errors.base
        }
      }
      throw new SubmissionError({...errors, ...base});
    }
  });
}

const OwedHoursForm = ({
    error,
    handleSubmit,
    submitting
  }) => {

  const renderBaseError = (error) => {
    return (
      <div className="boss-modal-window__alert">
        <div className="boss-alert boss-alert_role_area boss-alert_context_above">
          <p className="boss-alert__text">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <form
      className="boss-form"
      onSubmit={handleSubmit(submission)}
    >
      {error && renderBaseError(error)}
      <div className="boss-form__field">
        <Field
          name="date"
          component={BossFormCalendar}
          label="Date"
          required
        />
      </div>
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_layout_half">
          <Field
            component={BossFormInput}
            name="startsAt"
            required
            label="Starts at"
          />
        </div>
        <div className="boss-form__field boss-form__field_layout_half">
          <Field
            component={BossFormInput}
            name="endsAt"
            required
            label="Ends at"
          />
        </div>
      </div>
      <Field
        component={BossFormTextarea}
        name="note"
        label="Note"
      />
      <div className="boss-form__field">
        <button type="submit"
          disabled={submitting}
          className="boss-button boss-button_role_add boss-form__submit"
        >
            Add hours
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'owed-hours-form',
  validate
})(OwedHoursForm);