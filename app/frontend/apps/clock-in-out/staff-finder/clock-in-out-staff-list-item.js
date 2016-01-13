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
                <div className="col-md-1">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-2">
                    {staff.first_name} {staff.surname}
                    <a class="btn btn-default show-in-manager-mode">
                        Change Pin
                    </a>
                </div>
                <div className="col-md-2">
                    Staff Type<br/>
                    <StaffTypeBadge staffType={staff.staff_type} />
                </div>
                <div className="col-md-2">
                    Status <br/>
                    <StaffStatusBadge status={staffStatus} />
                </div>
                <div className="col-md-3">
                    Rotaed Shifts
                     <StaffShiftList
                        staffId={staff.id} />
                </div>
                <div className="col-md-1">
                    TODO clock in out toggle
                </div>
                <div className="col-md-1 show-in-manager-mode">
                    TODO break toggle
                </div>
            </div>
        </div>
    }
}