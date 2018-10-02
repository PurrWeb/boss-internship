import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { BossFormSelect } from '~/components/boss-form';
import humanize from 'string-humanize';
import { STATUSES_FILTER, ROLES_FILTER } from '../constants';

const statusOptions = STATUSES_FILTER.map(status => ({
  value: status,
  label: humanize(status),
}));

const roleOptions = ROLES_FILTER.map(role => ({
  value: role,
  label: humanize(role),
}));

class InvitesFilterForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-form">
        <div className="boss-form__row boss-form__row_position_last">
          <div className="boss-form__group boss-form__group_layout_max">
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_layout_half">
                <Field
                  name="status"
                  label="Status"
                  options={statusOptions}
                  clearable={false}
                  component={BossFormSelect}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_half">
                <Field name="role" label="Role" options={roleOptions} clearable={false} component={BossFormSelect} />
              </div>
            </div>
          </div>

          <div className="boss-form__group boss-form__group_layout_fluid">
            <div className="boss-form__field boss-form__field_justify_end boss-form__field_no-label">
              <button
                disabled={this.props.submitting}
                className="boss-button boss-form__submit boss-form__submit_adjust_single"
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'users-filter-form',
  enableReinitialize: true,
})(InvitesFilterForm);
