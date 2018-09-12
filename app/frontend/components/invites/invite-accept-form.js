import React from 'react';
import { Field, reduxForm, SubmissionError, reducer as formReducer } from 'redux-form/immutable';
import { BossFormInput } from '~/components/boss-form';
import { combineReducers } from 'redux-immutable';
import { modalRedux } from '~/components/modals';
import PropTypes from 'prop-types';

const submission = (values, dispatch, props) => {
  const jsValues = values.toJS();
  return props.onSubmit(jsValues, dispatch).catch(resp => {
    if (resp.response && resp.response.data) {
      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
    }
    throw resp;
  });
};

const renderBaseError = errors => {
  return (
    <div className="boss-modal-window__alert" style={{ width: '100%' }}>
      <div className="boss-alert boss-alert_role_area boss-alert_context_above">
        {errors.map((error, index) => (
          <p key={index.toString()} className="boss-alert__text">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};

class InviteAcceptForm extends React.Component {
  state = {
    isShowPassword: false,
  };
  handleChangeShowPassword = e => {
    this.setState({ isShowPassword: e.target.checked });
  };
  render() {
    const { error, handleSubmit } = this.props;
    const { isShowPassword } = this.state;
    return (
      <div className="boss-modal-window__content">
        {error && renderBaseError(error)}
        <div className="boss-modal-window__form">
          <form onSubmit={handleSubmit(submission)} className="boss-form">
            <Field
              name="password"
              label="Password"
              type={isShowPassword ? 'text' : 'password'}
              required
              component={BossFormInput}
            />
            <Field
              name="confirmPassword"
              label="Confirm Password"
              type={isShowPassword ? 'text' : 'password'}
              required
              component={BossFormInput}
            />

            <div className="boss-form__field">
              <label className="boss-form__checkbox-label">
                <input
                  name="show-password"
                  type="checkbox"
                  className="boss-form__checkbox-input"
                  onChange={this.handleChangeShowPassword}
                  value={isShowPassword}
                />
                <span className="boss-form__checkbox-label-text">Show password</span>
              </label>
            </div>
            <div className="boss-form__field boss-form__field_justify_center">
              <button className="boss-button boss-button_role_primary" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

InviteAcceptForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(
  reduxForm({
    form: 'invite-accept-form',
    validate: values => {
      let errors = {};
      if (!values.get('password')) {
        errors.password = 'This is a required field!';
      }
      if (!values.get('confirmPassword')) {
        errors.confirmPassword = 'This is a required field!';
      }
      if (
        values.get('password') &&
        values.get('confirmPassword') &&
        values.get('password') !== values.get('confirmPassword')
      ) {
        return {
          password: "This fields doesn't match",
          confirmPassword: "This fields doesn't match",
        };
      }
      return errors;
    },
  })(InviteAcceptForm),
);
