import React from 'react';
import { SubmissionError } from 'redux-form/immutable';

import MachineForm from './machine-form';

import {
  restoreMachine
} from '../actions';

export default class RestoreMachine extends React.Component {
  
  handleSubmit = (values, dispatch) => {
    return dispatch(restoreMachine(values.toJS()))
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
  
  render() {
    const {
      machine,
    } = this.props;

    const initialValues = {
      id: machine.get('id'),
      name: machine.get('name'),
      location: machine.get('location'),
      floatCents: machine.get('floatCents'),
      initialRefillX10p: machine.get('initialRefillX10p'),
      initialCashInX10p: machine.get('initialCashInX10p'),
      initialCashOutX10p: machine.get('initialCashOutX10p'),
    }

    return (
      <MachineForm
        submitButtonText="Restore"
        restoring
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
      />
    )
  }
}
