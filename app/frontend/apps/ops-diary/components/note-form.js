import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import {
  BossFormInput,
  BossFormSelect,
  BossFormTextarea,
} from '~/components/boss-form';

import {
  ColoredSingleValue,
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

class NoteForm extends Component {
  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit}
        className="boss-modal-window__form boss-form"
      >
        <Field
          name="title"
          type="text"
          label="Title"
          component={BossFormInput}
        />
        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_layout_half">
            <Field
              options={this.props.venues}
              label="Venue"
              placeholder="Select venue ..."
              name="venueId"
              optionLabel="name"
              optionValue="id"
              component={BossFormSelect}
            />
          </div>
          <div className="boss-form__field boss-form__field_layout_half">
            <Field
              options={FILTER_PRIORITIES}
              label="Priority"
              placeholder="Select priority ..."
              name="priority"
              valueComponent={ColoredSingleValue}
              optionComponent={ColoredSingleOption}
              component={BossFormSelect}
            />
          </div>
        </div>
        <Field
          name="text"
          classNames="boss-form__textarea_size_large"
          label="Text"
          component={BossFormTextarea}
        />
        <div className="boss-form__field">
          <button
            disabled={this.props.submitting}
            className="boss-button boss-button_role_add boss-form__submit"
          >
            {this.props.buttonName}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  values: ['id'],
  form: 'note-form',
})(NoteForm);
