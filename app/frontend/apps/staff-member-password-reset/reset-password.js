import React from 'react';
import { SubmissionError } from 'redux-form/immutable';

import ResetPasswordForm from './reset-password-form';
import {
  changePassword,
} from './actions';
class ResetPassword extends React.Component {

  submittion = (values, dispatch) => {
    return dispatch(changePassword(values.toJS()))
      .catch(resp => {
        let errors = resp.response.data.errors;
        if (errors) {
          if (errors.base) {
            errors._error = errors.base
          }

          throw new SubmissionError({...errors});
        }
      });
    }

  render() {
    const initialValues = {
      password: null,
      passwordConfirmation: null,
      showPassword: false,
      verificationToken: this.props.verificationToken,
    };

    return (
      <ResetPasswordForm
        initialValues={initialValues}
        onSubmit={this.submittion}
      />
    )
  }
}

export default ResetPassword;
