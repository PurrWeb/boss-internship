import React from 'react';
import oFetch from 'o-fetch';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import SecurityShiftRequestForm from '~/components/security-shift-requests/security-shift-request-form';

class AddSecurityShiftRequest extends React.Component {
  render() {
    const date = oFetch(this.props, 'date');
    const initialValues = {
      note: null,
      assignedRotaShift: null,
      date,
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
