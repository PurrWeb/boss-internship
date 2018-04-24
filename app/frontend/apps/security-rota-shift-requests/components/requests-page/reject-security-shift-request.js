import React from 'react';
import PropTypes from 'prop-types';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import SecurityShiftRejectRequestForm from '~/components/security-shift-requests/security-shift-reject-request-form';

class RejectSecurityShiftRequest extends React.PureComponent {
  render() {
    return (
      <SecurityShiftRejectRequestForm
        onFormSubmit={this.props.onSubmit}
        buttonText="Reject"
        buttonClass="boss-button boss-button_role_cancel boss-form__submit"
        initialValues={this.props.rejectRequestFormInitialValues}
      />
    );
  }
}

RejectSecurityShiftRequest.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  rejectRequestFormInitialValues: PropTypes.object.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(
  RejectSecurityShiftRequest,
);