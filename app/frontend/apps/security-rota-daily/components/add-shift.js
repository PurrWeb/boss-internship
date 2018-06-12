import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AddShiftForm from './add-shift-form';
import { SubmissionError } from 'redux-form/immutable';
import { confirmation } from '~/lib/confirm-utils';
import { BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE } from '~/lib/utils';
import { addShift } from '../actions';

const ROTA_PUBLISHED_STATUS = 'published';

export function handleSubmit(values, dispatch, props) {
  const status =
    props.rotas.size > 0 &&
    props.rotas.find(r => r.get('venue') === values.get('venueId')) &&
    props.rotas.find(r => r.get('venue') === values.get('venueId')).get('status');
  const jsValues = values.toJS();
  const action = () => {
    return dispatch(addShift(jsValues)).catch(resp => {
      let errors = resp.response.data.errors;
      if (errors) {
        if (errors.base) {
          errors._error = errors.base;
        }

        throw new SubmissionError({ ...errors });
      }
    });
  };

  const venueCombinedId = oFetch(jsValues, 'venueId');
  const [type, stringVenueId] = venueCombinedId.split('_');
  if (status === ROTA_PUBLISHED_STATUS || type === SECURITY_VENUE_TYPE) {
    let messageText = null;
    if (status === ROTA_PUBLISHED_STATUS) {
      messageText = "Publishing a rota will send out email confirmations and can't be undone.";
    } else if (type === SECURITY_VENUE_TYPE) {
      messageText = 'Creating this shift will send an email notification to the staff member';
    }
    return confirmation([messageText, 'Do you want to continue?'], {
      title: 'WARNING !!!',
      id: 'rota-daily-confirmation',
    }).then(() => {
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
