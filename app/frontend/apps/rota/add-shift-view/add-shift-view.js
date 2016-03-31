import React from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import RotaStaffFinder from "../staff-finder/staff-finder"
import ShiftTypeSelector from "~components/shift-type-selector"

export default class AddShiftView extends React.Component {
    static propTypes = {
        shiftTimes: React.PropTypes.object.isRequired,
        onShiftTimesChange: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        rotaDate: React.PropTypes.object.isRequired,
        shiftType: React.PropTypes.string.isRequired,
        onShiftTypeChange: React.PropTypes.func.isRequired
    }
    render(){
        return (
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>New shift hours</h2>
                <div className="row">
                    <div className="col-md-3">
                        <ShiftTimeSelector
                            rotaDate={this.props.rotaDate}
                            defaultShiftTimes={this.props.shiftTimes}
                            onChange={this.props.onShiftTimesChange} />
                    </div>
                    <div className="col-md-3">
                        <div style={{marginBottom: 8}}>
                            Shift Type
                        </div>
                        <ShiftTypeSelector
                            shiftType={this.props.shiftType}
                            onShiftTypeChange={this.props.onShiftTypeChange}
                            />
                    </div>
                </div>
                <br/>
                <RotaStaffFinder
                    staff={this.props.staff}
                    staffTypes={this.props.staffTypes} />
            </div>
        );
    }
}