import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import constants from '../constants';
import oFetch from 'o-fetch';
import Select from 'react-select';

export default class TaskComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingStatus: false,
      status: oFetch(this.props.currentMaintenanceTask, 'status'),
      confirmText: 'Confirm',
      previousStatus: oFetch(this.props.currentMaintenanceTask, 'status')
    }
  }

  componentDidMount() {
    $('.boss-check[data-task-id="' + this.props.currentMaintenanceTask.id + '"]').each(function() {
      var panelDropdownIcon = $(this).find('.boss-check__indicator_role_dropdown-switch'),
          panelDropdown = $(this).find('.boss-check__dropdown'),
          panelStatusLabel = $(this).find('.boss-check__cell_role_status-label');

      function togglePanelDropdown(e) {
        e.preventDefault();
        panelDropdownIcon.toggleClass('boss-check__indicator_state_dropdown-closed');
        panelDropdown.slideToggle().toggleClass('boss-dropdown_state_closed');
        panelStatusLabel.toggleClass('boss-check__cell_adjust_single-row');
      }

      panelDropdownIcon.on('click', togglePanelDropdown);
    });
  }

  handleDetailsClick() {
    this.props.setFrontendState({ showModal: true });
    this.props.setCurrentMaintenanceTask(this.props.currentMaintenanceTask);
  }

  handleEditClick() {
    this.props.setFrontendState({ showNewTaskModal: true });
    this.props.setCurrentMaintenanceTask(this.props.currentMaintenanceTask);
  }

  renderOption(option) {
    return (
      <span>
        <span className={ `Select-color-indicator Select-color-indicator_status_${option.label}` }></span> { option.label }
      </span>
    );
  }

  renderStatusBar(task) {
    if (this.state.editingStatus) {
      return (
        <div className={ `boss-check__cell boss-check__cell_role_status-label boss-check__cell_status_${task.status} boss-check__cell_adjust_single-row` }>
          <form className="boss-form">
            <div className="boss-form__field">
              <div className="boss-form__select">
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
        </div>
      );
    } else {
      return (
        <div className={ `boss-check__cell boss-check__cell_role_status-label boss-check__cell_status_${task.status} boss-check__cell_adjust_single-row` }>
          <p className="boss-check__text boss-check__text_role_status-label">{ task.status.toUpperCase() }</p>
        </div>
      );
    }
  }

  renderStatusUpdateButton() {
    if (this.state.editingStatus) {
      return (
        <button className="boss-button boss-button_type_small boss-button_role_confirm boss-table__action" onClick={ this.saveState.bind(this) }>{ this.state.confirmText }</button>
      );
    } else {
      return (
        <button
          className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
          onClick={ this.enableEditing.bind(this) }
          disabled={ this.props.currentMaintenanceTask.allowedTransitions.length < 1 }
        >Update status</button>
      );
    }
  }

  renderActionsCell() {
    if (this.props.currentUser && this.props.currentUser.role === 'maintenance_staff') {
      return;
    }

    return (
      <div className="boss-table__cell">
        <div className="boss-table__info">
          <div className="boss-table__actions">
            <button className="boss-button boss-button_type_small boss-button_role_edit-light-alt boss-table__action" onClick={ this.handleEditClick.bind(this) }>Edit</button>
            <button className="boss-button boss-button_type_small boss-button_role_cancel-light boss-table__action" onClick={ this.handleDelete.bind(this) }>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  handleDelete() {
    this.props.setCurrentMaintenanceTask(this.props.currentMaintenanceTask);
    this.props.setFrontendState({ showDeleteModal: true });
  }

  enableEditing() {
    this.setState({ editingStatus: true });
  }

  handleStatusChange(object) {
    this.setState({ status: object.value });
  }

  saveState(e) {
    let _this = this;
    this.setState({ confirmText: 'Confirming..' });

    if (this.props.currentMaintenanceTask.status !== this.state.status) {
      // this.setState({ previousStatus: this.state.status });
      this.props.currentMaintenanceTask['status'] = this.state.status;

      this.props.changeStatus(this.props.currentMaintenanceTask).then((argument) => {
        this.setState({ editingStatus: false });
        this.setState({ confirmText: 'Confirm' });

        if (argument.error) {
          this.props.setFrontendState({
            showErrorBox: true,
            errorMessage: `Invalid transition`
          });
          this.props.currentMaintenanceTask['status'] = this.state.previousStatus;
          this.setState({ status: this.state.previousStatus });
          this.setState({ confirmText: 'Confirm' });
        }
      });
    } else {
      this.setState({ editingStatus: false });
      this.setState({ confirmText: 'Confirm' });
    }
  }

  statusOptions() {
    let allowedTransitions = _.clone(this.props.currentMaintenanceTask.allowedTransitions);

    allowedTransitions.unshift(this.props.currentMaintenanceTask.status);

    return _.uniq(allowedTransitions).map((status) => {
      return { label: status, value: status, className: 'Select-value_status_' + status, optionClassName: '' }
    });
  }

  renderTitle(task) {
    let klassNames = [];

    if (task.maintenanceTaskNotes.length) klassNames.push('boss-check__title_indicator_notes');
    if (task.maintenanceTaskImages.length) klassNames.push('boss-check__title_indicator_images');

    if (task.maintenanceTaskNotes.length && task.maintenanceTaskImages.length) klassNames = ['boss-check__title_indicator_notes-images'];

    return (
      <h3 className={ `boss-check__title ${ klassNames.join(' ') }` }>{ task.title }</h3>
    );
  }

  render() {
    let currentTask = this.props.currentMaintenanceTask;
    let tableClass = 'boss-table_page_maintenance-managers-index-card';

    if (this.props.currentUser && this.props.currentUser.role === 'maintenance') {
      tableClass = 'boss-check_page_maintenance-index';
    }

    return (
      <div className="boss-check boss-check_role_board boss-check_page_maintenance-index" data-task-id={ currentTask.id }>
        <div className="boss-check__row boss-check__row_role_status">
          { this.renderStatusBar(currentTask) }

          <div className="boss-check__cell boss-check__cell_role_status-title">
            { this.renderTitle(currentTask) }

            <div
              className={ `boss-check__indicator boss-check__indicator_priority_${currentTask.priority.split('_')[0]} boss-check__indicator_role_dropdown-switch boss-check__indicator_state_dropdown-closed` }
            >
              Toggle Dropdown
            </div>
          </div>
        </div>

        <div className="boss-check__dropdown boss-check__dropdown_state_closed">
          <div className={ `boss-table ${tableClass}` }>
            <div className="boss-table__row">
              <div className="boss-table__cell">
                <div className="boss-table__info">
                  <p className="boss-table__text boss-table__text_role_venue">{ currentTask.venue.name }</p>
                </div>
              </div>

              <div className="boss-table__cell">
                <div className="boss-table__info">
                  <p className="boss-table__text boss-table__text_role_date">{ moment(currentTask.createdAt).format('ddd L') }</p>
                </div>
              </div>

              <div className="boss-table__cell">
                <div className="boss-table__info">
                  <div className="boss-table__actions">
                    <button
                      className="boss-button boss-button_type_small boss-button_role_view-report boss-table__action"
                      onClick={ this.handleDetailsClick.bind(this) }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="boss-table__cell">
                <div className="boss-table__info">
                  <div className="boss-table__actions">
                    { this.renderStatusUpdateButton() }
                  </div>
                </div>
              </div>

              { this.renderActionsCell() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
