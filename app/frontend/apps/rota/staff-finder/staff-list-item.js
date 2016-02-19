import React, { Component } from "react"
import AddStaffToShiftButton from "./add-staff-to-shift-button"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import Spinner from "~components/spinner"
import ComponentErrors from "~components/component-errors"
import StaffHolidaysList from "~components/staff-holidays-list"
import { appRoutes } from "~lib/routes"
import { connect } from "react-redux"
import { selectAddShiftIsInProgress } from "~redux/selectors"
import _ from "underscore"

class StaffListItem extends Component {
    static contextTypes = {
        addShift: React.PropTypes.func.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        componentErrors: React.PropTypes.object.isRequired
    }
    componentWillMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        console.log("render staff list item")
        var staff = this.props.staff;
        var shiftSavingInProgressSpinner = null;
        if (this.props.addShiftIsInProgress) {
            shiftSavingInProgressSpinner = <Spinner />
        }

        var errors = this.context.componentErrors[this.componentId];

        var staffTypeObject = this.context.staffTypes[staff.staff_type.id];

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
                                    staffId={staff.id} />
                            </div>
                            <div className="col-md-3">
                                <h4 className="rota-staff-list-item__h4" style={{
                                    display: "inline-block",
                                }}>
                                    Holidays
                                </h4>
                                <a
                                    href={appRoutes.staffMemberHolidays(staff.id)}
                                    style={{marginLeft: 5, display: "inline-block"}}>
                                    Edit
                                </a>
                                <StaffHolidaysList staffId={staff.id} />
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
                                <AddStaffToShiftButton
                                    staffId={staff.id}
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
        this.context.addShift(this.props.staff.id, this.componentId)
    }
}

function mapStateToProps(state, ownProps){
    return {
        addShiftIsInProgress: selectAddShiftIsInProgress(state, ownProps.staff.id)
    }
}

export default connect(
    mapStateToProps,
    null,
    null,
    {pure: false}
)(StaffListItem);
