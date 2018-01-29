import React from 'react';
import { Field, Fields, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';

import {
  InputField,
  DateField,
  TimeField,
  SelectField,
  CheckboxGroupField,
  CheckboxField,
  DateTimeField
} from '../shared/form-fields';

import {
  BossFormTextArea
} from '~/components/boss-form';

function MusicTaskForm({ initialValues, message, handleSubmit, submitting, submission, venueOptions, setMessageState, setTitleState, actionValue }) {
  $('#message-preview').html(message);

  return (
    <form onSubmit={handleSubmit(submission)} className="boss-form">
      <Field
        name="title"
        label="Title"
        component={ InputField }
      />

      <Fields
        names={['date', 'time']}
        label="Start Date"
        component={ DateTimeField }
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

      <div className="boss-form__group">
        <Field
          name="days"
          label="Days"
          options={ ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'] }
          component={ CheckboxGroupField }
        />
      </div>

      <div className="boss-form__group boss-form__group_role_board">
        <Field
          name="facebook_announcement"
          label="Facebook Announcement"
          component={ CheckboxField }
        />
      </div>

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

MusicTaskForm = reduxForm({
  form: 'music-task-form',
})(MusicTaskForm);

const selector = formValueSelector('music-task-form');

export default connect(state => {
  const description = selector(state, 'description')

  return {
    description,
  };
})(MusicTaskForm);
