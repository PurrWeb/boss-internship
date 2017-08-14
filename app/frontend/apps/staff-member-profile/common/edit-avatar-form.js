import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormAvatar from '~/components/boss-form/boss-form-avatar';

import {updateAvatarRequest} from '../profile-details/actions';

const validate = values => {
  const errors = {}

  return errors;
}

const submission = (values, dispatch) => {
  const avatar_base64 = values.get('avatar_base64');
  return dispatch(updateAvatarRequest(avatar_base64)).catch((resp) => {
    const errors = resp.response.data.errors;
    if (errors) {
      throw new SubmissionError(errors);
    }
  });
}

const EditAvatar = ({
  handleSubmit,
  submitting,
}) => {
  return (
    <form
      onSubmit={handleSubmit(submission)}
      className="boss-form"
    >
      <Field 
        name="avatar_base64"
        component={BossFormAvatar}
      />
      <div className="boss-form__field boss-form__field_justify_center">
        <button
          disabled={submitting}
          type="submit"
          className="boss-button boss-button_role_submit"
        >
          Update
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'edit-avatar-form',
  validate,
})(EditAvatar);
