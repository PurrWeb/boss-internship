import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import { userPermissions } from "~/lib/user-permissions";

export default class TaskFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restoreText: 'Restore'
    }
  }

  handleRestoreClick() {
    this.setState({ restoreText: 'Restoring..' });

    this.props.restoreMarketingTask(this.props.currentMarketingTask).then(() => {
      this.setState({ restoreText: 'Restore' });
    });
  }

  handleEditClick() {
    this.props.setSelectedMarketingTask(this.props.currentMarketingTask);
    this.props.setFrontendState({ showEditTaskModal: true, taskType: this.props.taskType });
  }

  handleDeleteClick() {
    this.props.setSelectedMarketingTask(this.props.currentMarketingTask);
    this.props.setFrontendState({ showDeleteTaskModal: true });
  }

  handleViewNotesClick() {
    this.props.setSelectedMarketingTask(this.props.currentMarketingTask);
    this.props.setFrontendState({ showNotesModal: true });
  }

  handleViewTimelineClick() {
    this.props.setSelectedMarketingTask(this.props.currentMarketingTask);
    this.props.setFrontendState({ showTimelineModal: true });
  }

  renderAdminActions() {
    const currentMarketingTask = oFetch(this.props, 'currentMarketingTask');
    if (oFetch(currentMarketingTask, 'status') !== 'disabled') {
      return this.renderEnabledTaskAdminActions(currentMarketingTask)
    } else {
      return this.renderDisabledTaskAdminActions(currentMarketingTask)
    }
  }

  renderEnabledTaskAdminActions(currentMarketingTask){
    const permissions = oFetch(this.props, 'permissions');
    const marketingTaskPermissions = oFetch(userPermissions, 'marketingTasks');
    const canEditTask = marketingTaskPermissions.canEditTask({marketingTask: currentMarketingTask, permissions: this.props.permissions});
    const canDestroyTask = marketingTaskPermissions.canDestroyTask({marketingTask: currentMarketingTask, permissions: this.props.permissions});

    if (!canEditTask && !canDestroyTask) {
      return <span></span>;
    } else{
      return (
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <div className="boss-table__actions">
              { canEditTask && <button className="boss-button boss-button_type_small boss-button_role_edit-light-alt boss-table__action" onClick={ this.handleEditClick.bind(this) }>Edit</button> }
              { canDestroyTask && <button className="boss-button boss-button_type_small boss-button_role_cancel-light boss-table__action" onClick={ this.handleDeleteClick.bind(this) }>Delete</button> }
            </div>
          </div>
        </div>
      )
    }
  }

  renderDisabledTaskAdminActions(currentMarketingTask){
    const permissions = oFetch(this.props, 'permissions');
    const marketingTaskPermissions = oFetch(userPermissions, 'marketingTasks');
    const canRestoreTask = marketingTaskPermissions.canRestoreTask({ marketingTask: currentMarketingTask, permissions: permissions });

    if (!canRestoreTask) {
      return <span></span>
    } else {
      return (
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <div className="boss-table__actions">
              <button className="boss-button boss-button_type_small boss-button_role_confirm-light boss-table__action" onClick={ this.handleRestoreClick.bind(this) }>
                { this.state.restoreText }
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="boss-table boss-table_page_marketing-managers-index-card">
        <div className="boss-table__row">
          <div className="boss-table__cell">
            <div className="boss-table__info">
              <div className="boss-table__actions">
                <button className="boss-button boss-button_type_small boss-button_role_view-timeline-light boss-table__action" onClick={ this.handleViewTimelineClick.bind(this) }>
                  View Timeline
                </button>

                <button className="boss-button boss-button_type_small boss-button_role_view-notes-light boss-table__action" onClick={ this.handleViewNotesClick.bind(this) }>
                  View Notes
                </button>
              </div>
            </div>
          </div>

          { this.renderAdminActions() }
        </div>
      </div>
    );
  }
}
