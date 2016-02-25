import React, { Component } from "react"
import ShiftEditor from "./shift-editor"
import StaffTypeBadge from "~components/staff-type-badge"
import _ from "underscore"

export default class StaffDetailsAndShifts extends Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        staffId: React.PropTypes.number.isRequired,
        staff: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.object.isRequired
    }
    render(){
        var staff = this.getStaff();
        var shifts = this.getShifts();
        var shiftEls = shifts.map(
            (shift) => <ShiftEditor
                shift={shift}
                rotaShifts={this.props.rotaShifts}
                key={shift.id}
                staff={this.props.staff} />
        );
        var staffTypeId = staff.staff_type.id;
        var staffType = this.props.staffTypes[staffTypeId];
        return <div>
            <h2 className="staff-details-and-shifts__h2">
                {staff.first_name} {staff.surname}
            </h2>
            <div className="staff-details-and-shifts__staff-type">
                <StaffTypeBadge
                    staffTypeObject={staffType} />
            </div>
            <br/>

            {shiftEls}

            <br/>
            <u>Preferences</u>
            <br/>
            Weekly Hours: {staff.preferred_hours}<br/>
            Day Preferences: {staff.preferred_days}

        </div>
    }
    getStaff(){
        return this.props.staff[this.props.staffId];
    }
    getShifts(){
        return _(this.props.rotaShifts).filter(
            shift => shift.staff_member.id === this.props.staffId
        );
    }
}
