import React, { Component } from "react"
import Select from "react-select"
import _ from "underscore"
import getArrayOfIdsFromReactSelectValue from "~lib/get-array-of-ids-from-react-select-value";

export default class VenueDropdown extends Component {
    static propTypes = {
        selectedVenues: React.PropTypes.array.isRequired,
        venues: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        multi: React.PropTypes.bool,
        clearable: React.PropTypes.bool
    }
    render(){
        var venueOptions = _.values(this.props.venues).map(function(venue){
            return {
                value: venue.id,
                label: venue.name
            };
        })

        var multi = this.props.multi !== undefined ? this.props.multi : false;

        return <Select
            value={this.props.selectedVenues}
            options={venueOptions}
            placeholder="All Venues"
            clearable={this.props.clearable !== undefined ? this.props.clearable : true}
            multi={multi}
            onChange={(value) => {
                this.props.onChange(
                    getArrayOfIdsFromReactSelectValue(value)
                )
            }} />
    }
}
