import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Select from 'react-select';

import Modal from "react-modal";
import TaskNote from './task-note';
import ImageGallery from './image-gallery'

export default class TaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saveMode: false,
      status: this.props.selectedMaintenanceTask.status,
      previousStatus: this.props.selectedMaintenanceTask.status,
      updateText: 'Update'
    }
  }

  renderTransitions() {
    return this.props.selectedMaintenanceTask.maintenanceTaskTransitions.map((transition) => {
      return (
        <li className={ `boss-overview__activity-item boss-overview__activity-item_role_${transition.toState}` } key={ transition.id }>
          <p className="boss-overview__meta">
            <span className="boss-overview__meta-label">{ transition.toState } by </span>
            <span className="boss-overview__meta-user"> { transition.requesterUser.name } </span>
            <span className="boss-overview__meta-date"> { moment(transition.createdAt).format('HH:mm ddd L') }</span>
          </p>
        </li>
      );
    });
  }

  onClose = () => {
    this.props.setFrontendState({ showModal: false });
    this.props.setCurrentMaintenanceTask(null);
  }

  handleStatusChange(object) {
    this.setState({ status: object.value });
  }

  renderOption(option) {
    return (
      <span>
        <span className={ `Select-color-indicator Select-color-indicator_status_${option.label}` }></span> { option.label }
      </span>
    );
  }

  statusOptions() {
    let allowedTransitions = _.clone(this.props.selectedMaintenanceTask.allowedTransitions);

    allowedTransitions.unshift(this.props.selectedMaintenanceTask.status);

    return _.uniq(allowedTransitions).map((status) => {
      return { label: status, value: status, className: 'Select-value_status_' + status, optionClassName: '' }
    });
  }

  renderCurrentStatus() {
    if (this.state.saveMode) {
      return (
        <form action="#" className="boss-form">
          <div className="boss-form__field boss-form__field_layout_fluid">
            <div className="boss-form__select boss-form__select_size_small-fluid">
              <Select
                name="status"
                onChange={ this.handleStatusChange.bind(this) }
                options={ this.statusOptions() }
                placeholder="Select Status"
                value={ this.state.status }
                searchable={ false }
                clearable={ false }
                optionRenderer={ this.renderOption.bind(this) }
                valueRenderer={ this.renderOption.bind(this) }
              />
            </div>
          </div>
        </form>
      )
    } else {
      return this.renderStatusBadge();
    }
  }

  renderStatusBadge() {
    let status = this.props.selectedMaintenanceTask.status;

    if (status === 'pending') {
      return <p className="boss-button boss-button_type_small boss-button_role_pending boss-button_type_no-behavior">Pending</p>;
    } else if (status === 'rejected') {
      return <p className="boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_alert">Rejected</p>;
    } else if (status === 'completed') {
      return <p className="boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_ok ">Completed</p>;
    } else if (status === 'accepted') {
      return <p className="boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_ok">Accepted</p>;
    }
  }

  renderStatusButton() {
    if (this.props.selectedMaintenanceTask.allowedTransitions.length < 1) {
      return;
    }

    if (this.state.saveMode) {
      return <span className="boss-overview__link boss-overview__link_role_save boss-overview__link_position_after" onClick={ this.handleStatusUpdate.bind(this) }>Save</span>
    } else {
      return <span className="boss-overview__link boss-overview__link_role_edit boss-overview__link_position_after" onClick={ this.handleStatusButtonChange.bind(this) }>{ this.state.updateText }</span>
    }
  }

  handleStatusButtonChange() {
    this.setState({ saveMode: !this.state.saveMode });
  }

  handleStatusUpdate() {
    this.setState({ updateText: 'Updating..' });

    if (this.props.selectedMaintenanceTask.status !== this.state.status) {
      this.props.selectedMaintenanceTask['status'] = this.state.status;

      this.props.changeStatus(this.props.selectedMaintenanceTask).then((argument) => {
        this.setState({ saveMode: !this.state.saveMode });
        this.setState({ updateText: 'Update' });

        if (argument.error) {
          this.props.setFrontendState({
            showErrorBox: true,
            errorMessage: `Invalid transition`
          });
          this.props.selectedMaintenanceTask['status'] = this.state.previousStatus;
          this.setState({ status: this.state.previousStatus });
        }

        this.props.setFrontendState({ showModal: false });
      });
    } else {
      this.setState({ saveMode: !this.state.saveMode });
      this.setState({ updateText: 'Update' });
    }
  }

  renderStatusUpdate() {
    return (
      <div className="boss-overview__group">
        <h4 className="boss-overview__label">
          <span className="boss-overview__label-text">Current Status</span>

          { this.renderStatusButton() }
        </h4>

        <div className="boss-overview__status">
          { this.renderCurrentStatus() }
        </div>
      </div>
    )
  }

  handleButtonClick(e) {
    e.preventDefault();

    $(e.target).closest('.boss-overview__dropdown').each(function() {
      let dropdownAction = $(this).find('.boss-overview__dropdown-switch');
      let dropdownActionText = $(this).find('.boss-overview__dropdown-switch-text');
      let dropdownContent = $(this).find('.boss-overview__dropdown-content');
      let text = dropdownActionText.text();

      if (text === 'Show Notes' || text === 'Hide Notes') {
        dropdownActionText.text(text === 'Show Notes' ? 'Hide Notes' : 'Show Notes');
      } else if (text === 'Show Activity' || text === 'Hide Activity') {
        dropdownActionText.text(text === 'Show Activity' ? 'Hide Activity' : 'Show Activity');
      }

      dropdownAction.toggleClass('boss-overview__dropdown-switch_state_closed');
      dropdownContent.slideToggle().toggleClass('boss-overview__dropdown-content_state_closed');
    });
  }
  
  handleEditClick = () => {
    this.onClose();
    this.props.setFrontendState({ showNewTaskModal: true });
    this.props.setCurrentMaintenanceTask(this.props.selectedMaintenanceTask);
  }

  render() {
    let task = this.props.selectedMaintenanceTask;
    let priority = task.priority.split('_')[0];

    return (
      <Modal
        isOpen={ this.props.frontend.showModal }
        className={{
          afterOpen: 'boss-modal-window boss-modal-window_role_task-overview',
        }}
        onRequestClose={ this.onClose }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close-inner" onClick={ this.onClose }></button>

        <div className="boss-modal-window__header">
          {task.title}
          <button
            onClick={this.handleEditClick}
            className="boss-modal-window__action boss-modal-window__action_role_edit boss-modal-window__action_position_after"
          >Edit</button>
        </div>

        <div className="boss-modal-window__content">
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <div className="boss-overview__group">
                <h4 className="boss-overview__label">
                  <span className="boss-overview__label-text">Priority</span>
                </h4>

                <p className={ `boss-overview__indicator boss-overview__indicator_priority_${priority}` }>{ priority }</p>
              </div>

              <div className="boss-overview__group">
                <h4 className="boss-overview__label">
                  <span className="boss-overview__label-text">Description</span>
                </h4>

                <p className="boss-overview__text">{task.description}</p>
              </div>

              <ImageGallery { ...this.props } />

              { this.renderStatusUpdate() }

              <div className="boss-overview__dropdown boss-overview__dropdown_context_stack boss-overview__dropdown_active-mobile">
                <div className="boss-overview__dropdown-header">
                  <button
                    className="boss-overview__dropdown-switch boss-overview__dropdown-switch_role_activity boss-overview__dropdown-switch_state_closed"
                    onClick={ this.handleButtonClick.bind(this) }
                  >
                    <span className="boss-overview__dropdown-switch-text">Show Activity</span>
                  </button>
                </div>
                <div className="boss-overview__dropdown-content boss-overview__dropdown-content_state_closed">
                  <div className="boss-overview__group">
                    <h4 className="boss-overview__label boss-overview__label_state_hidden-mobile">
                      <span className="boss-overview__label-text">Activity</span>
                    </h4>

                    <ul className="boss-overview__activity">
                      { this.renderTransitions() }

                      <li className="boss-overview__activity-item boss-overview__activity-item_role_created">
                        <p className="boss-overview__meta">
                          <span className="boss-overview__meta-label">Created by </span>
                          <span className="boss-overview__meta-user">{ task.creatorUser.name } </span>
                          <span className="boss-overview__meta-date">{ moment(task.createdAt).format('HH:mm ddd L') }</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <TaskNote { ...this.props } />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
