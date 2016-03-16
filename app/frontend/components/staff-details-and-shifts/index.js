import React, { Component } from "react"
import EditableShiftList from "./editable-shift-list"
import _ from "underscore"
import StaffTypeBadge from "~components/staff-type-badge"

export default class StaffDetailsAndShifts extends Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        staffId: React.PropTypes.number.isRequired,
        staff: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.array.isRequired,
        showShiftVenue: React.PropTypes.bool,
        rotasById: React.PropTypes.object.isRequired,
        venuesById: React.PropTypes.object
    }
    render(){
        var staff = this.getStaff();
        var shifts = this.getShifts();
        var { venuesById, rotasById, showShiftVenue } = this.props;

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

            <EditableShiftList
                shifts={shifts}
                venuesById={venuesById}
                rotasById={rotasById}
                showShiftVenue={showShiftVenue} />

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
