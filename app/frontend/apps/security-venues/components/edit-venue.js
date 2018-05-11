import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import AddVenueForm from './add-venue-form';

class EditVenue extends React.Component {
  render() {
    const securityVenue = oFetch(this.props, 'securityVenue');
    const initialValues = {
      id: oFetch(securityVenue, 'id'),
      name: oFetch(securityVenue, 'name'),
      address: oFetch(securityVenue, 'address'),
      lat: oFetch(securityVenue, 'lat'),
      lng: oFetch(securityVenue, 'lng'),
    }

    return (
      <AddVenueForm
        onFormSubmit={this.props.onSubmit}
        buttonText="Update"
        initialValues={initialValues}
      />
    );
  }
}

EditVenue.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(
  EditVenue,
);
