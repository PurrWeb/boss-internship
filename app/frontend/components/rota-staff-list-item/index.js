import React, { Component } from "react"
import AddShiftButton from "./add-shift-button"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import Spinner from "~components/spinner"
import ComponentErrors from "~components/component-errors"
import StaffHolidaysList from "~components/staff-holidays-list"
import { connect } from "react-redux"
import { selectAddShiftIsInProgress, selectShiftsByStaffMemberClientId, canEditStaffTypeShifts, selectStaffMemberIsOnHolidayOnDate } from "~redux/selectors"
import _ from "underscore"
import utils from "~lib/utils"
import validation from "~lib/validation"
import RotaDate from "~lib/rota-date"
import * as actionCreators from "~redux/actions"
import StaffMemberHolidaysLink from "~components/staff-member-holidays-link"

class RotaStaffListItem extends Component {
    static contextTypes = {
        newShiftTimes: React.PropTypes.object.isRequired,
        newShiftVenueServerId: React.PropTypes.any.isRequired,
        newShiftVenueClientId: React.PropTypes.any.isRequired
    }
    componentWillMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        var staff = this.props.staff;
        var shiftSavingInProgressSpinner = null;
        if (this.props.addShiftIsInProgress) {
            shiftSavingInProgressSpinner = <Spinner />
        }

        var errors = this.props.componentErrors[this.componentId];

        var staffTypeObject = staff.staff_type.get(this.props.staffTypes);

        return (
            <div className="staff-list-item rota-staff-list-item">
                <div className="row">
                    <div className="col-md-1">
                        <img src={staff.avatar_url} className="staff-list-item__avatar" />
                    </div>
                    <div className="col-md-8">
                        <div className="rota-staff-list-item__header">
                            <h3 className="rota-staff-list-item__name">
                                {staff.first_name} {staff.surname}
                            </h3>
                            <StaffTypeBadge staffTypeObject={staffTypeObject} />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="rota-staff-list-item__h4">
                                    Shifts
                                </h4>
                                <StaffShiftList
                                    shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                                    venues={this.props.venues}
                                    rotas={this.props.rotas}
                                    showDate={true}
                                    showVenue={true} />
                            </div>
                            <div className="col-md-3">
                                <h4 className="rota-staff-list-item__h4" style={{
                                    display: "inline-block",
                                }}>
                                    Holidays
                                </h4>
                                <span style={{marginLeft: 5, display: "inline-block"}}>
                                    <StaffMemberHolidaysLink staffMemberServerId={staff.serverId} >
                                        Edit
                                    </StaffMemberHolidaysLink>
                                </span>
                                <StaffHolidaysList staffMemberClientId={staff.clientId} />
                            </div>
                            <div className="col-md-3">
                                <h4 className="rota-staff-list-item__h4">
                                    Preferences
                                </h4>
                                Weekly Hours: {staff.preferred_hours}<br/>
                                Day Preferences:&nbsp;
                                {staff.preferred_days}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div style={{overflow: "hidden"}}>
                            <div className="rota-staff-list-item__add-button" style={{float: "left"}}>
                                <AddShiftButton
                                    canAddShift={this.canAddShift()}
                                    addShift={() => this.addShift()}
                                    />
                            </div>
                            <div style={{
                                float: "left",
                                marginTop: 40,
                                marginLeft: 10
                            }}>
                                {shiftSavingInProgressSpinner}
                            </div>
                        </div>
                        <div style={{marginTop: 10}}>
                            <ComponentErrors errors={errors} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    addShift(){
        var {starts_at, ends_at} = this.context.newShiftTimes;
        this.props.addRotaShift({
            starts_at,
            ends_at,
            staffMemberServerId: this.props.staff.serverId,
            errorHandlingComponent: this.componentId,
            venueServerId: this.context.newShiftVenueServerId,
            venueClientId: this.context.newShiftVenueClientId
        });
    }
    canAddShift(){
        var { starts_at, ends_at } = this.context.newShiftTimes;
        var datesAreValid = validation.areShiftTimesValid(starts_at, ends_at);
        if (!datesAreValid) {
            return false;
        }

        var isAddingShift = this.props.addShiftIsInProgress;

        var dateOfRota = new RotaDate({shiftStartsAt: starts_at}).getDateOfRota();
        var isOnHoliday = selectStaffMemberIsOnHolidayOnDate(this.props._state, this.props.staff.clientId, dateOfRota);

        var canEditStaffTypeShifts = this.props.canEditStaffTypeShifts;

        return datesAreValid && !isAddingShift && !isOnHoliday && canEditStaffTypeShifts;
    }
}

function mapStateToProps(state, ownProps){
    return {
        addShiftIsInProgress: selectAddShiftIsInProgress(state, ownProps.staff.serverId),
        staffTypes: state.staffTypes,
        componentErrors: state.componentErrors,
        staffMemberShifts: selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId),
        venues: state.venues,
        canEditStaffTypeShifts: canEditStaffTypeShifts(state, {
            staffTypeClientId: ownProps.staff.staff_type.clientId
        }),
        rotas: state.rotas,
        // This isn't clean and causes unncessary re-renders. The problem is that we don't
        // have access to the rota date via ownProps, because it comes via context (implicitly
        // through starts_at)
        _state: state
    }
}

function mapDispatchToProps(dispatch){
    return {
        addRotaShift: function(options){
            dispatch(actionCreators.addRotaShift(options));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(RotaStaffListItem);
