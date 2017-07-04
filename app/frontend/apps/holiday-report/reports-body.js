import React from "react"
import _ from "underscore"
import moment from "moment"
import Select from "react-select"
import StaffMemberHolidaysLink from "~components/staff-member-holidays-link"

export default class ReportsBody extends React.Component {
  renderHolidayCell(holiday) {
    if (holiday) {
      let startDate = moment(holiday.start_date).format('DD MMM');
      let endDate = moment(holiday.end_date).format('DD MMM');

      if (startDate == endDate) {
        return startDate;
      } else {
        return startDate + ' - ' + endDate;
      }
    } else {
      return 'None this week';
    }
  }

  renderPeople() {
    return this.state.staffMemberCollection.map((staffMember) => {
      let s = this.props;
      let staffType = this.props.staffTypes['CLIENT_ID_' + staffMember.staff_type.serverId];
      let client = this.props.holidays['CLIENT_ID_' + staffMember.serverId];
      let holidays = _.filter(Object.values(this.props.holidays), (holiday) => {
        return holiday.staff_member.serverId === staffMember.serverId
      });
      let paidHoliday = _.find(holidays, (holiday) => {
        return holiday.holiday_type === "paid_holiday"
      });
      let unpaidHoliday = _.find(holidays, (holiday) => {
        return holiday.holiday_type === "unpaid_holiday"
      });
      let staffMemberVenueIds = staffMember.venues.map((venue) => {
        return venue.serverId
      })
      let venueNames = staffMemberVenueIds.map((venueId) => {
        return this.props.venues['CLIENT_ID_' + venueId].name
      });

      return (
        <div className="boss-table__row" key={ staffMember.serverId }>
          <div className="boss-table__cell">
            <div className="boss-user-summary boss-user-summary_role_report">
              <div className="boss-user-summary__side">
                <div className="boss-user-summary__avatar">
                  <div className="boss-user-summary__avatar-inner">
                    <img src={ staffMember.avatar_url } alt="user avatar" className="boss-user-summary__pic" />
                  </div>
                </div>
              </div>
              <div className="boss-user-summary__content">
                <div className="boss-user-summary__header">
                  <h2 className="boss-user-summary__name">{ staffMember.first_name + ' ' + staffMember.surname }</h2>
                  <p className="boss-button boss-button_type_label boss-button_role_bar-supervisor boss-user-summary__label" style={{ background: staffType.color }}>
                    { staffType.name }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Venues</p>
              <p className="boss-table__text">{ venueNames.join(', ') }</p>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Paid Holiday</p>
              <p className="boss-table__text boss-table__text_type_faded boss-table__text_role_date">
                { this.renderHolidayCell(paidHoliday) }
              </p>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Unpaid Holiday</p>
              <p className="boss-table__text">{ this.renderHolidayCell(unpaidHoliday) }</p>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Paid Holidays Days</p>
              <p className="boss-table__text">{ (paidHoliday) ? paidHoliday.days : 0 }</p>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <div className="boss-table__actions">
                <StaffMemberHolidaysLink
                  className="boss-button boss-button_type_small boss-button_role_details"
                  staffMemberServerId={staffMember.serverId}
                  startDate={this.props.pageOptions.weekStartDate}
                  endDate={this.props.pageOptions.weekEndDate}
                >
                  View All
                </StaffMemberHolidaysLink>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      filterByText: '',
      filterByStaffType: [],
      staffMemberCollection: Object.values(this.props.staffMembers)
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

  renderOption(options, index, c) {
    return (
      <div className="Select-value" style={{ background: options.value.color }}>
        <span className="Select-value-icon" aria-hidden="true">×</span>

        <span className="Select-value-label" role="option" aria-selected="true" id={ options.id }>
          { options.value.label }
          <span className="Select-aria-only">&nbsp;</span>
        </span>
      </div>
    );
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

    if (!filteredStaffMembers) { debugger }

    this.setState({
      staffMemberCollection: filteredStaffMembers
    });
  }

  setStaffTypeFilter(options) {
    this.setState({ filterByStaffType: options });

    this.filterByStaffType(options);
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

    if (!filteredStaffMembers) { debugger }

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
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="boss-form__search">
                <label className="boss-form__label">
                  <input id="text-search" name="search" type="text" className="boss-form__input" placeholder="Search..." onKeyUp={ this.setTextFilter.bind(this) } />
                </label>
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
                  multi={ true }
                  onChange={ this.setStaffTypeFilter.bind(this) }
                />
              </div>
            </div>
          </div>
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
