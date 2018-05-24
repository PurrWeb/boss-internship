import React from 'react';
import classnames from 'classnames';

import TaskComponent from './task-component';
import Pagination from './pagination';
import TaskModal from './task-modal';
import NewTaskModal from './new-task-modal';
import DeleteTaskModal from './delete-task-modal';

export default class MainContent extends React.Component {
  renderTaskComponents() {
    return this.props.maintenanceTasks.map((venue, index) => {
      let props = { ...this.props }

      props = Object.assign(props, { currentMaintenanceTask: venue });

      return <TaskComponent {...props} key={venue.id} />;
    })
  }

  renderTaskModal() {
    if (this.props.frontend.showModal) {
      return <TaskModal {...this.commonProps()} />
    }
  }

  renderNewTaskModal() {
    if (this.props.frontend.showNewTaskModal) {
      return <NewTaskModal {...this.commonProps()} />
    }
  }

  renderDeleteModal() {
    if (this.props.frontend.showDeleteModal) {
      return <DeleteTaskModal {...this.commonProps()} />
    }
  }

  queryMaintenanceTasks = (params = null) => {
    let startDate, endDate;

    if (this.props.filter.startDate) {
      startDate = this.props.filter.startDate.format('DD/MM/YYYY');
    }

    if (this.props.filter.endDate) {
      endDate = this.props.filter.endDate.format('DD/MM/YYYY');
    }

    if (params) {
      this.props.queryMaintenanceTasks(params);
    } else {
      this.props.queryMaintenanceTasks({
        startDate: startDate,
        endDate: endDate,
        statuses: this.props.filter.statuses,
        priorities: this.props.filter.priorities,
        venues: this.props.filter.venues,
        page: 1
      });
    }
  }

  commonProps() {
    let { ...props } = this.props;

    props = Object.assign(props, {
      queryMaintenanceTasks: this.queryMaintenanceTasks,
    });

    return props;
  }

  render() {
    const { updating } = this.props.filter;

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          {updating ? <div className="boss-spinner"></div> : (
            <div>
              {this.renderTaskComponents()}
              <Pagination {...this.props} />
            </div>
          )}
          {this.renderTaskModal()}
          {this.renderNewTaskModal()}
          {this.renderDeleteModal()}
        </div>
      </div>
    )
  }
}
