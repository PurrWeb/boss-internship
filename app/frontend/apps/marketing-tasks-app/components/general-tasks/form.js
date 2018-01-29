import React from 'react';
import { Field, Fields, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';

import {
  InputField,
  DateField,
  SelectField,
} from '../shared/form-fields';

import {
  BossFormTextArea
} from '~/components/boss-form';

function GeneralTaskForm({ initialValues, message, handleSubmit, submitting, submission, venueOptions, setMessageState, setTitleState, actionValue }) {
  $('#message-preview').html(message);

  return (
    <form onSubmit={handleSubmit(submission)} className="boss-form">
      <Field
        name="title"
        label="Title"
        component={ InputField }
      />

      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_layout_half">
          <Field
            name="venue"
            label="Venue"
            component={ SelectField }
            props={{ options: venueOptions }}
          />
        </div>

        <div className="boss-form__field boss-form__field_layout_half">
          <Field
            name="due_at"
            label="Due Date"
            component={ DateField }
          />
        </div>
      </div>

      <Field
        name="description"
        label="Extra Information"
        component={ BossFormTextArea }
        required={ false }
      />

      <div className="boss-form__field">
        <button
          disabled={submitting}
          className="boss-button boss-form__submit"
          type="submit"
        >{ actionValue }</button>
      </div>
    </form>
  )
};

GeneralTaskForm = reduxForm({
  form: 'general-task-form',
})(GeneralTaskForm);

const selector = formValueSelector('general-task-form');

export default connect(state => {
  const description = selector(state, 'description')

  return {
    description,
  };
})(GeneralTaskForm);
