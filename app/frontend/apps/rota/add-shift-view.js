import React, { Component } from "react"
import RotaDate from "~lib/rota-date.js"
import ShiftTimeSelector from "~components/shift-time-selector"
import StaffFinder from "./staff-finder/staff-finder"
import utils from "~lib/utils"
import _ from "underscore"


export default class AddShiftView extends Component {
    static childContextTypes = {
        addShift: React.PropTypes.func,
        canAddShift: React.PropTypes.func
    }
    static contextTypes = {
        boundActionCreators: React.PropTypes.object
    }
    getChildContext(){
        var canAddShift = (staff_id) => {
            var datesAreValid = utils.dateIsValid(this.state.shiftTimes.starts_at) &&
            utils.dateIsValid(this.state.shiftTimes.ends_at);
            var isAddingShift = _(this.props.staff).find({id: staff_id}).addShiftIsInProgress;
            return datesAreValid && !isAddingShift; 
        }
        return {
            addShift: (staffId, requestComponent) => this.addShift(staffId, requestComponent),
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
                <div className="row">
                    <div className="col-md-3">
                        <ShiftTimeSelector
                            defaultShiftTimes={this.getDefaultShiftTimes(this.props)}
                            rotaDate={new RotaDate(this.props.dateOfRota)}
                            onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                            dateOfRota={this.props.dateOfRota} />
                    </div>
                </div>
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
    addShift(staffId, requestComponent){
        this.context.boundActionCreators.addRotaShift({
            shift: {
                starts_at: this.state.shiftTimes.starts_at,
                ends_at: this.state.shiftTimes.ends_at,
                staff_id: staffId
            },
            requestComponent: requestComponent
        });
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}