import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux'
import oFetch from 'o-fetch';
import BossFormAvatar from '~/components/boss-form/boss-form-avatar';

import {updateAvatarRequest} from '../actions';

const validate = values => {
  const errors = {}

  return errors;
}

const submission = (values, dispatch) => {
  const avatar_base64 = values.get('avatar');
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
  markedRetakeAvatar,
  disableUpload,
}) => {
  return (
    <div className="boss-modal-window__form">
      <form
        onSubmit={handleSubmit(submission)}
        className="boss-form"
      >
        <Field
          name="avatar"
          markedRetakeAvatar={markedRetakeAvatar}
          disableUpload={disableUpload}
          component={BossFormAvatar}
        />
        <div className="boss-form__field boss-form__field_justify_center">
          <button
            disabled={submitting || disableUpload}
            type="submit"
            className="boss-button boss-button_role_submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}
const selector = formValueSelector('edit-avatar-form');
export default connect((state, ownProps) => {
  const avatar = selector(state, 'avatar');
  if (avatar) {
    const initialAvatar = oFetch(ownProps, 'initialValues.avatar');
    const isTheSameAvatar = initialAvatar === avatar;
    return {
      disableUpload: isTheSameAvatar,
    };
  }
  return {
    disableUpload: true,
  };
})(reduxForm({
  form: 'edit-avatar-form',
  validate,
})(EditAvatar))
