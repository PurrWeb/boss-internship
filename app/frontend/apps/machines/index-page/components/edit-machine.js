import React from 'react';
import { SubmissionError } from 'redux-form/immutable';

import EditMachineForm from './edit-machine-form';

import {
  editMachine,
} from '../actions';

export default class EditMachine extends React.Component{
  handleSubmit = (values, dispatch) => {
    return dispatch(editMachine(values.toJS()))
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
    };
  
    return (
      <EditMachineForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
      />
    )
  }
}
