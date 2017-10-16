import React from "react"
import machineRefloatCalculation from "~/lib/machine-refloat-calculation"
import oFetch from "o-fetch"
import {
  Field,
  Fields,
  reduxForm,
  formValueSelector,
  getFormSubmitErrors,
} from 'redux-form/immutable';
import { connect } from 'react-redux';

import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormTextarea from '~/components/boss-form/boss-form-textarea';
import BossInput from '~/components/boss-form/boss-form-input';
import BossFormCalculatedInput from '~/components/boss-form/boss-form-calculated-input';
class RecordRefloatForm extends React.Component {

  render() {
    const {
      selectedMachine,
      submitting,
      submitErrors,
      handleSubmit,
      submittion,
      refillX10p,
      cashOutX10p,
      cashInX10p,
      machinesRefloats,
    } = this.props;

    let lastMachineRefloat = machinesRefloats.find(machine => machine.get('id') === selectedMachine.lastMachineRefloatId) || null;
    lastMachineRefloat = lastMachineRefloat && lastMachineRefloat.toJS();

    const errors = submitErrors && submitErrors.toJS();

    let calculatedValues = machineRefloatCalculation({
      selectedMachine: selectedMachine,
      lastMachineRefloat: lastMachineRefloat,
      refillX10pReading: refillX10p || null,
      cashInX10pReading: cashInX10p || null,
      cashOutX10pReading: cashOutX10p || null
    });

    let topupAndBankedCanEdit = oFetch(calculatedValues, 'topupAndBankedCanEdit');
    let calculatedFloatTopup = oFetch(calculatedValues, 'calculatedFloatTopupCents') / 100;
    let calculatedMoneyBanked = oFetch(calculatedValues, 'calculatedMoneyBankedCents') / 100;

    return (
      <form
        onSubmit={handleSubmit((values, dispatch) => submittion({...values.toJS(), calculatedFloatTopup, calculatedMoneyBanked}, dispatch))}
        className="boss-form"
      >
        <div className="boss-form__group boss-form__group_role_board-outline">
          <h3 className="boss-form__group-title">Readings</h3>
          <Field
            name="refillX10p"
            label="Refill (A)"
            type="number"
            component={BossInput}
            normalize={value => (value || value === 0) ? parseInt(value) : null}
          />
          <Field
            name="cashInX10p"
            label="Cash In (B)"
            type="number"
            component={BossInput}
            normalize={value => (value || value === 0) ? parseInt(value) : null}
          />
          <Field
            name="cashOutX10p"
            label="Cash Out (C)"
            type="number"
            component={BossInput}
            normalize={value => (value || value === 0) ? parseInt(value) : null}
          />
        </div>
        <Field
          name="floatTopup"
          label="Float Topup"
          tooltip="How much the float was topped up after readings."
          disabled={!topupAndBankedCanEdit}
          calculated={calculatedFloatTopup}
          component={BossFormCalculatedInput}
        />
        <Field
          style={{'display': errors && errors.floatTopupError ? 'block' : 'none'}}
          name="floatTopupNote"
          label="Note"
          component={BossFormTextarea}
        />
        <Field
          name="moneyBanked"
          label="Money Banked"
          disabled={!topupAndBankedCanEdit}
          tooltip="How much money was taken from the machine after readings."
          calculated={calculatedMoneyBanked}
          component={BossFormCalculatedInput}
        />
        <Field
          style={{'display': errors && errors.moneyBankedError ? 'block' : 'none'}}
          name="moneyBankedNote"
          label="Note"
          component={BossFormTextarea}
        />
        <div className="boss-form__field boss-form__field_justify_mobile-center">
          <button className="boss-button boss-form__submit"
            disabled={submitting}
            type="submit"
          >Submit</button>
        </div>
      </form>
    )
  }
}

RecordRefloatForm = reduxForm({
  fields: ['machineId'],
  form: 'record-refloat-form',
})(RecordRefloatForm);

const selector = formValueSelector('record-refloat-form');
const mapStateToProps = (state) => {
  const refillX10p = selector(state, 'refillX10p');
  const cashOutX10p = selector(state, 'cashOutX10p');
  const cashInX10p = selector(state, 'cashInX10p');
  return {
    refillX10p: refillX10p,
    cashOutX10p: cashOutX10p,
    cashInX10p: cashInX10p,
    machinesRefloats: state.getIn(['page', 'machinesRefloats']),
    submitErrors: getFormSubmitErrors('record-refloat-form')(state),
  }
}
export default connect(mapStateToProps)(RecordRefloatForm);
