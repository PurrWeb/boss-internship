import React, { Component } from "react"
import AddStaffToShiftButton from "./add-staff-to-shift-button"
import StaffShiftList from "../../staff-shift-list.js"

export default class StaffListItem extends Component {
    render() {
        var staff = this.props.staff;

        var staffTypeStyle = {
            backgroundColor: staff.staff_type_object.color
        };

        return (
            <div className="staff-list-item rota-staff-list-item">
                <div className="row">
                    <div className="col-md-2 staff-list-item__avatar-column">
                        <img src={staff.avatar_url} className="staff-list-item__avatar" />
                    </div>
                    <div className="col-md-8">
                        <div className="rota-staff-list-item__header">
                            <h3 className="rota-staff-list-item__name">
                                {staff.first_name} {staff.surname}
                            </h3>
                            <div className="rota-staff-list-item__type" style={staffTypeStyle}>
                                {staff.readable_staff_type}
                            </div>
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
                        <div className="rota-staff-list-item__add-button">
                            <AddStaffToShiftButton
                                staffId={staff.id}
                                addShift={this.props.addShift}
                                />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
