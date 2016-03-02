import React from "react"
import StaffTypeRotaStaffFinder from "./staff-type-rota-staff-finder"
import ShiftTimeSelector from "~components/shift-time-selector"
import VenueDropdown from "~components/venue-dropdown"

export default class AddShiftView extends React.Component {
    render(){
        return <div className="well well-lg">
            <div className="row">
                <div className="col-md-6">
                    <ShiftTimeSelector
                        defaultShiftTimes={this.props.shiftTimes}
                        onChange={this.props.onShiftTimesChange} />
                </div>
                <div className="col-md-3">
                    Venue<br/>
                    <VenueDropdown
                        venues={this.props.venues}
                        selectedVenues={[this.props.selectedVenueId]}
                        multi={false}
                        clearable={false}
                        onChange={(venues) => this.props.onVenueChange(venues[0])} />

                </div>
            </div>
            <hr/>
            <StaffTypeRotaStaffFinder
                staff={this.props.staff}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes} />            
        </div>
    }
}