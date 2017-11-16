import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import humanize from 'string-humanize';
import constants from '../constants';
import oFetch from 'o-fetch';
import Select from 'react-select';

const HIGH_PRIORITY = 'high_priority';
const MEDIUM_PRIORITY = 'medium_priority';
const LOW_PRIORITY = 'low_priority';

const STATUS_PENDING = 'pending';
const STATUS_COMPLETED = 'completed';
const STATUS_REJECTED = 'rejected';
const STATUS_ACCEPTED = 'accepted';


const PRIORITY_TITLES = {
  [HIGH_PRIORITY]: 'H',
  [MEDIUM_PRIORITY]: 'M',
  [LOW_PRIORITY]: 'L',
};

const PRIORITY_CLASS_SUFFIXES = {
  [HIGH_PRIORITY]: 'high',
  [MEDIUM_PRIORITY]: 'medium',
  [LOW_PRIORITY]: 'low',
};

const STATUS_CLASS_SUFFIXES = {
  [STATUS_PENDING]: 'pending',
  [STATUS_COMPLETED]: 'ok',
  [STATUS_REJECTED]: 'alert',
  [STATUS_ACCEPTED]: 'ok',
};

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
      var panelDropdownIcon = $(this).find('.boss-check__dropdown-link'),
          panelDropdown = $(this).find('.boss-check__dropdown'),
          panelStatusLabel = $(this).find('.boss-check__cell_role_status-label');

      function togglePanelDropdown(e) {
        e.preventDefault();
        panelDropdownIcon.toggleClass('boss-check__dropdown-link_state_closed');
        panelDropdown.slideToggle().toggleClass('boss-check__dropdown_state_closed');
        panelStatusLabel.toggleClass('boss-check__cell_adjust_single-row');
      }

      panelDropdownIcon.on('click', togglePanelDropdown);
    });
  }

  handleDetailsClick = () => {
    this.props.setFrontendState({ showModal: true });
    this.props.setCurrentMaintenanceTask(this.props.currentMaintenanceTask);
  }

  renderOption = (option) => {
    return (
      <span>
        <span className={ `Select-color-indicator Select-color-indicator_status_${option.label}` }></span> { option.label }
      </span>
    );
  }

  renderPriorityBar(task) {
    return (
      <div className={`boss-check__indicator boss-check__indicator_priority_${PRIORITY_CLASS_SUFFIXES[task.priority]} boss-check__indicator_position_before`}>
        {PRIORITY_TITLES[task.priority]}
      </div>
    );
  }

  renderStatus(task) {
    return (
      <div className="boss-check__header-status">
        <p className={`boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_${STATUS_CLASS_SUFFIXES[task.status]} boss-check__title-label`}>
          {humanize(task.status)}
        </p>
      </div>
    );
  }

  renderToggleButton(task) {
    return (
      <div className="boss-check__dropdown-link boss-check__dropdown-link_type_icon boss-check__dropdown-link_state_closed">
        Toggle Dropdown
      </div>
    )
  }

  renderActionsCell() {
    if (this.props.currentUser && this.props.currentUser.role === 'maintenance_staff') {
      return null;
    }

    return (
      <div className="boss-table__cell">
        <div className="boss-table__info">
          <div className="boss-table__actions">
            <button className="boss-button boss-button_type_small boss-button_role_view-details-light boss-table__action" onClick={ this.handleDetailsClick }>View/Edit</button>
            <button className="boss-button boss-button_type_small boss-button_role_cancel-light boss-table__action" onClick={ this.handleDelete }>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  handleDelete = () => {
    this.props.setCurrentMaintenanceTask(this.props.currentMaintenanceTask);
    this.props.setFrontendState({ showDeleteModal: true });
  }

  enableEditing() {
    this.setState({ editingStatus: true });
  }

  handleStatusChange = (object) => {
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
    let tableClass = 'boss-table boss-table_page_maintenance-index-card';

    if (this.props.currentUser && this.props.currentUser.role === 'maintenance') {
      tableClass = 'boss-check_page_maintenance-index';
    }

    return (
      <div className="boss-check boss-check_role_board boss-check_page_maintenance-index" data-task-id={ currentTask.id }>
        <div className="boss-check__header">
          <div className="boss-check__header-info">
            {this.renderPriorityBar(currentTask)}
            {this.renderTitle(currentTask)}
          </div>
          {this.renderStatus(currentTask)}
          {this.renderToggleButton(currentTask)}
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

              { this.renderActionsCell() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
