import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { modalRedux } from '~/components/modals';
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
    const [
      staffMemberFullName,
      warningOptions,
      warnings,
      warningLimits,
      companyName,
      appealToName,
      currentUserFullName,
    ] = oFetch(
      this.props,
      'staffMemberFullName',
      'warningOptions',
      'warnings',
      'warningLimits',
      'companyName',
      'appealToName',
      'currentUserFullName',
    );
    const initialValues = {
      title: null,
      level: warningOptions[0].value,
      nature: null,
      conduct: null,
      consequence: null,
    };

    return (
      <DisciplinaryForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        staffMemberFullName={staffMemberFullName}
        warningLimits={warningLimits.toJS()}
        warnings={warnings.toJS()}
        warningOptions={warningOptions}
        companyName={companyName}
        appealToName={appealToName}
        currentUserFullName={currentUserFullName}
        buttonText="Add Disciplinary"
        buttonClass="boss-button_role_add"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(DisciplinaryAdd);
