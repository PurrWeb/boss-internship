import React, { Component } from "react"
import RotaDate from "../lib/rota-date.js"
import ShiftTimeSelector from "./shift-time-selector"
import StaffFinder from "./staff-finder.js"
import utils from "../lib/utils"


export default class AddShiftView extends Component {
    static childContextTypes = {
        addShift: React.PropTypes.func,
        canAddShift: React.PropTypes.bool
    }
    static contextTypes = {
        boundActionCreators: React.PropTypes.object
    }
    getChildContext(){
        var canAddShift = utils.dateIsValid(this.state.shiftTimes.starts_at) &&
            utils.dateIsValid(this.state.shiftTimes.ends_at);
        return {
            addShift: (staffId) => this.addShift(staffId),
            canAddShift
        }
    }
    constructor(props){
        super(props)

        var state = {
            shiftTimes: this.getDefaultShiftTimes(props)
        };
        this.state = state;
    }
    render() {
        return (
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>New shift hours</h2>
                <ShiftTimeSelector
                    defaultShiftTimes={this.getDefaultShiftTimes(this.props)}
                    rotaDate={new RotaDate(this.props.dateOfRota)}
                    onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                    dateOfRota={this.props.dateOfRota} />
                <br/>
                <hr/>
                <StaffFinder
                    staff={this.props.staff} />
            </div>
        );
    }
    getDefaultShiftTimes(props) {
        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        return {starts_at, ends_at};
    }
    addShift(staffId){
        this.context.boundActionCreators.addRotaShift({
            starts_at: this.state.shiftTimes.starts_at,
            ends_at: this.state.shiftTimes.ends_at,
            staff_id: staffId
        })
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}