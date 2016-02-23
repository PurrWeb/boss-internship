import React from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import RotaStaffFinder from "../staff-finder/staff-finder"
import RotaDate from "~lib/rota-date.js"

export default class AddShiftView extends React.Component {
    static propTypes = {
        shiftTimes: React.PropTypes.object.isRequired,
        rotaDate: React.PropTypes.instanceOf(Date).isRequired,
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
                            rotaDate={new RotaDate({dateOfRota: this.props.dateOfRota})}
                            onChange={this.props.onShiftTimesChange}
                            dateOfRota={this.props.dateOfRota} />
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