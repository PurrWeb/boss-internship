import React from 'react';
import classnames from 'classnames';

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
    if (this.props.currentMarketingTask.assignedToUser) {
      return (
        <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_user boss-check__text_role_edit-action" onClick={ this.handleGrabButton.bind(this) }>
          { this.props.currentMarketingTask.assignedToUser.name }
        </p>
      )
    } else if (this.props.currentMarketingTask.status === 'completed') {
      return (
        <span></span>
      );
    } else {
      return (
        <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_user">
          <button className="boss-button boss-button_type_extra-small" onClick={ this.assignTaskToSelf.bind(this) }>Grab</button>
        </p>
      )
    }
  }
}
