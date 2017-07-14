import React, { Component } from "react"
import Select from "react-select"
import _ from "underscore"
import getArrayOfIdsFromReactSelectValue from "~/lib/get-array-of-ids-from-react-select-value";

export default class VenueDropdown extends Component {
    static propTypes = {
        selectedVenues: React.PropTypes.arrayOf(React.PropTypes.string),
        venues: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        multi: React.PropTypes.bool,
        clearable: React.PropTypes.bool // defaults to true
    };
    render(){
        var venueOptions = _.values(this.props.venues).map(function(venue){
            return {
                value: venue.clientId,
                label: venue.name
            };
        });

        var multi = this.props.multi !== undefined ? this.props.multi : false;
        const delimiter = ',';
        const values = this.props.selectedVenues.join(delimiter);

        return <Select
            value={values}
            delimiter={delimiter}
            options={venueOptions}
            placeholder="All Venues"
            clearable={this.props.clearable !== undefined ? this.props.clearable : true}
            multi={multi}
            onChange={(optionData) => {
              const value = (optionData || {}).value || '';

                this.props.onChange(
                    getArrayOfIdsFromReactSelectValue(value)
                )
            }} />
    }
}
