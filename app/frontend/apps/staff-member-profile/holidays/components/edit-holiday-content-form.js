import React from 'react';

import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormTextarea from '~/components/boss-form/boss-form-textarea';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';

import {editHoliady} from '../actions';

import {
  HOLIDAYS_OPTIONS
} from '../constants'

const validate = values => {
  const errors = {}
  
  if (!values.get('holidaysType')) {
    errors.holidaysType = "You must fill holidays type"
  }

  if (!values.get('startDate')) {
    errors.startDate = "You must fill start date"
  }

  if (!values.get('endDate')) {
    errors.endDate = "You must fill end date"
  }

  return errors;
}

const submission = (values, dispatch) => {
  return dispatch(editHoliady(values.toJS())).catch((resp) => {
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


const EditHolidayForm = ({
    error,
    handleSubmit,
    submitting,
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
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            name="startDate"
            component={BossFormCalendar}
            label="Starts at"
            required
          />
        </div>
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            name="endDate"
            component={BossFormCalendar}
            label="Ends at"
            required
          />
        </div>
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            component={BossFormSelect}
            name="holidaysType"
            required
            label="Holiday Type"
            optionLabel="label"
            optionValue="value"
            placeholder="Select holiday type ..."
            options={HOLIDAYS_OPTIONS}
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
            Update Holiday
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'edit-holiday-form',
  validate
})(EditHolidayForm);
