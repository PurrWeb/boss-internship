import React from "react"
import _ from "underscore"
import Select from "react-select"
import StaffMemberHolidaysLink from "~/components/staff-member-holidays-link"
import {ColoredMultipleValue, ColoredSingleOption} from '~/components/boss-form/colored-select'
import HolidayRow from './holiday-row';
import HolidaysWeekFilter from './holidays-week-filter';
import URLSearchParams from 'url-search-params';

export default class ReportsBody extends React.Component {

  renderPeople() {
    return this.state.staffMemberCollection.map((staffMember, key) => {
      return (
        <HolidayRow
          key={key}
          staffMember={staffMember}
          staffTypes={this.props.staffTypes}
          holidays={this.props.holidays}
          venues={this.props.venues}
          hasCurrentVenue={!!this.props.pageOptions.currentVenueId}
        />
      );
    });
  }

  constructor(props) {
    super(props);
    const selectedVenue = this.venueOptions().find(venue => venue.value === props.pageOptions.currentVenueId) || this.venueOptions()[0];
    this.state = {
      filterByText: '',
      filterByStaffType: [],
      staffMemberCollection: Object.values(this.props.staffMembers),
      selectedVenue: selectedVenue,
    };
  }

  staffTypeOptions() {
    return _.map(Object.values(this.props.staffTypes), (staffType) => {
      return {
        value: staffType.clientId,
        label: staffType.name,
        color: staffType.color
      }
    });
  }

  venueOptions = () => {
    const options = _.map(this.props.accessibleVenues, (venue) => {
      return {
        value: venue.serverId,
        label: venue.name,
      }
    });

    return [{value: 'all', label: 'All'}, ...options];
  }

  setTextFilter(event) {
    this.setState({ filterByText: event.target.value.toLowerCase() })

    this.filterByText(event.target.value.toLowerCase());
  }

  filterByText(value, collection) {
    let filteredStaffMembers;
    let staffMembers = (collection) ? collection : this.state.staffMemberCollection;

    if (value.length) {
      filteredStaffMembers = _.filter(staffMembers, (staffMember) => {
        return (
          (staffMember.first_name + ' ' + staffMember.surname).toLowerCase().indexOf(value) > -1
        );
      });
    } else if (collection) {
      filteredStaffMembers = collection;
    } else {
      filteredStaffMembers = this.filterByStaffType(this.state.filterByStaffType)
    }

    this.setState({
      staffMemberCollection: filteredStaffMembers
    });
  }

  setStaffTypeFilter = (options) => {
    this.setState({ filterByStaffType: options });

    this.filterByStaffType(options);
  }

  setVenueFilter = (venue) => {
    this.setState({selectedVenue: venue}, () => {
      const queryString = new URLSearchParams(window.location.search);
      venue.value === 'all' ? queryString.delete('venue_id') : queryString.set('venue_id', venue.value);
      const link = `${window.location.href.split('?')[0]}?${queryString.toString()}`
      window.location.href = link;
    });
  }

  filterByStaffType(options) {
    let filteredStaffMembers;
    let staffMembers = Object.values(this.props.staffMembers);
    let staffTypeNames = options.map((option) => {
      return option.label
    })

    if (staffTypeNames.length) {
      filteredStaffMembers = _.filter(staffMembers, (staffMember) => {
        let staffType = this.props.staffTypes['CLIENT_ID_' + staffMember.staff_type.serverId];

        return (
          staffTypeNames.indexOf(staffType.name) > -1
        );
      });
    } else {
      filteredStaffMembers = Object.values(this.props.staffMembers)
    }

    this.setState({
      staffMemberCollection: filteredStaffMembers
    });

    this.filterByText(this.state.filterByText, filteredStaffMembers);

    return filteredStaffMembers;
  }

  renderFilter() {
    return (
      <div className="boss-page-main__filter">
        <form className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space">
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="boss-form__search">
                <label className="boss-form__label">
                  <input id="text-search" name="search" type="text" className="boss-form__input" placeholder="Search..." onKeyUp={ this.setTextFilter.bind(this) } />
                </label>
              </div>
            </div>

            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Venue</span>
              </p>

              <div className="boss-form__select">
                <Select
                  value={ this.state.selectedVenue }
                  options={ this.venueOptions() }
                  onChange={ this.setVenueFilter }
                  clearable={false}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Staff Type</span>
              </p>

              <div className="boss-form__select">
                <Select
                  value={ this.state.filterByStaffType }
                  options={ this.staffTypeOptions() }
                  valueComponent={ColoredMultipleValue}
                  optionComponent={ColoredSingleOption}
                  multi={ true }
                  onChange={ this.setStaffTypeFilter }
                />
              </div>
            </div>
          </div>
          <HolidaysWeekFilter
            staffMembers={this.props.staffMembers}
            holidaysCount={this.props.holidaysCount}
            holidays={this.props.holidays}
            weekStartDate={this.props.pageOptions.weekStartDate}
            staffMembersCount={this.props.staffMembersCount}
          />
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          { this.renderFilter() }

          <div className="boss-table boss-table_page_holidays-report">
            { this.renderPeople() }
          </div>
        </div>
      </div>
    );
  }
}
