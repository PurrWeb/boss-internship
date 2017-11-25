import React from 'react';
import {connect} from 'react-redux';
import {
  Field,
  reduxForm,
  formValueSelector,
} from 'redux-form/immutable';

import {
  BossFormInput,
  BossFormCheckbox,
} from '~/components/boss-form'

class ResetPasswordForm extends React.Component {
  render() {
    const {submitting, showPassword} = this.props;

    return (
      <div className="boss-modal-window boss-modal-window_role_set">
        <div className="boss-modal-window__header">
          <h2 className="boss-modal-window__title">
            Set Application Password
          </h2>
        </div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__form">
            <form onSubmit={this.props.handleSubmit} className="boss-form">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="New password"
                autocomplete={false}
                component={BossFormInput}
                normalize={(value) => value === "" ? null : value}
              />
              <Field
                name="passwordConfirmation"
                type={showPassword ? 'text' : 'password'}
                label="Confirm password"
                autocomplete={false}
                component={BossFormInput}
                normalize={(value) => value === "" ? null : value}
              />
              <Field
                name="showPassword"
                type="checkbox"
                label="Show password"
                component={BossFormCheckbox}
              />
              <div className="boss-form__field boss-form__field_justify_center boss-form__field_position_last">
                <button
                  disabled={submitting}
                  className="boss-button boss-button_role_primary"
                >Done</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
ResetPasswordForm = reduxForm({
  fields: ['verificationToken'],
  form: 'reset-password-form',
})(ResetPasswordForm);

const selector = formValueSelector('reset-password-form');

export default connect(state => {
  const showPassword = selector(state, 'showPassword')
  return {
    showPassword,
  }
})(ResetPasswordForm);
