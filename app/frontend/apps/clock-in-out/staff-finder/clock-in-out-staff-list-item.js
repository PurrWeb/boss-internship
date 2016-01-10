import React, {Component} from "react"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"

export default class ClockInOutStaffListItem extends Component {
    static contextTypes = {
        staffStatuses: React.PropTypes.object.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffStatus = this.context.staffStatuses[staff.id];
        return <div className="staff-list-item">
            <div className="row">
                <div className="col-md-2 staff-list-item__avatar-column">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-2">
                    {staff.first_name} {staff.surname}
                </div>
                <div className="col-md-2">
                    <StaffTypeBadge staffType={staff.staff_type} />
                </div>
                <div className="col-md-2">
                    Status <br/>
                    <StaffStatusBadge status={staffStatus} />
                </div>
                <div className="col-md-2">
                    Rotaed Shifts
                     <StaffShiftList
                        staffId={staff.id} />
                </div>
                <div className="col-md-2">
                    TODO clock in
                </div>
                <div className="col-md-2">
                    TODO break toggle
                </div>
            </div>
        </div>
    }
}