import React from 'react';
import classnames from 'classnames';

import TaskFilter from './task-filter';

export default class MainDashboard extends React.Component {
  handleOnClick() {
    this.props.setFrontendState({ showNewTaskModal: true });
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">Marketing</h1>
            </div>

            <TaskFilter { ...this.props }/>
          </div>
        </div>
      </div>
    )
  }
}
