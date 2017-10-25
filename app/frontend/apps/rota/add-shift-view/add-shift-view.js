import PropTypes from 'prop-types';
import React from "react"
import ShiftTimeSelector from "~/components/shift-time-selector"
import RotaStaffFinder from "../staff-finder/staff-finder"
import ShiftTypeSelector from "~/components/shift-type-selector"

export default class AddShiftView extends React.Component {
    static propTypes = {
        shiftTimes: PropTypes.object.isRequired,
        onShiftTimesChange: PropTypes.func.isRequired,
        staff: PropTypes.object.isRequired,
        staffTypes: PropTypes.object.isRequired,
        rotaDate: PropTypes.object.isRequired,
        shiftType: PropTypes.string.isRequired,
        onShiftTypeChange: PropTypes.func.isRequired
    }
    render(){
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h2 className="panel-title">New shift hours</h2>
                </div>
                <div className="panel-body">
                    <div className="row">
                        <div className="shrink column">
                            <ShiftTimeSelector
                              rotaDate={this.props.rotaDate}
                              defaultShiftTimes={this.props.shiftTimes}
                              onChange={this.props.onShiftTimesChange} />
                        </div>
                        <div className="shrink column">
                            <label>Shift Type</label>
                            <ShiftTypeSelector
                              shiftType={this.props.shiftType}
                              onChange={this.props.onShiftTypeChange} />
                        </div>
                    </div>
                    <br/>
                    <RotaStaffFinder
                      staff={this.props.staff}
                      staffTypes={this.props.staffTypes} />
                </div>
            </div>
        );
    }
}