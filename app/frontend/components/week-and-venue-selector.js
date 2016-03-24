import React from "react"
import WeekPicker from "~components/week-picker"
import VenueDropdown from "~components/venue-dropdown"
import _ from "underscore"

export default class WeekAndVenueSelector extends React.Component {
    static propTypes = {
        venueClientId: React.PropTypes.string,
        weekStartDate: React.PropTypes.instanceOf(Date).isRequired,
        onChange: React.PropTypes.func.isRequired,
        venues: React.PropTypes.object.isRequired,
        canSelectAllVenues: React.PropTypes.bool
    }
    render(){
        var selectedVenues = [];
        if (this.props.venueClientId) {
            selectedVenues = [this.props.venueClientId];
        }
        return <div className="row">
            <div className="col-md-6">
                <WeekPicker
                    selectionStartDate={this.props.weekStartDate}
                    onChange={(selection) => {
                        this.props.onChange({
                            startDate: selection.startDate,
                            endDate: selection.endDate,
                            venueClientId: this.props.venueClientId
                        });
                    } }/>
            </div>
            <div className="col-md-6">
                <VenueDropdown
                    venues={this.props.venues}
                    selectedVenues={selectedVenues}
                    clearable={this.props.canSelectAllVenues ? true : false}
                    onChange={
                        (venueClientId) => this.props.onChange({
                            startDate: this.props.weekStartDate,
                            endDate: this.getWeekEndDate(this.props.weekStartDate),
                            venueClientId: this.props.venueClientId
                        })
                    } />
                {this.props.children}
            </div>
        </div>
    }
    getWeekEndDate(weekStartDate){
        var endDate = new Date(weekStartDate);
        endDate.setDate(endDate.getDate() + 7);
        return endDate;
    }
}