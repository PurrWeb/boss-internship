import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AddShiftForm from './add-shift-form';
import { SubmissionError } from 'redux-form/immutable';
import { confirmation } from '~/lib/confirm-utils';

import { addShift } from '../actions';

const ROTA_PUBLISHED_STATUS = 'published';

export function handleSubmit(values, dispatch, props) {
  const status = props.rotas.size > 0 && props.rotas
    .find(r => r.get('venue') === values.get('venueId'))
    && props.rotas.find(r => r.get('venue') === values.get('venueId'))
    .get('status');
  const action = () => {
    return dispatch(addShift(values.toJS())).catch(resp => {
      let errors = resp.response.data.errors;
      if (errors) {
        if (errors.base) {
          errors._error = errors.base;
        }

        throw new SubmissionError({ ...errors });
      }
    });
  };

  if (status === ROTA_PUBLISHED_STATUS) {
    return confirmation(
      [
        "Editing a shift on a published rota will send out email confirmations.",
        'Do you want to continue?',
      ],
      {
        title: 'WARNING !!!',
        id: 'rota-daily-confirmation',
      },
    ).then(() => {
      return action();
    });
  } else {
    return action();
  }
}

class AddShift extends React.Component {
  handleSubmit = (values, dispatch, props) => {
    return handleSubmit(values, dispatch, props).then(() => {
      this.props.handleAfterAdd();
    });
  };

  getVenues() {
    return this.props.venues.map(venue => venue.set('id', `${venue.get('type')}_${venue.get('id')}`));
  }

  render() {
    const { staffMember, rotaDate, venues } = this.props;

    const initialValues = {
      staffMemberId: staffMember.get('id'),
      startsAt: null,
      endsAt: null,
      shiftType: 'normal',
      venueId: venues.getIn([0, 'id']),
    };

    return (
      <AddShiftForm
        submittion={this.handleSubmit}
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotas={this.props.rotas}
        handleAfterAdd={this.props.handleAfterAdd}
        venues={this.getVenues()}
      />
    );
  }
}

AddShift.PropTypes = {
  staffMember: ImmutablePropTypes.map.isRequired,
  rotaDate: PropTypes.string.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
  handleAfterAdd: PropTypes.func.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
};

export default AddShift;
