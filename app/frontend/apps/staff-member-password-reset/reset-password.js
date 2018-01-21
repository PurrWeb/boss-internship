import React from 'react';
import { SubmissionError } from 'redux-form/immutable';

import ResetPasswordForm from './reset-password-form';
import oFetch from 'o-fetch'
import {
  changePassword,
} from './actions';
class ResetPassword extends React.Component {

  submittion = (values, dispatch) => {
    const paths = {
      successPath: oFetch(this.props, 'successPath'),
      requestPath: oFetch(this.props, 'requestPath')
    }

    return dispatch(changePassword(Object.assign(values.toJS(), paths)))
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
    const verificationToken = oFetch(this.props, 'verificationToken');
    const actionDescription = oFetch(this.props, 'actionDescription');

    const initialValues = {
      password: null,
      passwordConfirmation: null,
      showPassword: false,
      verificationToken: verificationToken,
    };

    return (
      <ResetPasswordForm
        actionDescription={actionDescription}
        initialValues={initialValues}
        onSubmit={this.submittion}
      />
    )
  }
}

export default ResetPassword;
