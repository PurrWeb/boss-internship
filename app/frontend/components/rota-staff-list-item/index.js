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
import { appRoutes } from "~lib/routes"
import validation from "~lib/validation"
import RotaDate from "~lib/rota-date"
import actionCreators from "~redux/actions"
import StaffMemberHolidaysLink from "~components/staff-member-holidays-link"
import ShiftList from "~models/shift-list"

class RotaStaffListItem extends Component {
    static contextTypes = {
        newShiftSettings: React.PropTypes.shape({
            venueServerId: React.PropTypes.any.isRequired,
            venueClientId: React.PropTypes.any.isRequired,
            startsAt: React.PropTypes.instanceOf(Date).isRequired,
            endsAt: React.PropTypes.instanceOf(Date).isRequired,
            shiftType: React.PropTypes.string.isRequired
        }).isRequired
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

        var staffTypeObject = staff.staff_type.get(this.props.staffTypes);

        return (
            <div className="row staff-list-item rota-staff-list-item">
                <div className="small-12  large-3 columns">
                    <img src={staff.avatar_url} className="boss2-avatar boss2-avatar_type_big" />
                </div>
                <div className="columns large-9">
                    <div className="row">
                        <div className="shrink columns npr">
                            <div className="rota-staff-list-item__header">
                                <h3 className="rota-staff-list-item__name nm">
                                  <a
                                    href={appRoutes.staffMember(staff.serverId)}
                                    className="link-unstyled"
                                  >
                                    {staff.first_name} {staff.surname}
                                  </a>
                                </h3>
                            </div>
                        </div>
                        <div className="small-1 large-1 large-end column">
                            <StaffTypeBadge staffTypeObject={staffTypeObject} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-12 large-shrink column">
                            <h4 className="rota-staff-list-item__h4" style={{textDecoration: "none"}}>
                                <u>Shifts</u>
                                <span>
                                    &nbsp;({this.props.totalWeeklyHours}h)
                                </span>
                            </h4>
                            <StaffShiftList
                                shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                                venues={this.props.venues}
                                rotas={this.props.rotas}
                                showDate={true}
                                showVenue={true} />
                        </div>
                        <div className="large-shrink small-12 column">
                            <h4 className="rota-staff-list-item__h4 mr-md" style={{
                                display: "inline-block",
                            }}>
                                Holidays
                            </h4>
                            <StaffMemberHolidaysLink className="boss2-button boss2-button_type_small boss2-button_role_edit" staffMemberServerId={staff.serverId} >
                                Edit
                            </StaffMemberHolidaysLink>
                            <StaffHolidaysList staffMemberClientId={staff.clientId} />
                        </div>
                        <div className="large-shrink small-12 column">
                            <h4 className="rota-staff-list-item__h4">
                                Preferences
                            </h4>
                            Weekly Hours: {staff.preferred_hours}<br/>
                            Day Preferences:&nbsp;
                            {staff.preferred_days}
                        </div>
                    </div>
                    <div className="row">
                        <div className="shrink column">
                            <div>
                                <div className="rota-staff-list-item__add-button">
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
                        </div>
                    </div>
                    <div className="row">
                        <div className="shrink column">
                            <div style={{marginTop: 10}}>
                                <ComponentErrors errorHandlingId={this.componentId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    addShift(){
        var newShiftSettings = this.context.newShiftSettings;
        this.props.addRotaShift({
            starts_at: newShiftSettings.startsAt,
            ends_at: newShiftSettings.endsAt,
            shift_type: newShiftSettings.shiftType,
            venueServerId: newShiftSettings.venueServerId,
            venueClientId: newShiftSettings.venueClientId,
            staffMemberServerId: this.props.staff.serverId,
            errorHandlingId: this.componentId
        });
    }
    canAddShift(){
        var starts_at = this.context.newShiftSettings.startsAt;
        var ends_at = this.context.newShiftSettings.endsAt;

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
    var staffMemberShifts = selectShiftsByStaffMemberClientId(state, ownProps.staff.clientId);
    var totalWeeklyHours = ShiftList.getTotalShiftHours(staffMemberShifts);
    totalWeeklyHours = utils.round(totalWeeklyHours, 1);
    return {
        addShiftIsInProgress: selectAddShiftIsInProgress(state, ownProps.staff.serverId),
        staffTypes: state.staffTypes,
        staffMemberShifts,
        venues: state.venues,
        canEditStaffTypeShifts: canEditStaffTypeShifts(state, {
            staffTypeClientId: ownProps.staff.staff_type.clientId
        }),
        rotas: state.rotas,
        // This isn't clean and causes unncessary re-renders. The problem is that we don't
        // have access to the rota date via ownProps, because it comes via context (implicitly
        // through starts_at)
        _state: state,
        totalWeeklyHours
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
