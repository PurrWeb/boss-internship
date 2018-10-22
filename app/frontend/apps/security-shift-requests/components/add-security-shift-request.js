import React from 'react';
import oFetch from 'o-fetch';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import SecurityShiftRequestForm from './security-shift-request-form';

class AddSecurityShiftRequest extends React.Component {
  render() {
    const date = oFetch(this.props, 'date');
    const jsAccessibleVenues = oFetch(this.props, 'accessibleVenues').toJS();
    const initialValues = {
      note: null,
      assignedRotaShift: null,
      date,
      venueId: jsAccessibleVenues[0].id,
    };
    return (
      <SecurityShiftRequestForm
        initialValues={initialValues}
        onFormSubmit={this.props.onSubmit}
        venues={jsAccessibleVenues}
        buttonText="Add New"
        buttonClass="boss-button_role_add"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(AddSecurityShiftRequest);
