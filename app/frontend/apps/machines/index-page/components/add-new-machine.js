import React from 'react';
import { SubmissionError } from 'redux-form/immutable';

import MachineForm from './machine-form';

import {
  createMachine
} from '../actions';

export default class AddNewMachine extends React.Component {
  
  handleSubmit = (values, dispatch) => {
    return dispatch(createMachine(values.toJS()))
      .catch(resp => {
        console.log(resp);
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
    const initialValues = {
      name: null,
      location: null,
      floatCents: null,
      initialRefillX10p: null,
      initialCashInX10p: null,
      initialCashOutX10p: null,
      initialFloatTopupCents: null,
    }

    return (
      <MachineForm
        submitButtonText="Add New"
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
      />
    )
  }
}
