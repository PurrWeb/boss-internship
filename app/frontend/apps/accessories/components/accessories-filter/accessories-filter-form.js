import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import {ACCESSORY_SELECT_TYPES} from '../constants';

import BossFormSelect from '../boss-form-select';
import {BossFormInput} from '~/components/boss-form';

const SELF_REQUESTABLE_OPTIONS = [
  {value: 'yes', label: 'Yes'},
  {value: 'no', label: 'No'},
];

const STATUS_OPTIONS = [
  {value: 'enabled', label: 'Endabled'},
  {value: 'disabled', label: 'Disabled'},
];

class AccessoriesFilterForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-form">
        <div className="boss-form__row">
          <div className="boss-form__field_layout_half">
            <Field
              name="accessoryType"
              label="Accessory Type"
              options={ACCESSORY_SELECT_TYPES}
              clearable
              component={BossFormSelect}
            />
          </div>
          <div className="boss-form__field_layout_half">
            <Field
              name="name"
              label="Name"
              component={BossFormInput}
            />
          </div>
        </div>
        <div className="boss-form__row">
          <div className="boss-form__field_layout_half">
            <Field
              name="status"
              label="Status"
              options={STATUS_OPTIONS}
              clearable
              component={BossFormSelect}
            />
          </div>
          <div className="boss-form__field_layout_half">
            <Field
              name="userRequestable"
              label="Self requestable"
              options={SELF_REQUESTABLE_OPTIONS}
              clearable
              component={BossFormSelect}
            />
          </div>
        </div>
        <div className="boss-form__field boss-form__field_justify_end boss-form__field_position_last">
          <button
            disabled={this.props.submitting}
            className="boss-button boss-form__submit boss-form__submit_adjust_single"
          >Update</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'accessories-filter-form',
})(AccessoriesFilterForm);
