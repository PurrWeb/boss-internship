import React, { Component } from "react"
import { boundActionCreators } from "../redux/store.js"

export default class ProposedRotaAssignment extends Component {
    render() {
        this.ui = {};

        var rotaStaff = this.getRotaStaff();
        var userElements = rotaStaff.map(function(staff, i){
            return <div>{staff.first_name} {staff.surname} - {staff.readable_staff_type}</div>
        });

        var noStaffMessage = null
        if (rotaStaff.length === 0) {
            noStaffMessage = <div>
                Select staff from the list below.
            </div>;
        }

        return (
            <div>aaa</div>
        );
    }
    getRotaStaff() {
        return []
    }
    createRotas() {
        var rotaDate = this.props.rotaDate;

        var starts_at = rotaDate.getDateFromShiftStartTimeString(this.ui.startTime.value);
        var ends_at = rotaDate.getDateFromShiftStartTimeString(this.ui.endTime.value);

        this.props.proposedRotaStaff.forEach(function(staff_id, i){
            var rota = {
                starts_at: starts_at,
                ends_at: ends_at,
                staff_id: staff_id
            };
            boundActionCreators.addRotaShift(rota);
        });

        boundActionCreators.resetProposedRotaStaff();
    }
}
