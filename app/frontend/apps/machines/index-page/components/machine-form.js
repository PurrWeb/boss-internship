import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import BossInput from '~/components/boss-form/boss-form-input';
import PenceInput from './form-input/pence-input';

class MachineForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submitting,
      submitButtonText,
      restoring = false,
    } = this.props;

    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_m-form">
        <form onSubmit={handleSubmit} className="boss-form">
          <Field
            name="name"
            label="Name"
            component={BossInput}
          />
          <Field
            name="location"
            label="Location"
            component={BossInput}
          />
          <Field
            name="floatCents"
            label="Float"
            unit="£"
            type="number"
            disabled={restoring}
            component={BossInput}
          />
          <div className="boss-form__group boss-form__group_role_board-outline">
            <h3 className="boss-form__group-title">Initial Readings</h3>
            <Field
              name="initialRefillX10p"
              label="Refill (A)"
              type="number"
              component={PenceInput}
            />
            <Field
              name="initialCashInX10p"
              label="Cash In (B)"
              type="number"
              component={PenceInput}
            />
            <Field
              name="initialCashOutX10p"
              label="Cash Out (C)"
              type="number"
              component={PenceInput}
            />
            <Field
              name="initialFloatTopupCents"
              label="Float topup cents"
              unit="£"
              type="number"
              component={BossInput}
            />
          </div>
          <div className="boss-form__field boss-form__field_justify_mobile-center">
            <button
              disabled={submitting}
              className="boss-button boss-button_role_add boss-form__submit"
            >{submitButtonText}</button>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'machine-form',
})(MachineForm);
