import React, { Component } from "react"
import ShiftTimeInput from "../shift-time-input"
import ShiftTimeSelector from "../shift-time-selector"
import RotaDate from "../../lib/rota-date"

export default class StaffShiftEditor extends Component {
    static contextTypes = {
        boundActionCreators: React.PropTypes.object,
        dateOfRota: React.PropTypes.instanceOf(Date)
    }
    constructor(props){
        super(props);
        var {starts_at, ends_at} = props.shift;
        this.state = {
            newShiftTimes: {
                starts_at, ends_at
            }
        }
    }
    render(){
        if (this.props.shift == null) {
            return <div />
        }

        var staff = this.getStaff();

        console.log("render shift editor", `Shift ID ${this.props.shift.id} Staff ID ${staff.id}`)

        return <div>
            <h2 className="staff-shift-editor__h2">
                {staff.first_name} {staff.surname}
            </h2>
            <div className="staff-shift-editor__staff-type">
                {staff.readable_staff_type}
            </div>

            <div>
                <div className="row">
                    <div className="col-md-9">
                        <ShiftTimeSelector
                            defaultShiftTimes={this.props.shift}
                            rotaDate={new RotaDate(this.context.dateOfRota)}
                            onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                            dateOfRota={this.context.dateOfRota} />
                    </div>
                    <div className="col-md-3">
                        <br/>
                        <a className="btn btn-primary" onClick={() => this.updateShift()} style={{marginTop: "-4px"}}>
                            Update
                        </a>
                    </div>
                </div>
            
                <a onClick={() => this.deleteShift()}>
                    Delete shift
                </a>
                <br/><br/>
                <u>Preferences</u><br/>
                Weekly Hours: {staff.preferred_hours}<br/>
                Day Preferences: {staff.preferred_days}
            </div>
        </div>
    }
    getStaff(){
        return this.props.staff[this.props.shift.staff_id];
    }
    deleteShift(){
        this.context.boundActionCreators.deleteRotaShift(this.props.shift.id);
    }
    onShiftTimesChange(shiftTimes) {
        this.setState({newShiftTimes: shiftTimes})
    }
    updateShift(){
        this.context.boundActionCreators.updateRotaShift({
            starts_at: this.state.newShiftTimes.starts_at,
            ends_at: this.state.newShiftTimes.ends_at,
            shift_id: this.props.shift.id
        });
    }
}
