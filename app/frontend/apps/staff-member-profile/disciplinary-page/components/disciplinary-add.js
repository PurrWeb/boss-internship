import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import oFetch from 'o-fetch';
import DisciplinaryForm from './disciplinary-form';

class DisciplinaryAdd extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch(resp => {
      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
      return resp;
    });
  };

  render() {
    const initialValues = {
      title: null,
      level: null,
      nature: null,
      conduct: null,
      consequence: null,
    };

    return (
      <DisciplinaryForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        buttonText="Add Disciplinary"
        buttonClass="boss-button_role_add"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(DisciplinaryAdd);
