import React from "react"
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
    
    let lastMachineRefloat = machinesRefloats.find(machine => machine.get('id') === selectedMachine.lastMachineRefloatId);
    lastMachineRefloat = lastMachineRefloat && lastMachineRefloat.toJS();
    const machineFloatCents = selectedMachine.floatCents;
    const machineFloatTopupCents = selectedMachine.initialFloatTopupCents;
    const errors = submitErrors && submitErrors.toJS();
    const lastRefillCents = lastMachineRefloat ? lastMachineRefloat.refillX10p * 10 : selectedMachine.refillX10p * 10;
    const lastCashInCents = lastMachineRefloat ? lastMachineRefloat.cashInX10p * 10 : selectedMachine.cashInX10p * 10;
    const lastCashOutCents = lastMachineRefloat ? lastMachineRefloat.cashOutX10p * 10 : selectedMachine.cashOutX10p * 10;
    const lastCalculatedMoneyBankedCents = lastMachineRefloat ? lastMachineRefloat.calculatedMoneyBankedCents : 0;
    const lastCalculatedFloatTopupCents = lastMachineRefloat ? lastMachineRefloat.calculatedFloatTopupCents : machineFloatCents;
    const lastMoneyBankedCents = lastMachineRefloat ? lastMachineRefloat.moneyBankedCents : machineFloatTopupCents;
    const refillCents = refillX10p * 10;
    const cashInCents = cashInX10p * 10;
    const cashOutCents = cashOutX10p * 10;
    const lastFloatTopupCents = lastMachineRefloat ? lastMachineRefloat.floatTopupCents : machineFloatTopupCents;
    const cashInDiffCents = cashInCents - lastCashInCents;
    const cashOutDiffCents = cashOutCents - lastCashOutCents;
    const refillDiffCents = refillCents - lastRefillCents;
    const lastUnbankedCents = lastCalculatedMoneyBankedCents - lastMoneyBankedCents;
    const lastUntoppedupFloatCents = lastMachineRefloat ?  lastCalculatedFloatTopupCents - lastFloatTopupCents : 0

    const topupAndBankedCanEdit = (refillX10p || refillX10p === 0) && (cashInX10p || cashInX10p === 0) && (cashOutX10p || cashOutX10p === 0);
    let calculatedFloatTopup = null;
    let calculatedMoneyBanked = null;
    if (topupAndBankedCanEdit) {
      calculatedFloatTopup = cashOutDiffCents - (refillDiffCents - lastFloatTopupCents) + lastUntoppedupFloatCents;
      calculatedMoneyBanked = cashInDiffCents - (refillDiffCents - lastFloatTopupCents) + lastUnbankedCents;
    }

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
