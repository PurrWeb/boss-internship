import React, { Component } from "react"
import RotaDate from "../lib/rota-date.js"
import moment from "moment"
import utils from "../lib/utils"

var SHIFT_TIME_TYPES = {
    START: 2,
    END: 3
}

export default class ShiftTimeInput extends Component {
    getShiftTimeType(){
        if (this.props.startsAt !== undefined){
            return SHIFT_TIME_TYPES.START;
        }
        if (this.props.endsAt !== undefined) {
            return SHIFT_TIME_TYPES.END;
        }
    }
    getDateFromProps(){
        var shiftTimeType = this.getShiftTimeType();
        if (shiftTimeType === SHIFT_TIME_TYPES.START) {
            return this.props.startsAt;
        }
        if (shiftTimeType === SHIFT_TIME_TYPES.END) {
            return this.props.endsAt;
        }
    }
    render(){
        var className = "";
        if (!this.isValid()){
            className += "shift-time-input--invalid";
        }

        return <input
            type="time"
            value={  moment(this.getDateFromProps()).format("HH:mm")}
            className={className}
            onChange={(e) => this.updateTime(e.target.value)} />
    }
    isValid(){
        return utils.shiftTimeIsValid(this.getDateFromProps());
    }
    getDateFromTime(timeString){
        var rotaDate = this.props.rotaDate;
        if (this.getShiftTimeType() === SHIFT_TIME_TYPES.START) {
            return rotaDate.getDateFromShiftStartTimeString(timeString);
        } else {
            return rotaDate.getDateFromShiftEndTimeString(timeString);
        }
    }
    updateTime(newValue){
        var newDate = this.getDateFromTime(newValue);
        this.props.onChange(newDate, utils.dateIsValid(newDate));
    }
}
