import React, { Component } from 'react';
import { Field, Fields, reduxForm } from 'redux-form/immutable';

import {
  BossFormSwitcher,
  BossFormSelect,
  BossFormDaterangePicker,
} from '~/components/boss-form';

import {
  ColoredMultipleValue,
  ColoredSingleOption,
} from '~/components/boss-form/colored-select';

const FILTER_STATUSES = [
  { label: 'Active only', value: 'active' },
  { label: 'Show All', value: 'all' },
];

const FILTER_PRIORITIES = [
  { label: 'High', value: 'high', color: '#ed7f7e' },
  { label: 'Medium', value: 'medium', color: '#f4a84f' },
  { label: 'Low', value: 'low', color: '#86dd75' },
];

class OpsDiariesFilterForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-form">
        <div className="boss-form__row">
          <div className="boss-form__field_no-label boss-form__field_layout_half">
            <Field
              data={FILTER_STATUSES}
              name="status"
              component={BossFormSwitcher}
            />
          </div>
          <div className="boss-form__field_layout_half">
            <Fields
              label="Date"
              names={['startDate', 'endDate']}
              component={BossFormDaterangePicker}
            />
          </div>
        </div>
        <div className="boss-form__row">
          <div className="boss-form__field_layout_half">
            <Field
              options={this.props.venues}
              label="Venues"
              placeholder="Select venues ..."
              multi
              name="venues"
              optionLabel="name"
              optionValue="id"
              component={BossFormSelect}
            />
          </div>
          <div className="boss-form__field_layout_half">
            <Field
              options={FILTER_PRIORITIES}
              label="Priorities"
              placeholder="Select priorities ..."
              multi
              name="priorities"
              valueComponent={ColoredMultipleValue}
              optionComponent={ColoredSingleOption}
              component={BossFormSelect}
            />
          </div>
        </div>
        <div className="boss-form__field boss-form__field_justify_end boss-form__field_position_last">
          <button
            disabled={this.props.submitting}
            className="boss-button boss-form__submit boss-form__submit_adjust_single"
          >
            Update
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'ops-diaries-filter-form',
})(OpsDiariesFilterForm);
