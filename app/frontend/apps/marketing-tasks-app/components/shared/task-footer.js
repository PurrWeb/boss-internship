import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import safeMoment from '~/lib/safe-moment';
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
    if (!userPermissions.marketingTasks.canDestroyTask(this.props.permissions)) return <span></span>;

    if (this.props.currentMarketingTask.status !== 'disabled') {
      return (
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <div className="boss-table__actions">
              <button className="boss-button boss-button_type_small boss-button_role_edit-light-alt boss-table__action" onClick={ this.handleEditClick.bind(this) }>Edit</button>
              <button className="boss-button boss-button_type_small boss-button_role_cancel-light boss-table__action" onClick={ this.handleDeleteClick.bind(this) }>Delete</button>
            </div>
          </div>
        </div>
      );
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
