import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import safeMoment from '~/lib/safe-moment';
import { userPermissions } from "~/lib/user-permissions";

import ToolTip from '../../../clock-in-out/components/tooltip';

export default class StatusBadge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTooltipActive: false,
      completedDisabled: false,
      pendingDisabled: false,
    }

    const randomNum = Math.floor(Math.random() * 1000000);
    this.changeStatusButtonId = `changeButton${randomNum}`;

    window.getTooltipRoot = function() {
      return document.querySelector('body');
    }
  }

  activateToolTip() {
    if (!userPermissions.marketingTasks.canUpdateStatusTask(this.props.permissions)) return;

    if (this.props.currentMarketingTask.status === 'disabled') return;

    this.setState({ isTooltipActive: true });
  }

  renderBadge() {
    let task = this.props.currentMarketingTask;

    if (task.status === 'completed') {
      return (
        <div
          className="boss-check__marker boss-check__marker_status_completed boss-check__marker_role_edit-action boss-check__marker_position_before"
          onClick={ this.activateToolTip.bind(this) }
          id={ this.changeStatusButtonId }
        >
          <span className="boss-check__marker-label">Completed</span>
        </div>
      )
    } else if (task.status === 'pending') {
      return (
        <div
          className="boss-check__marker boss-check__marker_status_pending boss-check__marker_role_edit-action boss-check__marker_position_before"
          onClick={ this.activateToolTip.bind(this) }
          id={ this.changeStatusButtonId }
        >
          <span className="boss-check__marker-label">Pending</span>
        </div>
      )
    } else if (task.status === 'disabled' || task.status === 'deleted') {
      return (
        <div
          className="boss-check__marker boss-check__marker_status_deleted boss-check__marker_role_edit-action boss-check__marker_position_before"
          onClick={ this.activateToolTip.bind(this) }
          id={ this.changeStatusButtonId }
        >
          <span className="boss-check__marker-label">Deleted</span>
        </div>
      )
    }
  }

  closeToolTip() {
    this.setState({ isTooltipActive: false });
  }

  onPendingClick() {
    if (!userPermissions.marketingTasks.canUpdateStatusTask(this.props.permissions)) return;

    this.setState({ pendingDisabled: true });

    this.props.changeStatus(this.props.currentMarketingTask, 'pending').then(() => {
      // this.props.queryFilteredMarketingTasks(this.props.filter);
      this.closeToolTip();
      this.setState({ pendingDisabled: false });
    });
  }

  onCompletedClick() {
    if (!userPermissions.marketingTasks.canUpdateStatusTask(this.props.permissions)) return;

    this.setState({ completedDisabled: true });

    this.props.changeStatus(this.props.currentMarketingTask, 'completed').then(() => {
      // this.props.queryFilteredMarketingTasks(this.props.filter);
      this.closeToolTip();
      this.setState({ completedDisabled: false });
    });
  }

  renderStatusButtons() {
    let task = this.props.currentMarketingTask;

    if (task.status === 'completed') {
      return (
        <div className="boss-tooltip-portal__actions boss-tooltip-portal__actions_role_column">
          <button
            className="boss-button boss-button_role_pending-task boss-tooltip-portal__action"
            onClick={ this.onPendingClick.bind(this) }
            disabled={ this.state.pendingDisabled }
          >
            'Pending'
          </button>
        </div>
      )
    } else if (task.status === 'pending') {
      return (
        <div className="boss-tooltip-portal__actions boss-tooltip-portal__actions_role_column">
          <button
            className="boss-button boss-button_role_confirmed-task boss-tooltip-portal__action"
            onClick={ this.onCompletedClick.bind(this) }
            disabled={ this.state.completedDisabled }
          >
            'Completed'
          </button>
        </div>
      )
    }
  }

  render() {
    const toolTipStyle = {
      style: {
        position: 'absolute',
        top: '331px',
        left: '456px',
        padding: '0.6em 0.9em',
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #f2f2f2',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.17)'
      },
      arrowStyle: {
        borderColor: '#f2f2f2'
      }
    };

    return (
      <span>
        { this.renderBadge() }

        <ToolTip
          active={ this.state.isTooltipActive }
          position="bottom"
          tooltipTimeout={50}
          arrow="right"
          parent={ `#${this.changeStatusButtonId}` }
          group="change-settings"
          style={ toolTipStyle }
          onBackgroundClick={ this.closeToolTip.bind(this) }
        >
          <div className="boss-tooltip-portal__content">
            { this.renderStatusButtons() }
          </div>
        </ToolTip>
      </span>
    );
  }
}
