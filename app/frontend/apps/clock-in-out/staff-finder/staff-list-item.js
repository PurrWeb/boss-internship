import React, {Component} from "react"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"

export default class ClockInOutStaffListItem extends Component {
    static contextTypes = {
        staffStatuses: React.PropTypes.object.isRequired,
        boundActionCreators: React.PropTypes.object.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffStatus = this.context.staffStatuses[staff.id];
        var nonManagerColumns = null;
        var managerColumns = null;

        if (!staff.isManager) {
                nonManagerColumns = <div>
                <div className="col-md-3">
                    Rotaed Shifts
                     <StaffShiftList
                        staffId={staff.id} />
                </div>
                <div className="col-md-1">
                    <ToggleStaffClockedInButton
                        staffId={staff.id} />
                </div>
                <div className="col-md-1 show-in-manager-mode">
                    <ToggleStaffOnBreakButton
                        staffId={staff.id} />
                </div>
            </div>;
        } else {
            managerColumns = <a
                onClick={() => this.enterManagerMode()}
                className="btn btn-default hide-in-manager-mode--inline-block">
                Enter Manager Mode
            </a>
        }

        return <div className="staff-list-item">
            <div className="row">
                <div className="col-md-1">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-2">
                    {staff.first_name} {staff.surname}
                    <a className="btn btn-default show-in-manager-mode">
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
                {nonManagerColumns}
                {managerColumns}
            </div>
        </div>
    }
    enterManagerMode(){
        this.context.boundActionCreators.enterManagerMode();
    }
}