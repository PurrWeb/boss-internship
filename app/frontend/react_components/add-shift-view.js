import React, { Component } from "react"
import RotaDate from "../lib/rota-date.js"
import ShiftTimeSelector from "./shift-time-selector"
import StaffFinder from "./staff-finder.js"
import { boundActionCreators } from "../redux/store";


export default class AddShiftView extends Component {
    constructor(props){
        super(props)

        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        this.state = {
            shiftTimes: {starts_at, ends_at}
        }
    }
    render() {
        return (
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>New shift hours</h2>
                <ShiftTimeSelector
                    defaultShiftTimes={this.state.shiftTimes}
                    rotaDate={new RotaDate(this.props.dateOfRota)}
                    onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                    dateOfRota={this.props.dateOfRota} />
                <br/>
                <hr/>
                <StaffFinder
                    staff={this.props.staff}
                    rotaShifts={this.props.rotaShifts}
                    addShift={(staffId) => this.addShift(staffId)}
                    />
            </div>
        );
    }
    addShift(staffId){
        boundActionCreators.addRotaShift({
            starts_at: this.state.shiftTimes.starts_at,
            ends_at: this.state.shiftTimes.ends_at,
            staff_id: staffId
        })
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}