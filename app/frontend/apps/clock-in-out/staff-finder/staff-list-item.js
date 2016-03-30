import React, {Component} from "react"
import { connect } from "react-redux"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import StaffStatusBadge from "~components/staff-status-badge"
import ToggleStaffClockedInButton from "../toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../toggle-staff-on-break-button"
import { 
    selectShiftsByStaffMemberClientId,
    selectIsUpdatingStaffMemberStatus,
    selectEnterManagerModeIsInProgress,
    selectIsUpdatingStaffMemberPin
} from "~redux/selectors"
import staffStatusOptionsByValue from "~lib/staff-status-options-by-value"
import * as actions from "~redux/actions"
import Spinner from "~components/spinner"

var columnNameStyle = {
    textDecoration: "underline"
}

class ClockInOutStaffListItem extends Component {
    render(){
        var staffObject = this.props.staff;
        var staffStatusValue = this.props.staffStatuses[staffObject.clientId].status;
        var staffStatus = oFetch(staffStatusOptionsByValue, staffStatusValue);
        var staffTypeObject = staffObject.staff_type.get(this.props.staffTypes);

        var rotaedShiftsColumn = null;
        var statusToggleButtons = null;

        if (!this.isManager()) {
            rotaedShiftsColumn = <div className="col-md-3">
                    <span style={columnNameStyle}>
                        Rotaed Shifts
                    </span>
                    <StaffShiftList
                        shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                        rotas={this.props.rotas}
                        venues={this.props.venues} />
                </div>;
            statusToggleButtons = <div className="col-md-2" style={{paddingTop: 5}}>
                {this.getStaffMemberStatusToggleButtons()}
            </div>
        } else {
            rotaedShiftsColumn = <div className="col-md-3">
                {this.getManagerModeButton()}
            </div>
        }

        return <div className="staff-list-item staff-list-item--clock-in-out">
            <div className="row">
                <div className="col-md-1">
                    <img src={staffObject.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-3">
                    <div style={{fontSize: 20, fontWeight: "bold"}}>
                        {staffObject.first_name} {staffObject.surname}
                    </div>
                    <StaffTypeBadge
                        staffTypeObject={staffTypeObject} />
                    <div style={{marginTop: 4}}>
                        {this.getChangePinButton()}
                    </div>
                </div>
                {rotaedShiftsColumn}
                <div className="col-md-2">
                    <StaffStatusBadge staffStatusObject={staffStatus} />
                </div>
                {statusToggleButtons}
            </div>
        </div>
    }
    getStaffMemberStatusToggleButtons(){
        if (this.props.updateStatusIsInProgress) {
            return <Spinner />
        }

        var staffObject = this.props.staff;
        return <div className="row">
            <div className="col-md-6">
                <ToggleStaffClockedInButton
                    staffStatuses={this.props.staffStatuses}
                    staffObject={staffObject}
                    updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation} />
            </div>
            <div className="col-md-6 show-in-manager-mode">
                <ToggleStaffOnBreakButton
                    staffStatuses={this.props.staffStatuses}
                    staffObject={staffObject}
                    updateStaffStatusWithConfirmation={this.props.updateStaffStatusWithConfirmation} />
            </div>
        </div>
    }
    getChangePinButton(){
        var staffObject = this.props.staff;
        if (this.props.updateStaffMemberPinInProgress) {
            return <Spinner />
        }

        return <a className="btn btn-default btn-sm show-in-manager-mode--inline-block"
                onClick={() => this.props.updateStaffMemberPin({
                    staffMemberObject: staffObject
                })}>
                Change Pin
            </a>
    }
    isManager(){
        return this.props.staff.isManager({staffTypes: this.props.staffTypes});
    }
    enterManagerMode(){
        this.props.enterManagerMode();
    }
    getManagerModeButton(){
        if (this.props.enterManagerModeIsInProgress){
            return <Spinner />;
        }
        return <a
            onClick={() => this.enterManagerMode()}
            className="btn btn-default btn-sm hide-in-manager-mode--inline-block">
            Enter Manager Mode
        </a>
    }
}

function mapStateToProps(state, ownProps){
    return {
        staffTypes: state.staffTypes,
        staffStatuses: state.staffStatuses,
        staffMemberShifts: selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId),
        rotas: state.rotas,
        venues: state.venues,
        updateStatusIsInProgress: selectIsUpdatingStaffMemberStatus(state, {
            staffMemberServerId: ownProps.staff.serverId
        }),
        enterManagerModeIsInProgress: selectEnterManagerModeIsInProgress(state),
        updateStaffMemberPinInProgress: selectIsUpdatingStaffMemberPin(state, {
            staffMemberServerId: ownProps.staff.serverId
        })
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateStaffStatusWithConfirmation: function(options){
            dispatch(actions.updateStaffStatusWithConfirmation(options))
        },
        enterManagerMode: function(){
            dispatch(actions.enterManagerModeWithConfirmation());
        },
        updateStaffMemberPin: function(options){
            dispatch(actions.updateStaffMemberPinWithEntryModal(options))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutStaffListItem);