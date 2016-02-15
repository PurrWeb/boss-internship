import React from "react"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffHolidaysList from "~components/staff-holidays-list/staff-holidays-list"

export default class StaffListItem extends React.Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        staffType: React.PropTypes.object.isRequired,
        paidHolidays: React.PropTypes.array.isRequired,
        unpaidHolidays: React.PropTypes.array.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffType = this.props.staffType;
        return <div className="staff-list-item">
            <div className="row">
                <div className="col-md-1">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-3">
                    <h3>
                        {staff.first_name} {staff.surname}
                    </h3>
                    <StaffTypeBadge staffTypeObject={staffType} />
                </div>
                <div className="col-md-3">
                    <h4>Paid Holiday</h4>
                    <StaffHolidaysList holidays={this.props.paidHolidays} />
                </div>
                <div className="col-md-3">
                    <h4>Unpaid Holiday</h4>
                    <StaffHolidaysList holidays={this.props.unpaidHolidays} />
                </div>
                <div className="col-md-2">
                    <h4>Paid Holiday days: {this.props.paidHolidays.length}</h4>
                </div>
            </div>
        </div>
    }
}