import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import notify from '~/components/global-notification';

import AssignToUserForm from './form';

import {
  assignUserToTask
} from '../../../actions/validations';

export default class CreateAssignedTo extends React.Component {
  initialValues() {
    let assignToUser = null;
    let assignToSelf = false
    let assignedToUser = this.props.selectedMarketingTask.assignedToUser;

    if (assignedToUser) {
      assignToSelf = assignedToUser.id === this.props.currentUser.id;
      assignToUser = assignToSelf ? null : { id: assignedToUser.id, value: assignedToUser.name };
    } else {
      assignToSelf = false;
      assignToUser = null;
    }

    return {
      id: this.props.selectedMarketingTask.id,
      assign_to_user: assignToUser,
      assign_to_self: assignToSelf,
    }
  }

  submission = (values, dispatch) => {
    console.log(values.toJS());
    return dispatch(assignUserToTask(values.toJS())).then(resp => {
      this.props.queryFilteredMarketingTasks(this.props.filter);
    }).catch(resp => {
      let errors = resp.response.data.errors;

      if (errors) {
        if (errors.base) {
          errors._error = errors.base
        }

        notify('Something went wrong creating this task', {
          interval: 5000,
          status: 'error'
        });

        throw new SubmissionError({...errors});
      }
    })
  }

  marketingUsers() {
    return this.props.marketingTaskUsers.map((marketingTaskUser) => {
      return { id: marketingTaskUser.id, value: marketingTaskUser.name }
    });
  }

  render() {
    return (
      <AssignToUserForm
        submission={this.submission}
        initialValues={this.initialValues()}
        marketingUsers={this.marketingUsers()}
      />
    )
  }
}
