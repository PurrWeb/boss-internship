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
  DateTimeField,
  SizeField,
  PrintField
} from '../shared/form-fields';

import {
  BossFormTextArea
} from '~/components/boss-form';

const sizes = [
  { label: 'A1', value: 'a1' },
  { label: 'A2', value: 'a2' },
  { label: 'A3', value: 'a3' },
  { label: 'A4', value: 'a4' },
  { label: 'A5', value: 'a5' },
  { label: 'A6', value: 'a6' },
  { label: 'Other', value: 'other' }
]

function ArtworkTaskForm({ initialValues, message, handleSubmit, submitting, submission, venueOptions, setMessageState, setTitleState, actionValue }) {
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

      <div className="boss-form__row">
        <Field
          name="description"
          label="Description"
          component={ BossFormTextArea }
          required={ false }
          containerClasses="boss-form__field_layout_half"
          textAreaClasses="boss-form__textarea_size_large"
        />

        <Fields
          names={['size', 'height_cm', 'width_cm']}
          label="Size"
          sizes={ sizes }
          component={ SizeField }
        />
      </div>

      <div className="boss-form__group boss-form__group_role_board">
        <div className="boss-form__row">
          <div className="boss-form__group boss-form__group_layout_min">
            <Field
              name="facebook_cover_page"
              label="Facebook Cover page"
              component={ CheckboxField }
            />

            <Field
              name="facebook_booster"
              label="Facebook Booster"
              component={ CheckboxField }
            />
          </div>

          <div className="boss-form__group boss-form__group_layout_min">
            <Field
              name="facebook_announcement"
              label="Facebook Announcement"
              component={ CheckboxField }
            />


            <Fields
              names={['print', 'quantity']}
              label="Print"
              component={ PrintField }
            />
          </div>
        </div>
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

ArtworkTaskForm = reduxForm({
  form: 'artwork-task-form',
})(ArtworkTaskForm);

const selector = formValueSelector('artwork-task-form');

export default connect(state => {
  const description = selector(state, 'description')

  return {
    description,
  };
})(ArtworkTaskForm);
