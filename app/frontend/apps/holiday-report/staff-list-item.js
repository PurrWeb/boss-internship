import PropTypes from 'prop-types';
import React from "react"
import _ from "underscore"
import StaffTypeBadge from "~/components/staff-type-badge"
import StaffHolidaysList from "~/components/staff-holidays-list/staff-holidays-list"
import StaffMemberHolidaysLink from "~/components/staff-member-holidays-link"

export default class StaffListItem extends React.Component {
    static propTypes = {
        staff: PropTypes.object.isRequired,
        venues: PropTypes.array.isRequired,
        staffType: PropTypes.object.isRequired,
        paidHolidays: PropTypes.array.isRequired,
        unpaidHolidays: PropTypes.array.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffType = this.props.staffType;
        return <div className="staff-list-item">
            <div className="row">
                <div className="large-2 small-12 column">
                    <img src={staff.avatar_url} className="avatar" />
                </div>
                <div className="column">
                    <div className="row">
                        <div className="shrink column">
                            <div className="row align-middle mb-base">
                                <div className="shrink column npr">
                                    <h3 className="holiday-report-staff-list-item__name">
                                        {staff.first_name} {staff.surname}
                                    </h3>
                                </div>
                                <div className="shrink column">
                                    <StaffTypeBadge staffTypeObject={staffType} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="large-shrink small-12 column">
                            <h4>Venues</h4>
                            <p>{this.props.venues.map(venue => venue.name).join(', ')}</p>
                        </div>
                        <div className="large-shrink small-12 column">
                            <h4>Paid Holiday</h4>
                            <StaffHolidaysList holidays={this.props.paidHolidays} />
                        </div>
                        <div className="large-shrink small-12 column" data-test-marker-unpaid-holidays>
                            <h4>Unpaid Holiday</h4>
                            <StaffHolidaysList holidays={this.props.unpaidHolidays} />
                        </div>
                        <div className="large-shrink small-12 column">
                            <h4>Paid Holiday days</h4>
                            {holidayDaysCount(this.props.paidHolidays)}
                        </div>
                        <div className="large-shrink small-12 column">
                                <StaffMemberHolidaysLink staffMemberServerId={staff.serverId} sStartDate={this.props.startDate} sEndDate={this.props.endDate}>
                                    <p>View holidays</p>
                                </StaffMemberHolidaysLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

function holidayDaysCount(holidays) {
  return _.reduce(holidays, (count, holiday) => count + holiday.days, 0);
}
