import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"
import { selectShiftsByStaffMemberClientId } from "~redux/selectors"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"
import * as actions from "~redux/actions"

class ClockInOutStaffListItem extends Component {
    render(){
        var staffObject = this.props.staff;
        var staffStatusValue = this.props.staffStatuses[staffObject.clientId].status;
        var staffStatus = oFetch(staffStatusOptionsByValue, staffStatusValue);

        var nonManagerColumns = null;
        var managerColumns = null;

        if (!this.isManager()) {
                nonManagerColumns = <div>
                <div className="col-md-3">
                    Rotaed Shifts
                    <StaffShiftList
                        shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                        rotas={this.props.rotas}
                        venues={this.props.venues} />
                </div>
                <div className="col-md-1">
                    <ToggleStaffClockedInButton
                        staffStatuses={this.props.staffStatuses}
                        staffObject={staffObject}
                        updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation} />
                </div>
                <div className="col-md-1 show-in-manager-mode">
                    <ToggleStaffOnBreakButton
                        staffStatuses={this.props.staffStatuses}
                        staffObject={staffObject}
                        updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation} />
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
    isManager(){
        return this.props.staff.isManager({staffTypes: this.props.staffTypes});
    }
    enterManagerMode(){
        this.props.enterManagerMode();
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

function mapDispatchToProps(dispatch){
    return {
        updateStaffStatusWithConfirmation: function(options){
            dispatch(actions.updateStaffStatusWithConfirmation(options))
        },
        enterManagerMode: function(){
            dispatch(actions.enterManagerMode());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutStaffListItem);