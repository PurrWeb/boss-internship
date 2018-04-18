import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import SecurityShiftRequestForm from '~/components/security-shift-requests/security-shift-request-form';

class AddSecurityShiftRequest extends React.Component {
  render() {
    const initialValues = {
      note: null,
      assignedRotaShift: null,
    }
    return (
      <SecurityShiftRequestForm
        initialValues={initialValues}
        onFormSubmit={this.props.onSubmit}
        buttonText="Add New"
        buttonClass="boss-button_role_add"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(
  AddSecurityShiftRequest,
);
