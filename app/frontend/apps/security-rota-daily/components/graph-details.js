import React from 'react';
import GraphDetailsForm from './graph-details-form';
import { SubmissionError } from 'redux-form/immutable';
import {confirmation} from '~/lib/confirm-utils';

import {
  updateStaffMemberShift,
  deleteStaffMemberShift,
} from '../actions';

const ROTA_PUBLISHED_STATUS = "published";

class GraphDetails extends React.Component {
  handleSubmit = (values, dispatch, props, type) => {
    function trowErrors(resp) {
      let errors = resp.response.data.errors;
      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        throw new SubmissionError({...errors});
      }
    }
    
    let action;
    const status = props.rotaStatus;
    if (type === 'update') {
      action = () => dispatch(updateStaffMemberShift(values.toJS()));
    }
    if (type === 'delete') {
      action = () => dispatch(deleteStaffMemberShift(values.get('shift_id'), values.get('staff_member_id')));
    }
    if (!action) throw Error('Wrong Rota shift action');

    if (status === ROTA_PUBLISHED_STATUS) {
      return confirmation(["Publishing a rota will send out email confirmations and can't be undone.", "Do you want to continue?"], {
        title: 'WARNING !!!',
        id: 'rota-daily-confirmation'
      }).then(() => {
        return action().catch(resp => {
          trowErrors(resp);
        });
      });
    } else {
      return action().catch(resp => {
        trowErrors(resp);
      });
    }
  }

  render() {
    const {
      staffMember,
      staffTypes,
      rotaShift,
      rotaDate,
    } = this.props;

    const staffType = staffMember && staffTypes.find(staffType => staffType.get('id') === staffMember.get('staff_type'));
    const initialValues = {
      shift_id: rotaShift.get('id'),
      staff_member_id: staffMember.get('id'),
      starts_at: rotaShift.get('starts_at'),
      ends_at: rotaShift.get('ends_at'),
      shift_type: rotaShift.get('shift_type'),
    }

    return (
      <GraphDetailsForm
        onSubmit={this.handleSubmit}
        staffMember={staffMember}
        staffType={staffType}
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotaStatus={this.props.rotaStatus}
      />
    )
  }
}

export default GraphDetails;
