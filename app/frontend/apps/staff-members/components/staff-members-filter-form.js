import React from "react"
import Select from 'react-select';

export default class StaffMembersFilterForm extends React.Component {
  componentDidMount() {
    var filter = $('.boss-dropdown');

    filter.each(function(){
      var filterSwitch = $(this).find('.boss-dropdown__switch');
      var filterContent = $(this).find('.boss-dropdown__content');
      var pageContent = $('.boss-page-main__content');

      function toggleFilter(e) {
        e.preventDefault();
        filterSwitch.toggleClass('boss-dropdown__switch_state_opened');
        filterContent.slideToggle().end().toggleClass('boss-dropdown__content_state_opened');
      }

      filterSwitch.on('click', toggleFilter);
    });
  }

  constructor(props){
    super(props)

    this.state = {
      name: this.props.selected_name,
      email: this.props.selected_email,
      status: { value: this.props.selected_status, label: this.props.selected_status },
      venue: this.buildHashFor(this.props.selected_venue),
      staff_type: this.buildHashFor(this.props.selected_staff_type)
    }
  }

  buildHashFor(resource) {
    if (resource) {
      return { value: resource.id, label: resource.name }
    } else {
      return { value: 'Any', label: 'Any' }
    }
  }

  changeStatusHandler(status) {
    this.setState({
      status: status
    });
  }

  changeVenueHandler(venue) {
    this.setState({
      venue: venue
    });
  }

  changeStaffTypeHandler(staff_type) {
    this.setState({
      staff_type: staff_type
    });
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  render() {
    return (
      <div className="boss-page-dashboard__filter">
        <div className="boss-dropdown">
          <div className="boss-dropdown__header">
            <a href="#" className="boss-dropdown__switch boss-dropdown__switch_role_filter">Filter</a>
          </div>

          <div className="boss-dropdown__content">
            <div className="boss-dropdown__content-inner">
              <form action="#" className="boss-form">
                <div className="boss-form__row boss-form__row_position_last">
                  <div className="boss-form__group boss-form__group_layout_half">
                    <div className="boss-form__field">
                      <label className="boss-form__label">
                        <span className="boss-form__label-text">Name</span>
                        <input
                          name="name_text"
                          value={this.state.name}
                          onChange={this.handleNameChange.bind(this)}
                          className="boss-form__input"
                          type="text"
                        />
                      </label>
                    </div>

                    <div className="boss-form__field">
                      <label className="boss-form__label">
                        <span className="boss-form__label-text">Email</span>
                        <input
                          name="email_text"
                          value={this.state.email}
                          onChange={this.handleEmailChange.bind(this)}
                          className="boss-form__input"
                          type="text"
                        />
                      </label>
                    </div>

                    <div className="boss-form__field">
                      <label className="boss-form__label"><span className="boss-form__label-text">Status</span></label>

                      <div className="boss-form__select">

                        <Select
                          classNames="status-select"
                          name="status"
                          value={this.state.status}
                          options={this.statusOptions()}
                          onChange={this.changeStatusHandler.bind(this)}
                          clearable={false}
                          searchable={false}
                        />

                      </div>
                    </div>
                  </div>

                  { this.renderManagerFilter() }
                </div>

                <div className="boss-form__field boss-form__field_justify_end boss-form__field_no-label">
                  <button type="submit" className="boss-button boss-form__submit boss-form__submit_adjust_single">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderManagerFilter() {
    if (this.props.isSecurityManager) return '';

    return(
      <div className="boss-form__group boss-form__group_layout_half">
        <div className="boss-form__field">
          <label className="boss-form__label">
            <span className="boss-form__label-text">Venue</span>
          </label>

          <div className="boss-form__select">
            <Select
              classNames="venue-select"
              name="venue"
              value={this.state.venue}
              options={this.renderVenues()}
              onChange={this.changeVenueHandler.bind(this)}
              clearable={false}
              searchable={false}
            />
          </div>
        </div>

        <div className="boss-form__field">
          <label className="boss-form__label">
            <span className="boss-form__label-text">Staff Type</span>
          </label>

          <div className="boss-form__select">
            <Select
              classNames="staff_type-select"
              name="staff_type"
              value={this.state.staff_type}
              options={this.renderStaffTypes()}
              onChange={this.changeStaffTypeHandler.bind(this)}
              clearable={false}
              searchable={false}
            />
          </div>
        </div>
      </div>
    )
  }

  defaultValue() {
    return [{ value: 'Any', label: 'Any' }];
  }

  renderStaffTypes() {
    return this.defaultValue().concat(this.props.staff_types.map(function(staffType, index) {
      return { value: staffType.id, label: staffType.name }
    }));
  }

  renderVenues() {
    return this.defaultValue().concat(this.props.venues.map(function(venue, index) {
      return { value: venue.id, label: venue.name }
    }));
  }

  statusOptions() {
    return this.defaultValue().concat(this.props.statuses.map(function(status, index) {
      return { value: status, label: status }
    }));
  }
}
