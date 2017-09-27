import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Select from 'react-select';
import { DateRangePicker } from 'react-dates';

export default class MainDashboard extends React.Component {
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
      venues: this.props.filter.venues,
      priorities: this.props.filter.priorities,
      statuses: this.props.filter.statuses,
      startDate: this.props.filter.startDate,
      endDate: this.props.filter.startDate,
      focusedInput: null,
      incompletedOnlyChecked: true,
      showAllChecked: false
    }
  }

  venueOptions() {
    return this.props.venues.map((venue) => {
      return { label: venue.name, value: venue.id + '' }
    });
  }

  statusOptions() {
    return this.props.statuses.map((status) => {
      return { label: status, value: status, className: 'Select-value_status_' + status, optionClassName: '' }
    });
  }

  priorityOptions() {
    return this.props.priorities.map((priority) => {
      return { label: priority, value: priority, className: 'Select-value_priority_' + priority, optionClassName: '' }
    });
  }

  handleVenueChange(venues) {
    // this.setState({ venues });
    this.props.setFilterParams({ venues: venues });
  }

  handlePriorityChange(priorities) {
    // this.setState({ priorities });
    this.props.setFilterParams({ priorities: priorities });
  }

  handleStatusChange(statuses) {
    this.setShowAllChecked();

    // this.setState({ statuses });
    this.props.setFilterParams({ statuses: statuses });
  }

  setShowAllChecked() {
    this.setState({ showAllChecked: true });
    this.setState({ incompletedOnlyChecked: false });
  }

  setIncompleteOnly() {
    this.setState({ showAllChecked: false });
    this.setState({ incompletedOnlyChecked: true });
  }

  setFilter(e) {
    if (e.target.value == 'showAll') {
      this.setShowAllChecked();

      this.props.setFilterParams({ statuses: '' });
    } else {
      this.setIncompleteOnly();

      this.props.setFilterParams({ statuses: 'pending,completed,rejected' });
    }

    setTimeout(function() {
      this.queryMaintenanceTasks();
    }.bind(this), 500);
  }

  setAndQueryMaintenanceTasks(e) {
    e.preventDefault();

    this.props.setFilterParams({
      startDate: this.props.filter.startDate,
      endDate: this.props.filter.endDate,
      statuses: this.props.filter.statuses,
      priorities: this.props.filter.priorities,
      venues: this.props.filter.venues
    });

    this.queryMaintenanceTasks(e);
  }

  queryMaintenanceTasks(event = null) {
    if (event) {
      event.preventDefault();
    }

    let startDate, endDate;

    if (this.props.filter.startDate) {
      startDate = this.props.filter.startDate.format('DD/MM/YYYY');
    }

    if (this.props.filter.endDate) {
      endDate = this.props.filter.endDate.format('DD/MM/YYYY');
    }

    this.props.queryMaintenanceTasks({
      startDate: startDate,
      endDate: endDate,
      statuses: this.props.filter.statuses,
      priorities: this.props.filter.priorities,
      venues: this.props.filter.venues,
      page: 1
    });
  }

  renderFilterUpdate() {
    if (this.props.filter.updating) {
      return <button className="boss-button boss-form__submit boss-form__submit_adjust_single">Updating</button>
    } else {
      return <button className="boss-button boss-form__submit boss-form__submit_adjust_single" type="submit" onClick={ this.setAndQueryMaintenanceTasks.bind(this) }>Update</button>
    }
  }

  handleDateChange(dates) {
    this.props.setFilterParams({ startDate: dates.startDate, endDate: dates.endDate });
  }

  render() {
    return (
      <div className="boss-page-dashboard__filter">
        <div className="boss-dropdown boss-dropdown_page_maintenance-index">
          <div className="boss-dropdown__header">
            <a href="#" className="boss-dropdown__switch boss-dropdown__switch_role_filter">Filtering</a>

            <div className="boss-dropdown__header-group">
              <form className="boss-form">
                <div className="boss-form__row boss-form__row_justify_end boss-form__row_position_last">
                  <div className="boss-form__field boss-form__field_layout_fluid">
                    <div className="boss-form__switcher">
                      <label className="boss-form__switcher-label">
                        <input type="radio" name="display" value="incompletedOnly" className="boss-form__switcher-radio" checked={ this.state.incompletedOnlyChecked } onChange={ this.setFilter.bind(this) } />
                        <span className="boss-form__switcher-label-text">Incomplete Only</span>
                      </label>

                      <label className="boss-form__switcher-label">
                        <input type="radio" name="display" value="showAll" className="boss-form__switcher-radio" checked={ this.state.showAllChecked } onChange={ this.setFilter.bind(this) } />
                        <span className="boss-form__switcher-label-text">Show All</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="boss-dropdown__content">
            <div className="boss-dropdown__content-inner">
              <form action="#" className="boss-form">
                <div className="boss-form__row">
                  <div className="boss-form__field boss-form__field_layout_half">
                    <p className="boss-form__label"><span className="boss-form__label-text">Date</span></p>
                    <div className="date-range-picker date-range-picker_type_icon date-range-picker_type_interval-fluid date-range-picker_adjust_third">
                      <DateRangePicker
                        startDate={ this.props.filter.startDate }
                        endDate={ this.props.filter.endDate }
                        numberOfMonths={1}
                        withPortal
                        showClearDates
                        displayFormat={ 'DD-MM-YYYY' }
                        isOutsideRange={ () => false }
                        onDatesChange={ this.handleDateChange.bind(this) }
                        onFocusChange={ focusedInput => this.setState({ focusedInput }) }
                        focusedInput={ this.state.focusedInput }
                      />
                    </div>
                  </div>
                  <div className="boss-form__field boss-form__field_layout_half boss-form__field_position_last">
                    <label className="boss-form__label"><span className="boss-form__label-text">Venue</span></label>
                    <div className="boss-form__select">
                      <Select
                        name="venue"
                        multi
                        onChange={this.handleVenueChange.bind(this)}
                        options={this.venueOptions()}
                        placeholder="Select Venue"
                        simpleValue
                        value={this.props.filter.venues}
                      />
                    </div>
                  </div>
                </div>

                <div className="boss-form__row">
                  <div className="boss-form__field boss-form__field_layout_half">
                    <label className="boss-form__label"><span className="boss-form__label-text">Status</span></label>
                    <div className="boss-form__select">
                      <Select
                        name="status"
                        multi
                        onChange={this.handleStatusChange.bind(this)}
                        options={this.statusOptions()}
                        placeholder="Select Status"
                        simpleValue
                        value={this.props.filter.statuses}
                        optionClassName=''
                      />
                    </div>
                  </div>

                  <div className="boss-form__field boss-form__field_layout_half boss-form__field_position_last">
                    <label className="boss-form__label"><span className="boss-form__label-text">Priority</span></label>
                    <div className="boss-form__select">
                      <Select
                        name="priority"
                        multi
                        onChange={this.handlePriorityChange.bind(this)}
                        options={this.priorityOptions()}
                        placeholder="Select Priority"
                        simpleValue
                        value={this.props.filter.priorities}
                      />
                    </div>
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
