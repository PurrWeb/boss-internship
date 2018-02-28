import React from 'react';
import classnames from 'classnames';
import oFetch from 'o-fetch';
import { userPermissions } from "~/lib/user-permissions";

export default class AddTaskButton extends React.Component {
  handleAddTaskClick() {
    this.props.setFrontendState({ showCreateTaskModal: true, taskType: this.props.taskType });
    this.props.setSelectedMarketingTask(null);
  }

  render() {
    const permissions = oFetch(this.props, 'permissions');
    const marketingTaskPermissionService = oFetch(userPermissions, 'marketingTasks');

    if (!marketingTaskPermissionService.canCreateTasks(permissions)) return <span></span>;

    return (
      <button className="boss-button boss-button_type_small boss-button_role_add boss-board__action" type="button" onClick={ this.handleAddTaskClick.bind(this) }>Add</button>
    );
  }
}
