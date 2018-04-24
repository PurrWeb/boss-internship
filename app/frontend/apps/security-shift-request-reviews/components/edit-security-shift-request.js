import React from 'react';
import PropTypes from 'prop-types';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import SecurityShiftRequestForm from '~/components/security-shift-requests/security-shift-request-form';

class EditSecurityShiftRequest extends React.Component {
  render() {
    return (
      <SecurityShiftRequestForm
        onFormSubmit={this.props.onSubmit}
        buttonText="Update"
        buttonClass="boss-button boss-form__submit"
        initialValues={this.props.editRequestFormInitialValues}
      />
    );
  }
}

EditSecurityShiftRequest.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editRequestFormInitialValues: PropTypes.object.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(
  EditSecurityShiftRequest,
);
