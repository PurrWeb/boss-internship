import React from "react"
import StaffTypeRotaStaffFinder from "./staff-type-rota-staff-finder"
import ShiftTimeSelector from "~/components/shift-time-selector"
import VenueDropdown from "~/components/venue-dropdown"
import ShiftTypeSelector from "~/components/shift-type-selector"

export default class AddShiftView extends React.Component {
    render(){
        return <div>
            <div className="row mb-md">
                <div className="shrink column">
                    <ShiftTimeSelector
                        defaultShiftTimes={this.props.shiftTimes}
                        onChange={this.props.onShiftTimesChange}
                        rotaDate={this.props.rotaDate} />
                </div>
                <div className="shrink column">
                    Venue<br/>
                    <VenueDropdown
                        venues={this.props.venues}
                        selectedVenues={[this.props.selectedVenueId]}
                        multi={false}
                        clearable={false}
                        onChange={(venues) => this.props.onVenueChange(venues[0])} />

                </div>
                <div className="shrink column">
                    <div style={{marginBottom: 8}}>Shift Type</div>
                    <ShiftTypeSelector
                        shiftType={this.props.shiftType}
                        onChange={this.props.onShiftTypeChange} />
                </div>
            </div>
            <hr className="mb-md" />
            <StaffTypeRotaStaffFinder
                staff={this.props.staff}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes} />
        </div>
    }
}