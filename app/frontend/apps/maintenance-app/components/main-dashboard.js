import React from 'react';
import classnames from 'classnames';

import TaskFilter from './task-filter'

export default class MainDashboard extends React.Component {
  handleOnClick() {
    this.props.setFrontendState({ showNewTaskModal: true });
  }

  renderAddTaskButton() {
    if (this.props.currentUser && this.props.currentUser.role === 'maintenance_staff') {
      return;
    }

    return (
      <div className="boss-page-dashboard__buttons-group">
        <button
          type="button"
          className="boss-button boss-button_role_add boss-page-dashboard__button"
          onClick={ this.handleOnClick.bind(this) }
        >
          Add Task
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">Maintenance Page</h1>
              { this.renderAddTaskButton() }
            </div>

            <TaskFilter { ...this.props }/>
          </div>
        </div>
      </div>
    )
  }
}
