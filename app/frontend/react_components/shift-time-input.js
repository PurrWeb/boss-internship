import React, { Component } from "react"
import RotaDate from "../lib/rota-date.js"
import moment from "moment"
import utils from "../lib/utils"

var SHIFT_TIME_TYPES = {
    START: 2,
    END: 3
}

export default class ShiftTimeInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            shiftTimeType: null,
            defaultDate: null,
            time: null
        };
    }
    componentWillMount(){
        this.handlePotentialPropChange(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.handlePotentialPropChange(nextProps)
    }
    /**
     * If the date being edited has changed we want to use that instead,
     * otherwise just keep the existing state.
     */
    handlePotentialPropChange(props){
        var defaultDate;
        var shiftTimeType;
        if (props.startsAt) {
            shiftTimeType = SHIFT_TIME_TYPES.START;
            defaultDate = props.startsAt;
        } else {
            shiftTimeType = SHIFT_TIME_TYPES.END;
            defaultDate = props.endsAt;
        }

        var hasDefaultDate = this.state.defaultDate !== null;
        if (hasDefaultDate) {
            var defaultDateHasChanged = defaultDate.valueOf() !== this.state.defaultDate.valueOf();
            if (!defaultDateHasChanged) {
                return;
            }
        }

        this.setState({
            time: moment(defaultDate).format("HH:mm"),
            defaultDate: defaultDate,
            shiftTimeType: shiftTimeType
        })
    }
    render(){
        if (!this.state) {
            return null;
        }

        var className = "";
        if (!utils.dateIsValid(this.getDateFromTime(this.state.time))){
            className += "shift-time-input--invalid";
        }

        return <input
            type="time"
            value={this.state.time}
            className={className}
            onChange={(e) => this.updateTime(e.target.value)} />
    }
    getDateFromTime(timeString){
        var rotaDate = new RotaDate(this.state.defaultDate);
        if (this.state.shiftTimeType === SHIFT_TIME_TYPES.START) {
            return rotaDate.getDateFromShiftStartTimeString(timeString);
        } else {
            return rotaDate.getDateFromShiftEndTimeString(timeString);
        }
    }
    updateTime(newValue){
        this.setState({time: newValue});

        var newDate = this.getDateFromTime(newValue);

        this.props.onChange(newDate, utils.dateIsValid(newDate));
    }
}
