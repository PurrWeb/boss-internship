import React from 'react';
import PropTypes from 'prop-types';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import AddVenueForm from './add-venue-form';

class AddVenue extends React.Component {
  render() {
    return (
      <AddVenueForm
        onFormSubmit={this.props.onSubmit}
        buttonText="Create"
      />
    );
  }
}

AddVenue.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(
  AddVenue,
);