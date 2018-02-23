import React from 'react';
import { Field, Fields, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';

import {
  AssignToUserField
} from '../form-fields';

import {
  BossFormTextArea
} from '~/components/boss-form';

function AssignToUserForm({ initialValues, message, handleSubmit, submitting, submission, marketingUsers, setMessageState, setTitleState, actionValue }) {
  $('#message-preview').html(message);

  return (
    <form onSubmit={handleSubmit(submission)} className="boss-form">
      <Fields
        names={['assign_to_user', 'assign_to_self']}
        label="Assign To User"
        marketingUsers={ marketingUsers }
        component={ AssignToUserField }
      />

      <div className="boss-form__field">
        <button
          disabled={submitting}
          className="boss-button boss-form__submit"
          type="submit"
        >Save</button>
      </div>
    </form>
  )
};

AssignToUserForm = reduxForm({
  form: 'assign-to-user-form',
})(AssignToUserForm);

const selector = formValueSelector('assign-to-user-form');

export default connect(state => {
  const assignToUser = selector(state, 'assignToUser')

  return {
    assignToUser,
  };
})(AssignToUserForm);
