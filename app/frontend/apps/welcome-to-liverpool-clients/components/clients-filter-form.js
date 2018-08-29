import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import { STATUS_OPTIONS } from '../constants';

import { BossFormInput, BossFormSelect } from '~/components/boss-form';

class ClientsFilterForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-form">
        <div className="boss-form__row">
          <div className="boss-form__group_layout_max">
            <div className="boss-form__row">
              <Field name="name" label="Name" component={BossFormInput} className="boss-form__field_layout_third" />
              <Field
                name="email"
                label="Email"
                component={BossFormInput}
                type="email"
                className="boss-form__field_layout_third"
              />
              <Field
                name="status"
                label="Status"
                options={STATUS_OPTIONS}
                component={BossFormSelect}
                className="boss-form__field_layout_third"
              />
            </div>
          </div>

          <Field
            name="cardNumber"
            label="Card Number"
            component={BossFormInput}
            type="number"
            className="boss-form__field_layout_sixth"
          />
        </div>

        <div className="boss-form__field boss-form__field_justify_end">
          <button className="boss-button boss-form__submit boss-form__submit_adjust_single" type="submit">
            Update
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  enableReinitialize: true,
  form: 'clients-filter-form',
})(ClientsFilterForm);
