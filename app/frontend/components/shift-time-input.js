import React, { Component } from "react"
import Select from "react-select"
import RotaDate from "~lib/rota-date.js"
import moment from "moment"
import utils from "~lib/utils"
import validation from "~lib/validation"
import { possibleShiftStartTimeStrings, possibleShiftEndTimeStrings } from "~lib/possible-shift-time-strings"

var SHIFT_TIME_TYPES = {
    START: 2,
    END: 3
}

export default class ShiftTimeInput extends Component {
    static propTypes = {
        rotaDate: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        // either one of these two: 
        startsAt: React.PropTypes.object,
        endsAt: React.PropTypes.object

    }
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
        var options = this.getPossibleShiftTimes().map(function(timeString){
            return {
                value: timeString,
                label: timeString
            }
        });

        var date = this.getDateFromProps();
        var dateValue;
        if (utils.dateIsValid(date)) {
            dateValue = moment(date).format("HH:mm");
        } else {
            dateValue = "";
        }

        return <div className="shift-time-input">
            <Select
                value={dateValue}
                options={options}
                clearable={false}
                onChange={(value) => this.updateTime(value)} />
            </div>
    }
    getPossibleShiftTimes(){
        if (this.getShiftTimeType() === SHIFT_TIME_TYPES.START) {
            return possibleShiftStartTimeStrings;
        } else {
            return possibleShiftEndTimeStrings;
        }
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
        this.props.onChange(newDate);
    }
}
