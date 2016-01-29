import React, { Component } from "react"
import Select from "react-select"

export default class VenueDropdown extends Component {
    static propTypes = {
        venues: React.PropTypes.array.isRequired
    }
    render(){
        var venueOptions = this.props.venues.map(function(venue){
            return {
                value: venue.id,
                label: venue.name
            };
        })
        


        return <Select
            value={this.props.selectedVenue}
            options={venueOptions}
            onChange={(value) => this.props.onChange(value)} />
    }
}
