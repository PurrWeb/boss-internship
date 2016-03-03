import React, { Component } from "react"
import ShiftEditor from "./containers/shift-editor"
import StaffTypeBadge from "~components/staff-type-badge"
import _ from "underscore"
import getVenueFromShift from "~lib/get-venue-from-shift"
import getVenueColor from "~lib/get-venue-color"

class ShiftItem extends Component {
    render(){
        var venueInfo = null;
        if (this.props.venueObject) {
            venueInfo = <div
                className="boss-badge"
                style={{
                    backgroundColor: this.props.venueColor,
                    display: "inline-block",
                    marginLeft: -2,
                    marginBottom: 2
                }}>
                {this.props.venueObject.name}
            </div>
        }
        return <div>
            {venueInfo}
            <ShiftEditor
                shift={this.props.shift} />
        </div>
    }
}

class EditableShiftList extends Component {
    render(){
        var { venuesById, rotasById, showShiftVenue, shifts } = this.props;

        var shiftEls = shifts.map(function(shift){
            var venue = null;
            var venueColor = null;
            if (showShiftVenue){
                venue = getVenueFromShift({
                    venuesById,
                    rotasById,
                    shift: shift
                });
                var venueIds = _.pluck(_.values(venuesById), "id");
                var index = venueIds.indexOf(venue.id);
                venueColor = getVenueColor(index);
            }

            return <ShiftItem 
                venueObject={venue}
                venueColor={venueColor}
                shift={shift}
                key={shift.id} />
        });

        return <div>
            {shiftEls}
        </div>
    }
}

export default class StaffDetailsAndShifts extends Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        staffId: React.PropTypes.number.isRequired,
        staff: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.object.isRequired,
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
