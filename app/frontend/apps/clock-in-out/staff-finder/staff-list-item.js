import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import _ from "underscore"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"
import { selectShiftsByStaffMemberClientId } from "~redux/selectors"

var staffStatusOptions = [{
        value: "clocked_in",
        title: "Clocked In",
        color: "green"
    }, {
        value: "on_break",
        title: "On break",
        color: "orange"
    }, {
        value: "clocked_out",
        title: "Clocked out",
        color: "gray"
    }
];

var staffStatusOptionsByValue = _.indexBy(staffStatusOptions, "value")

class ClockInOutStaffListItem extends Component {
    render(){
        var staffObject = this.props.staff;
        var staffStatusValue = this.props.staffStatuses[staffObject.clientId].status;
        var staffStatus = oFetch(staffStatusOptionsByValue, staffStatusValue);

        var nonManagerColumns = null;
        var managerColumns = null;

        if (!staffObject.isManager) {
                nonManagerColumns = <div>
                <div className="col-md-3">
                    Rotaed Shifts
                    <StaffShiftList
                        shifts={this.props.staffMemberShifts}
                        rotas={this.props.rotas}
                        venues={this.props.venues} />
                </div>
                <div className="col-md-1">
                    {/* <ToggleStaffClockedInButton
                        staffStatusData={this.props.staffStatusData}
                        staffObject={staff} /> */ }
                        ]]]]]]]
                </div>
                <div className="col-md-1 show-in-manager-mode">
                    {/* <ToggleStaffOnBreakButton
                        staffStatusData={this.props.staffStatusData}
                        staffObject={staff} /> */ }


                        ]]]]]]]
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
                    <img src={staffObject.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-2">
                    {staffObject.first_name} {staffObject.surname}
                    <a className="btn btn-default show-in-manager-mode">
                        Change Pin
                    </a>
                </div>
                <div className="col-md-2">
                    Staff Type<br/>
                    <StaffTypeBadge staffTypeObject={staffObject.staff_type.get(this.props.staffTypes)} />
                </div>
                <div className="col-md-2">
                    Status <br/>
                    <StaffStatusBadge staffStatusObject={staffStatus} />
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

function mapStateToProps(state, ownProps){
    return {
        staffTypes: state.staffTypes,
        staffStatuses: state.staffStatuses,
        staffMemberShifts: selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId),
        rotas: state.rotas,
        venues: state.venues
    }
}

export default connect(mapStateToProps)(ClockInOutStaffListItem);