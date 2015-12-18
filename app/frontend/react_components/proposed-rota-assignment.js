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
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-6">
                                Start
                            </div>
                            <div className="col-md-6">
                                End
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <input ref={(el) => this.ui.startTime = el} type="time"></input>
                            </div>
                            <div className="col-md-6">
                                <input ref={(el) => this.ui.endTime = el} type="time"></input>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        Staff<br/>
                        {noStaffMessage}
                        {userElements}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <a
                            style={{ marginTop: "10px", display: "inline-block" }}
                            onClick={() => this.createRotas()} className="btn btn-primary">
                            Confirm
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    getRotaStaff() {
        return this.props.proposedRotaStaff.map(
            (staffId) => this.props.staff[staffId]
        );
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
