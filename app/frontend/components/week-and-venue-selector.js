import React from "react"
import WeekPicker from "~components/week-picker"
import VenueDropdown from "~components/venue-dropdown"
import _ from "underscore"

export default class WeekAndVenueSelector extends React.Component {
    static propTypes = {
        venueId: React.PropTypes.number.isRequired,
        weekStartDate: React.PropTypes.instanceOf(Date).isRequired,
        onChange: React.PropTypes.func.isRequired,
        venues: React.PropTypes.object.isRequired,
        canSelectAllVenues: React.PropTypes.bool.isRequired
    }
    render(){
        var selectedVenues = "";
        if (this.props.venueId) {
            selectedVenues = [this.props.venueId];
        }
        return <div className="row">
            <div className="col-md-6">
                <WeekPicker
                    selectionStartDate={this.props.weekStartDate}
                    onChange={(selection) => {
                        this.props.onChange({
                            startDate: selection.startDate,
                            endDate: selection.endDate,
                            venueId: this.props.venueId
                        });
                    } }/>
            </div>
            <div className="col-md-6">
                <VenueDropdown
                    venues={this.props.venues}
                    selectedVenues={selectedVenues}
                    clearable={this.props.canSelectAllVenues ? true : false}
                    onChange={
                        (venueId) => this.props.onChange({
                            startDate: this.props.weekStartDate,
                            endDate: this.getWeekEndDate(this.props.weekStartDate),
                            venueId: venueId
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