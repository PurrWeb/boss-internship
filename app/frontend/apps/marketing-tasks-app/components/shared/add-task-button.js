import React from 'react';
import classnames from 'classnames';
import { userPermissions } from "~/lib/user-permissions";

export default class AddTaskButton extends React.Component {
  handleAddTaskClick() {
    this.props.setFrontendState({ showCreateTaskModal: true, taskType: this.props.taskType });
    this.props.setSelectedMarketingTask(null);
  }

  render() {
    if (!userPermissions.marketingTasks.canCreateTask(this.props.permissions)) return <span></span>;

    return (
      <button className="boss-button boss-button_type_small boss-button_role_add boss-board__action" type="button" onClick={ this.handleAddTaskClick.bind(this) }>Add</button>
    );
  }
}
