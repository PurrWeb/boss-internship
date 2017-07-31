import React from "react"
import DatePicker from "~/components/date-picker"
import VenueDropdown from "~/components/venue-dropdown"
import _ from "underscore"

export default class DateAndVenueSelector extends React.Component {
    static propTypes = {
        venueClientId: React.PropTypes.string,
        date: React.PropTypes.instanceOf(Date).isRequired,
        onChange: React.PropTypes.func.isRequired,
        venues: React.PropTypes.object.isRequired    }
    render(){
        var selectedVenues = [this.props.venueClientId];
        return <div className="row">
            <div className="column">
                <DatePicker
                    date={this.props.date}
                    onChange={(date) => {
                        this.props.onChange({
                            date: date,
                            venueClientId: this.props.venueClientId
                        });
                    } }/>
            </div>
            <div className="column">
                <VenueDropdown
                    venues={this.props.venues}
                    selectedVenues={selectedVenues}
                    clearable={false}
                    onChange={
                        (venueClientIds) => this.props.onChange({
                            date: this.props.date,
                            venueClientId: venueClientIds[0]
                        })
                    } />
            </div>
        </div>
    }
}
