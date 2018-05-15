import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import GraphDetailsForm from './graph-details-form';
import { SubmissionError } from 'redux-form/immutable';
import { confirmation } from '~/lib/confirm-utils';

import { updateStaffMemberShift, deleteStaffMemberShift } from '../actions';

const ROTA_PUBLISHED_STATUS = 'published';

class GraphDetails extends React.Component {
  handleSubmit = (values, dispatch, props, type) => {
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
      action = () => dispatch(updateStaffMemberShift(values.toJS()));
    }
    if (type === 'delete') {
      action = () =>
        dispatch(
          deleteStaffMemberShift(
            values.get('shiftId'),
            values.get('staffMemberId'),
            values.get('venueType'),
          ),
        );
    }
    if (!action) throw Error('Wrong Rota shift action');

    if (status === ROTA_PUBLISHED_STATUS) {
      return confirmation(
        [
          "Updating a shift on a published rota will send out confirmation emails.",
          'Do you want to continue?',
        ],
        {
          title: 'WARNING !!!',
          id: 'rota-daily-confirmation',
        },
      ).then(() => {
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
