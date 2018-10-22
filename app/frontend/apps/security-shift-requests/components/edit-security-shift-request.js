import React from 'react';
import PropTypes from 'prop-types';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import oFetch from 'o-fetch';

import SecurityShiftRequestForm from './security-shift-request-form';

class EditSecurityShiftRequest extends React.Component {
  render() {
    const jsAccessibleVenues = oFetch(this.props, 'accessibleVenues').toJS();

    return (
      <SecurityShiftRequestForm
        onFormSubmit={this.props.onSubmit}
        buttonText="Update"
        venues={jsAccessibleVenues}
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

export default modalRedux(combineReducers({ form: formReducer }))(EditSecurityShiftRequest);
