import React, { Component } from "react"
import moment from "moment"
import _ from "underscore"
import getVenueFromShift from "~lib/get-venue-from-shift"
import RotaDate from "~lib/rota-date"

class StaffShiftListItem extends Component {
    render(){
        var {shift} = this.props;
        var rotaDate = new RotaDate({shiftStartsAt: shift.starts_at});
        var dateOfRota = rotaDate.getDateOfRota();

        var date = "";
        if (this.props.showDate) {
            date = <span>
                {moment(dateOfRota).format("DD MMM")}
                &nbsp;
            </span>
        }
        var venue = "";
        if (this.props.showVenue) {
            venue = <span>
                &nbsp;
                ({this.props.venueName})
            </span>
        }
        return <div className="staff-shift-list__shift">
            {date}
            {moment(shift.starts_at).format("H:mm")}
            &nbsp;to&nbsp;
            {moment(shift.ends_at).format("H:mm")}
            {venue}
        </div>
    }
}

export default class StaffShiftList extends Component {
    static propTypes = {
        shifts: React.PropTypes.object.isRequired,
        venues: React.PropTypes.object.isRequired,
        rotas: React.PropTypes.object.isRequired,
        showDate: React.PropTypes.bool,
        showVenue: React.PropTypes.bool
    }
    render() {
        var shifts = _.values(this.props.shifts);
        shifts = _.sortBy(shifts, "starts_at");
        var shiftElements = shifts.map((shift, i) =>{
            var venue = getVenueFromShift({
                shift,
                venuesById: this.props.venues,
                rotasById: this.props.rotas
            });
            return <StaffShiftListItem
                key={i}
                shift={shift}
                showVenue={this.props.showVenue}
                showDate={this.props.showDate}
                venueName={venue.name} />
        })
        return (
            <div className="staff-shift-list">
                {shiftElements}
            </div>
        );
    }
}
