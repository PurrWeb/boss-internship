import React, { Component } from "react"
import AddStaffToShiftButton from "./add-staff-to-shift-button"
import StaffShiftList from "~components/staff-shift-list"
import StaffTypeBadge from "~components/staff-type-badge"
import Spinner from "~components/spinner"
import reactMixin from "react-mixin"
import apiFormMixin from "~mixins/api-form-mixin"

export default class StaffListItem extends Component {
    static contextTypes = {
        addShift: React.PropTypes.func.isRequired
    }
    render() {
        var staff = this.props.staff;
        var shiftSavingInProgressSpinner = null;
        if (staff.addShiftIsInProgress) {
            shiftSavingInProgressSpinner = <Spinner />
        }

        var errors = JSON.stringify(this.getComponentErrors());

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
                            <StaffTypeBadge staffType={staff.staff_type.id} />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="rota-staff-list-item__h4">
                                    Shifts
                                </h4>
                                <StaffShiftList
                                    staffId={staff.id} />
                            </div>
                            <div className="col-md-6">
                                <h4 className="rota-staff-list-item__h4">
                                    Preferences
                                </h4>
                                Weekly Hours: {staff.preferred_hours}<br/>
                                Day Preferences:&nbsp;
                                {staff.preferred_days}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="rota-staff-list-item__add-button" style={{float: "left"}}>
                            <AddStaffToShiftButton
                                staffId={staff.id}
                                addShift={() => this.addShift()}
                                />
                        </div>
                        {errors}
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
        );
    }
    addShift(){
        this.context.addShift(this.props.staff.id, this.getComponentId())
    }
}
reactMixin.onClass(StaffListItem, apiFormMixin);
