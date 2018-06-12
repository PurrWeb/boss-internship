import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';
import GraphDetailsForm from './graph-details-form';
import { SubmissionError } from 'redux-form/immutable';
import { confirmation } from '~/lib/confirm-utils';
import { BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE } from '~/lib/utils';

import { updateStaffMemberShift, deleteStaffMemberShift } from '../actions';

const ROTA_PUBLISHED_STATUS = 'published';

class GraphDetails extends React.Component {
  handleSubmit = (values, dispatch, props, type) => {
    const jsValues = values.toJS();
    function throwErrors(resp) {
      let errors = resp.response.data.errors;
      if (errors) {
        if (errors.base) {
          errors._error = errors.base;
        }

        throw new SubmissionError({ ...errors });
      }
    }

    let action;
    const status = props.rotaStatus;
    if (type === 'update') {
      action = () => dispatch(updateStaffMemberShift(jsValues));
    }
    if (type === 'delete') {
      action = () =>
        dispatch(
          deleteStaffMemberShift(
            oFetch(jsValues, 'shiftId'),
            oFetch(jsValues, 'staffMemberId'),
            oFetch(jsValues, 'venueType'),
          ),
        );
    }
    if (!action) throw Error('Wrong Rota shift action');
    const venueCombinedId = oFetch(jsValues, 'venueId');
    const [venueType, stringVenueId] = venueCombinedId.split('_');
    if (status === ROTA_PUBLISHED_STATUS || venueType === SECURITY_VENUE_TYPE) {
      let messageText = null;
      let actionTypeText = type === 'update' ? 'Updating' : 'Deleting';
      if (status === ROTA_PUBLISHED_STATUS) {
        messageText = `${actionTypeText} a shift on a published rota will send out confirmation emails.`;
      } else if (venueType === SECURITY_VENUE_TYPE) {
        messageText = `${actionTypeText} this shift will send an email notification to the staff member`;
      }
      return confirmation([messageText, 'Do you want to continue?'], {
        title: 'WARNING !!!',
        id: 'rota-daily-confirmation',
      }).then(() => {
        return action().catch(resp => {
          throwErrors(resp);
        });
      });
    } else {
      return action().catch(resp => {
        throwErrors(resp);
      });
    }
  };

  render() {
    const { staffMember, staffTypes, rotaShift, rotaDate } = this.props;

    const staffType =
      staffMember &&
      staffTypes.find(
        staffType => staffType.get('id') === staffMember.get('staffTypeId'),
      );
    const initialValues = {
      shiftId: rotaShift.get('id'),
      staffMemberId: staffMember.get('id'),
      startsAt: rotaShift.get('startsAt'),
      endsAt: rotaShift.get('endsAt'),
      shiftType: rotaShift.get('shiftType'),
      venueId: `${rotaShift.get('venueType')}_${rotaShift.get('venueId')}`,
      venueType: rotaShift.get('venueType'),
    };

    return (
      <GraphDetailsForm
        onSubmit={this.handleSubmit}
        staffMember={staffMember}
        staffType={staffType}
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotaStatus={this.props.rotaStatus}
        venueTypes={this.props.venueTypes.toJS()}
      />
    );
  }
}

GraphDetails.PropTypes = {
  rotaShift: ImmutablePropTypes.list.isRequired,
  staffMember: ImmutablePropTypes.map.isRequired,
  rotaStatus: PropTypes.string.isRequired,
  staffTypes: ImmutablePropTypes.list.isRequired,
  rotaDate: PropTypes.string.isRequired,
  venueTypes: PropTypes.array.isRequired,
};

export default GraphDetails;
