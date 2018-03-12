import React from 'react';
import classnames from 'classnames';
import { userPermissions } from "~/lib/user-permissions";
import oFetch from 'o-fetch';

export default class GrabButton extends React.Component {
  handleGrabButton() {
    if (this.props.currentMarketingTask.status === 'completed') return;

    this.props.setSelectedMarketingTask(this.props.currentMarketingTask);
    this.props.setFrontendState({ showAssignedToModal: true });
  }

  assignTaskToSelf() {
    if (this.props.currentMarketingTask.status === 'completed') return;

    this.props.assignTaskToSelf(this.props.currentMarketingTask)
  }

  render() {
    const permissions = oFetch(this.props, 'permissions');
    const marketingTaskPermissionService = oFetch(userPermissions, 'marketingTasks');
    const currentMarketingTask = oFetch(this.props, 'currentMarketingTask');

    //Used to drive permission code
    const grabbedMarketingTask = Object.assign(currentMarketingTask, {assignToUser: {id: oFetch(permissions, 'userId')}})

    if (this.props.currentMarketingTask.assignedToUser) {
      return (
        <button className="boss-button boss-button_role_user-light boss-button_type_extra-small" onClick={ this.handleGrabButton.bind(this) }>
          { this.props.currentMarketingTask.assignedToUser.name }
        </button>
      )
    } else if (this.props.currentMarketingTask.status === 'completed') {
      return (
        <span></span>
      );
    } else if(!marketingTaskPermissionService.canAssignTask({marketingTask: grabbedMarketingTask, permissions: permissions})) {
      return <span></span>;
    } else {
      return (
        <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_user">
          <button className="boss-button boss-button_type_extra-small" onClick={ this.assignTaskToSelf.bind(this) }>Grab</button>
        </p>
      )
    }
  }
}
