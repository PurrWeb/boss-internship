import React from 'react';

import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormTextarea from '~/components/boss-form/boss-form-textarea';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
// import BossFormDateRangePicker from '~/components/boss-form/boss-form-daterange-picker';
import {addHoliday} from '../actions';

import {
  HOLIDAYS_OPTIONS
} from '../constants'

const validate = values => {
  const errors = {}
  
  if (!values.get('holidays_type')) {
    errors.holidsyType = "You must fill holidays type"
  }

  if (!values.get('start_date')) {
    errors.startDate = "You mast fill start date"
  }

  if (!values.get('ends_date')) {
    errors.endDate = "You mast fill end date"
  }

  return errors;
}

const submission = (values, dispatch) => {
  return dispatch(addHoliday(values.toJS())).catch((resp) => {
    const errors = resp.response.data.errors;
    if (errors) {
      throw new SubmissionError(errors);
    }
  });
}


const HolidaysForm = ({
    handleSubmit,
  }) => {

  return (
    <form
      className="boss-form"
      onSubmit={handleSubmit(submission)}
    >
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            name="start_date"
            component={BossFormCalendar}
            label="Starts at"
            required
          />
        </div>
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            name="ends_date"
            component={BossFormCalendar}
            label="Ends at"
            required
          />
        </div>
        <div className="boss-form__field boss-form__field_layout_third">
          <Field
            component={BossFormSelect}
            name="holidays_type"
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
        <button type="submit" className="boss-button boss-button_role_add boss-form__submit">
          Add Holiday
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'holiday-form',
  validate
})(HolidaysForm);