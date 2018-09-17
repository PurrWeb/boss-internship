import PropTypes from 'prop-types';
import React, { Component } from "react"
import moment from "moment"
import _ from "underscore"
import getVenueFromShift from "~/lib/get-venue-from-shift"
import RotaDate from "~/lib/rota-date"

class StaffShiftListItem extends Component {
    render(){
        var {shift} = this.props;
        var rotaDate = new RotaDate({shiftStartsAt: shift.starts_at});
        var dateOfRota = rotaDate.getDateOfRota();

        var date = "";
        if (this.props.showDate) {
            date = moment(dateOfRota).format("DD MMM") + ' ';
        }
        var venue = "";
        if (this.props.showVenue && this.props.venueName) {
            venue = ` ${this.props.venueName}`;
        }
        var isStandby = '';
        if (shift.isStandby()) {
            isStandby = " - Standby";
        }

        const resultString = `${date}${moment(shift.starts_at).format("H:mm")} to ${moment(shift.ends_at).format("H:mm")}${venue}${isStandby}`;

        return <div>
            {resultString}
        </div>
    }
}

export default class StaffShiftList extends Component {
    static propTypes = {
        shifts: PropTypes.object.isRequired,
        venues: PropTypes.object.isRequired,
        rotas: PropTypes.object.isRequired,
        showDate: PropTypes.bool,
        showVenue: PropTypes.bool
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
        });
        const noShiftsMessage = shifts.length === 0 ? 'none' : null;

        return (
            <div className="boss-info-table__rotaed-text">
                {shiftElements}
                {noShiftsMessage}
            </div>
        );
    }
}
