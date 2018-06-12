import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AddMultipleShiftForm from './add-multiple-shift-form';
import { SubmissionError } from 'redux-form/immutable';

import { addShift } from '../actions';

class AddMultipleShift extends React.Component {
  getVenues() {
    return this.props.venues.map(venue => venue.set('id', `${venue.get('type')}_${venue.get('id')}`));
  }
  render() {
    const { rotaDate, venues } = this.props;

    const initialValues = {
      startsAt: null,
      endsAt: null,
      shiftType: 'normal',
      venueId: venues.getIn([0, 'id']),
    };

    return (
      <AddMultipleShiftForm
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotas={this.props.rotas}
        venues={this.getVenues()}
      />
    );
  }
}

AddMultipleShift.PropTypes = {
  rotaDate: PropTypes.string.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
};

export default AddMultipleShift;
