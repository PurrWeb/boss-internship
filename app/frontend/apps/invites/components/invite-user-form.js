import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { BossFormInput, BossFormSelect } from '~/components/boss-form';
import Immutable from 'immutable';
import { ROLES_FILTER } from '../constants';
import humanize from 'string-humanize';
import PropTypes from 'prop-types';

const roleOptions = ROLES_FILTER.map(role => ({
  value: role,
  label: humanize(role),
}));

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

class InviteUserForm extends React.Component {
  render() {
    const { error, venues, submitting } = this.props;
    return (
      <form onSubmit={this.props.handleSubmit(submission)} className="boss-form">
        <Field name="firstName" label="First Name" required component={BossFormInput} />
        <Field name="surname" label="Surname" required component={BossFormInput} />

        <Field name="role" label="Role" required options={roleOptions} clearable={true} component={BossFormSelect} />

        <Field
          component={BossFormSelect}
          name="venueIds"
          multi
          label="Venues"
          optionLabel="name"
          optionValue="id"
          options={venues.toJS()}
        />
        <Field name="email" label="Email" type="email" required component={BossFormInput} />

        <div className="boss-form__row boss-form__row_position_last">
          <div className="boss-form__field boss-form__field_justify_center">
            <button disabled={submitting} className="boss-button boss-button_role_add boss-form__submit" type="submit">
              Invite New User
            </button>
          </div>
        </div>
      </form>
    );
  }
}

InviteUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  venues: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default reduxForm({
  form: 'invite-user-form',
})(InviteUserForm);
