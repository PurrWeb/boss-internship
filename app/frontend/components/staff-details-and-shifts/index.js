import React, { Component } from "react"
import EditableShiftList from "./editable-shift-list"
import _ from "underscore"
import StaffTypeBadge from "~/components/staff-type-badge"
import oFetch from "o-fetch"
import { appRoutes } from "~/lib/routes"

export default class StaffDetailsAndShifts extends Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        staffMemberClientId: React.PropTypes.string.isRequired,
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

        var staffType = staff.staff_type.get(this.props.staffTypes);
        return <div>
            <h2 className="staff-details-and-shifts__h2">
              <a
                href={appRoutes.staffMember(staff.serverId)}
                className="link-unstyled"
              >
                {staff.first_name} {staff.surname}
              </a>
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
        return oFetch(this.props.staff, this.props.staffMemberClientId);
    }
    getShifts(){
        return _(this.props.rotaShifts).filter(
            shift => shift.staff_member.clientId === this.props.staffMemberClientId
        );
    }
}
