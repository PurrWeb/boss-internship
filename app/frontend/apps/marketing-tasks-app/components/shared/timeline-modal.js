import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Select from 'react-select';
import Modal from "react-modal";
import safeMoment from '~/lib/safe-moment';

import NoteForm from './note-form';

export default class TimelineModal extends React.Component {
  renderTransitions() {
    return this.props.selectedMarketingTask.timelineActivities.map((timelineActivity) => {
      if (timelineActivity.toState == 'assigned') {
        return this.handleAssignedActivities(timelineActivity);
      } else if (timelineActivity.toState == 'unassigned') {
        return this.handleUnassignedActivities(timelineActivity);
      } else {
        return this.handleDefaultActivities(timelineActivity);
      }
    });
  }

  handleDefaultActivities(timelineActivity) {
    return (
      <li className={ `boss-overview__activity-item boss-overview__activity-item_role_changed` } key={ timelineActivity.id }>
        <p className="boss-overview__meta">
          <span className="boss-overview__meta-text">User </span>
          <span className="boss-overview__meta-marked"> { timelineActivity.requesterUser.name } </span>
          <span className="boss-overview__meta-text">set status to </span>
          <span className="boss-overview__meta-marked">{ timelineActivity.toState } </span>
          <span className="boss-overview__meta-date"> { moment(timelineActivity.createdAt).format('HH:mm ddd L') }</span>
        </p>
      </li>
    );
  }

  handleAssignedActivities(timelineActivity) {
    return (
      <li className={ `boss-overview__activity-item boss-overview__activity-item_role_changed` } key={ timelineActivity.id }>
        <p className="boss-overview__meta">
          <span className="boss-overview__meta-text">User </span>
          <span className="boss-overview__meta-marked"> { timelineActivity.requesterUser.name } </span>
          <span className="boss-overview__meta-text">assigned to task </span>
          <span className="boss-overview__meta-date"> { moment(timelineActivity.createdAt).format('HH:mm ddd L') }</span>
        </p>
      </li>
    );
  }

  handleUnassignedActivities(timelineActivity) {
    return (
      <li className={ `boss-overview__activity-item boss-overview__activity-item_role_changed` } key={ timelineActivity.id }>
        <p className="boss-overview__meta">
          <span className="boss-overview__meta-text">User </span>
          <span className="boss-overview__meta-marked"> { timelineActivity.requesterUser.name } </span>
          <span className="boss-overview__meta-text">unassigned from task </span>
          <span className="boss-overview__meta-date"> { moment(timelineActivity.createdAt).format('HH:mm ddd L') }</span>
        </p>
      </li>
    );
  }

  onClose() {
    this.props.setFrontendState({ showTimelineModal: false });
    this.props.setSelectedMarketingTask(null);
  }

  render() {
    let task = this.props.selectedMarketingTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showTimelineModal }
        className={{
          afterOpen: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_task-overview',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close" onClick={ this.onClose.bind(this) }></button>

        <div className="boss-modal-window__header">
          Task Timeline
        </div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <ul className="boss-overview__activity">
                { this.renderTransitions() }

                <li className="boss-overview__activity-item boss-overview__activity-item_role_created">
                  <p className="boss-overview__meta">
                    <span className="boss-overview__meta-label">Created by </span>
                    <span className="boss-overview__meta-user">{ task.createdByUser.name } </span>
                    <span className="boss-overview__meta-date">{ moment(task.createdAt).format('HH:mm ddd L') }</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
