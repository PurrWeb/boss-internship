import React from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import RotaStaffFinder from "../staff-finder/staff-finder"

export default class AddShiftView extends React.Component {
    static propTypes = {
        shiftTimes: React.PropTypes.object.isRequired,
        onShiftTimesChange: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired
    }
    render(){
        return (
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>New shift hours</h2>
                <div className="row">
                    <div className="col-md-3">
                        <ShiftTimeSelector
                            defaultShiftTimes={this.props.shiftTimes}
                            onChange={this.props.onShiftTimesChange} />
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