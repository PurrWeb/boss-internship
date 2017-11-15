import React from 'react';
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';

import {
  InputInlineField,
  TextareaField,
  InputField,
  DateTimeField,
  SelectField
} from './form-fields';

function MessageBoardForm({ initialValues, handleSubmit, submitting, submission, venueOptions, setMessageState, setTitleState }) {
  return (
    <form onSubmit={handleSubmit(submission)} className="boss-form">
      <Fields
        names={ ["venueIds", 'toAllVenues']}
        label="Venue"
        component={ SelectField }
        props={{ options: venueOptions }}
      />

      <Fields
        names={['date', 'time']}
        label="Publish Date"
        component={ DateTimeField }
      />

      <Field
        name="title"
        label="Title"
        component={ InputInlineField }
      />

      <Field
        name="message"
        label="Message"
        component={ TextareaField }
      />

      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last"></div>

        <div className="boss-form__field boss-form__field_layout_max boss-form__field_justify_mobile-center">
          <button
            type="submit"
            disabled={submitting}
            className="boss-button boss-form__submit"
          >Save</button>
        </div>
      </div>
    </form>
  )
};

export default reduxForm({
  form: 'DashboardMessageForm',
})(MessageBoardForm);
