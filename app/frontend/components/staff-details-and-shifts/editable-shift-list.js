import React, { Component } from "react"
import _ from "underscore"
import getVenueFromShift from "~/lib/get-venue-from-shift"
import getVenueColor from "~/lib/get-venue-color"
import EditableShiftListItem from "./editable-shift-list-item"

export default class EditableShiftList extends Component {
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
                var venueIds = _.pluck(_.values(venuesById), "clientId");
                var index = venueIds.indexOf(venue.clientId);
                venueColor = getVenueColor(index);
            }

            return <EditableShiftListItem 
                venueObject={venue}
                venueColor={venueColor}
                shift={shift}
                key={shift.clientId} />
        });

        return <div>
            {shiftEls}
        </div>
    }
}
