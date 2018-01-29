import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Select from 'react-select';
import Modal from "react-modal";
import safeMoment from '~/lib/safe-moment';

import NoteForm from './note-form';

export default class TimelineModal extends React.Component {
  renderTransitions() {
    return this.props.selectedMarketingTask.marketingTaskTransitions.map((transition) => {
      return (
        <li className={ `boss-overview__activity-item boss-overview__activity-item_role_changed` } key={ transition.id }>
          <p className="boss-overview__meta">
            <span className="boss-overview__meta-text">User </span>
            <span className="boss-overview__meta-marked"> { transition.requesterUser.name } </span>
            <span className="boss-overview__meta-text">set status to </span>
            <span className="boss-overview__meta-marked">{ transition.toState } </span>
            <span className="boss-overview__meta-date"> { moment(transition.createdAt).format('HH:mm ddd L') }</span>
          </p>
        </li>
      );
    });
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
