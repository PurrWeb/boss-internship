import React from 'react';
import { Field, Fields, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';

import {
  InputInlineField,
  InputField,
  DateTimeField,
  SelectField
} from './form-fields';

import {
  BossFormTextArea
} from '~/components/boss-form';

function MessageBoardForm({ initialValues, message, handleSubmit, submitting, submission, venueOptions, setMessageState, setTitleState }) {
  $('#message-preview').html(message);

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
        component={ BossFormTextArea }
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

MessageBoardForm = reduxForm({
  form: 'DashboardMessageForm',
})(MessageBoardForm);

const selector = formValueSelector('DashboardMessageForm');

export default connect(state => {
  const message = selector(state, 'message')
  return {
    message,
  };
})(MessageBoardForm);
