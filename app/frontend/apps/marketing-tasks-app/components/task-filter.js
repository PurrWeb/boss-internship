import React from 'react';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';

import Select from 'react-select';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';


export default class TaskFilter extends React.Component {
  componentDidMount() {
    $('.boss-dropdown').each(function(){
      let filterSwitch = $(this).find('.boss-dropdown__switch'),
        filterContent = $(this).find('.boss-dropdown__content'),
        pageContent = $('.boss-page-main__content');

      function toggleFilter(e) {
        e.preventDefault();

        filterSwitch.toggleClass('boss-dropdown__switch_state_opened');
        filterContent.slideToggle().end().toggleClass('boss-dropdown__content_state_opened');
      }

      filterSwitch.on('click', toggleFilter);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      venues: oFetch(this.props.filter, 'venues'),
      assignedToUser: oFetch(this.props.filter, 'assignedToUser'),
      statuses: oFetch(this.props.filter, 'statuses'),
      startDate: {},
      endDate: {},
      lateTaskOnlyChecked: false,
      showAllChecked: true
    }
  }

  onDatesChange(id, { startDate, endDate }) {
    const start = this.state.startDate;
    const end = this.state.endDate;
    start[id] = startDate;
    end[id] = endDate;
    this.setState({
      startDate: start,
      endDate: end,
    });
  }

  onFocusChange(id, value) {
    const focusedInput = this.state.focusedInput;
    focusedInput[id] = value;
    this.setState({
      focusedInput,
    });
  }

  venueOptions() {
    return this.props.venues.map((venue) => {
      return { label: venue.name, value: venue.id + '' }
    });
  }

  marketingUsers() {
    return this.props.marketingTaskUsers.map((marketingTaskUser) => {
      return { label: marketingTaskUser.name, value: marketingTaskUser.id + '' }
    });
  }

  statusOptions() {
    return this.props.statuses.map((status) => {
      return { label: status, value: status, className: 'Select-value_status_' + status, optionClassName: '' }
    });
  }

  handleVenueChange(venues) {
    this.setState({ venues: venues })
    this.props.setFilterParams({ venues: venues });
  }

  handleAssignedToUserChange(assignedToUser) {
    this.setState({ assignedToUser: assignedToUser })
    this.props.setFilterParams({ assignedToUser: assignedToUser });
  }

  handleStatusChange(statuses) {
    this.setState({ statuses: statuses })
    this.props.setFilterParams({ statuses: statuses });
  }

  handleAssignedToSelfChange(e) {
    this.setState({ assignedToSelf: e.target.checked, assignedToUser: null })
    this.props.setFilterParams({ assignedToSelf: e.target.checked, assignedToUser: null });
  }

  setShowAllChecked() {
    this.setState({ showAllChecked: true });
    this.setState({ lateTaskOnlyChecked: false });
  }

  setLateTaskOnly() {
    this.setState({ showAllChecked: false });
    this.setState({ lateTaskOnlyChecked: true });
  }

  setFilter(e) {
    if (e.target.value == 'showAll') {
      this.setShowAllChecked();

      this.props.setFilterParams({ lateTaskOnly: false });
    } else {
      this.setLateTaskOnly();

      this.props.setFilterParams({ lateTaskOnly: true });
    }
  }

  setAndQueryMarketingTasks = (e) => {
    e.preventDefault();

    return this.queryMarketingTasks();
  }

  queryMarketingTasks() {
    let dueAtStartDate, dueAtEndDate, completedAtStartDate, completedAtEndDate;

    if (this.state.startDate['dueAt']) {
      dueAtStartDate = this.state.startDate['dueAt'].format('DD/MM/YYYY');
    }

    if (this.state.endDate['dueAt']) {
      dueAtEndDate = this.state.endDate['dueAt'].format('DD/MM/YYYY');
    }

    if (this.state.startDate['completedAt']) {
      completedAtStartDate = this.state.startDate['completedAt'].format('DD/MM/YYYY');
    }

    if (this.state.endDate['completedAt']) {
      completedAtEndDate = this.state.endDate['completedAt'].format('DD/MM/YYYY');
    }

    let self = this;

    let assignedToUser = null;

    if (this.props.filter.assignedToUser) {
      assignedToUser = this.props.filter.assignedToUser.value
    }

    return this.props.queryMarketingTasks({
      dueAtStartDate: dueAtStartDate,
      dueAtEndDate: dueAtEndDate,
      completedAtStartDate: completedAtStartDate,
      completedAtEndDate: completedAtEndDate,
      lateTaskOnly: this.state.lateTaskOnlyChecked,
      statuses: this.props.filter.statuses,
      venues: this.props.filter.venues,
      assignedToSelf: this.props.filter.assignedToSelf,
      assignedToUser: assignedToUser,
      page: 1
    }).then(() => {
      self.props.setFilterParams({
        startDate: self.state.startDate,
        endDate: self.state.endDate,
        statuses: self.state.statuses,
        venues: self.state.venues,
        lateTaskOnly: self.state.lateTaskOnlyChecked,
        assignedToSelf: self.props.filter.assignedToSelf,
        assignedToUser: self.props.filter.assignedToUser,
      });
    });
  }

  renderFilterUpdate() {
    return <AsyncButton
            onClick={this.setAndQueryMarketingTasks}
            className="boss-button boss-form__submit boss-form__submit_adjust_single"
            text="Update"
            pendingText="Updating ..."
          />
  }

  renderOption(option) {
    return (
      <span className="Select-staff-member">
        <span className="Select-staff-member-info">
          <span className="Select-staff-member-name">{ option.label }</span>
        </span>
      </span>
    );
  }

  render() {
    return (
      <div className="boss-page-dashboard__filter">
        <div className="boss-dropdown">
          <div className="boss-dropdown__header">
            <a href="#" className="boss-dropdown__switch boss-dropdown__switch_role_filter">Filtering</a>
          </div>

          <div className="boss-dropdown__content">
            <div className="boss-dropdown__content-inner">
              <form action="#" className="boss-form">
                <div className="boss-form__row">
                  <div className="boss-form__field boss-form__field_no-label boss-form__field_layout_fluid">
                    <div className="boss-form__switcher">
                      <label className="boss-form__switcher-label">
                        <input type="radio" name="display" value="lateTaskOnly" className="boss-form__switcher-radio" checked={ this.state.lateTaskOnlyChecked } onChange={ this.setFilter.bind(this) } />
                        <span className="boss-form__switcher-label-text">Late Tasks Only</span>
                      </label>

                      <label className="boss-form__switcher-label">
                        <input type="radio" name="display" value="showAll" className="boss-form__switcher-radio" checked={ this.state.showAllChecked } onChange={ this.setFilter.bind(this) } />
                        <span className="boss-form__switcher-label-text">Show All</span>
                      </label>
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_half">
                    <p className="boss-form__label"><span className="boss-form__label-text">Due Date</span></p>
                    <div className="date-control date-control_type_icon date-control_type_interval-fluid date-control_adjust_third">
                      <BossDateRangePicker
                        startDateId="startDateId"
                        endDateId="endDateId"
                        startDate={this.state.startDate['dueAt'] || null}
                        endDate={this.state.endDate['dueAt'] || null}
                        onApply={({ startDate, endDate }) => this.onDatesChange('dueAt', { startDate, endDate })}
                      />
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_half">
                    <p className="boss-form__label"><span className="boss-form__label-text">Completed At</span></p>
                    <div className="date-control date-control_type_icon date-control_type_interval-fluid date-control_adjust_third">
                      <BossDateRangePicker
                        startDateId="startDateId"
                        endDateId="endDateId"
                        startDate={this.state.startDate['completedAt'] || null}
                        endDate={this.state.endDate['completedAt'] || null}
                        onApply={({ startDate, endDate }) => this.onDatesChange('completedAt', { startDate, endDate })}
                      />
                    </div>
                  </div>
                </div>

                <div className="boss-form__row">
                  <div className="boss-form__field boss-form__field_layout_half">
                    <label className="boss-form__label"><span className="boss-form__label-text">Venue</span></label>
                    <div className="boss-form__select">
                      <Select
                        name="venue"
                        multi
                        onChange={ this.handleVenueChange.bind(this) }
                        options={ this.venueOptions() }
                        placeholder="Select Venue"
                        simpleValue
                        value={ this.props.filter.venues }
                        optionClassName=''
                      />
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_half">
                    <label className="boss-form__label"><span className="boss-form__label-text">Status</span></label>
                    <div className="boss-form__select">
                      <Select
                        name="status"
                        multi
                        onChange={ this.handleStatusChange.bind(this) }
                        options={ this.statusOptions() }
                        placeholder="Select Status"
                        simpleValue
                        value={ this.props.filter.statuses }
                        optionClassName=''
                      />
                    </div>
                  </div>
                </div>

                <div className="boss-form__field">
                  <p className="boss-form__label">
                    <span className="boss-form__label-text">Assigned to</span>
                  </p>

                  <label className="boss-form__checkbox-label boss-form__checkbox-label_context_field">
                    <input
                      value={ this.props.filter.assignedToSelf }
                      onChange={ this.handleAssignedToSelfChange.bind(this) }
                      type="checkbox"
                      className="boss-form__checkbox-input"
                      checked={ this.props.filter.assignedToSelf }
                    />

                    <span className="boss-form__checkbox-label-text">Assigned to self</span>
                  </label>

                  <div className="boss-form__select boss-form__select_role_staff-member">
                    <Select
                      name="assignToUser"
                      onChange={ this.handleAssignedToUserChange.bind(this) }
                      options={ this.marketingUsers() }
                      placeholder="Select Assigned User"
                      value={ this.props.filter.assignedToUser }
                      disabled={ this.props.filter.assignedToSelf }
                      searchable={ false }
                      clearable={ true }
                      optionRenderer={ this.renderOption.bind(this) }
                      valueRenderer={ this.renderOption.bind(this) }
                    />
                  </div>
                </div>

                <div className="boss-form__field boss-form__field_justify_end boss-form__field_position_last">
                  { this.renderFilterUpdate() }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
