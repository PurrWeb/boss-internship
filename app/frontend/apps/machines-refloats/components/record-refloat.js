import React from "react"
import { SubmissionError } from 'redux-form/immutable';

import ContentWrapper from '~/components/content-wrapper';
import BossSelect from '~/components/boss-select';
import RecordRefloatForm from './record-refloat-form';
import {
  createMachinesRefloat,
} from '../actions';

export default class RecordRefloat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMachine: props.machines.get(0),
    }
  }

  handleSubmit = (values, dispatch) => {
    return dispatch(createMachinesRefloat(values))
      .catch(resp => {
        let errors = resp.response.data.errors;
        if (errors) {
          if (errors.base) {
            errors._error = errors.base
          }

          throw new SubmissionError({...errors});
        }
      });
  }

  handleMachineChange = (selectedMachine) => {
    const machine = this.props.machines.find(machine => machine.get('id') === selectedMachine.value);
    if (machine) {
      this.setState({
        currentMachine: machine,
      })
    }
  }

  render() {
    const {
      machines,
    } = this.props;

    const {
      currentMachine,
    } = this.state;

    const machinesList = machines.map(machine => {
      return {
        value: machine.get('id'),
        label: `${machine.get('name')} (${machine.get('location')})`,
      }
    });

    const selectedMachine = {
      value: currentMachine.get('id'),
      label: `${currentMachine.get('name')} (${currentMachine.get('location')})`,
    }

    const machineData = machines.find(machine => machine.get('id') === currentMachine.get('id'));

    const initialValues = {
      machineId: machineData.get('id'),
      refillX10p: null,
      cashInX10p: null,
      cashOutX10p: null,
      floatTopup: null,
      moneyBanked: null,
      floatTopupNote: null,
      moneyBankedNote: null,
    }

    return (
      <ContentWrapper>
        <div className="boss-page-main__group boss-page-main__group_adjust_m-form">
          <div className="boss-form__field">
            <BossSelect
              options={machinesList.toJS()}
              onChange={this.handleMachineChange}
              selected={selectedMachine}
            />
          </div>
          <div className="boss-form__field"></div>
          <RecordRefloatForm
            enableReinitialize
            selectedMachine={machineData.toJS()}
            initialValues={initialValues}
            submittion={this.handleSubmit}
          />
        </div>
      </ContentWrapper>
    )
  }
}
