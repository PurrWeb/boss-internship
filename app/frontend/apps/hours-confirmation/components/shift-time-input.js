import PropTypes from 'prop-types';
import React, { Component } from "react"
import Select from "react-select"
import RotaDate from "~/lib/rota-date.js"
import moment from "moment"
import utils from "~/lib/utils"
import validation from "~/lib/validation"
import { getPossibleShiftStartTimeStrings, getPossibleShiftEndTimeStrings } from "~/lib/possible-shift-time-strings"

var SHIFT_TIME_TYPES = {
    START: 2,
    END: 3
}

export default class ShiftTimeInput extends Component {
    static propTypes = {
        rotaDate: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        // either one of these two:
        startsAt: PropTypes.object,
        endsAt: PropTypes.object,
        readonly: PropTypes.bool,
        granularityInMinutes: PropTypes.number // defaults to 30
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

    getOptions = (input, callback) => {
      callback(null, {
        options: this.getPossibleShiftTimes().map(timeString => ({value: timeString, label: timeString})),
        complete: true
      })
    }

    render(){
        var date = this.getDateFromProps();
        var dateValue;
        if (utils.dateIsValid(date)) {
            dateValue = moment(date).format("HH:mm");
        } else {
            dateValue = "";
        }

        var select, readonlyString;
        if (this.props.readonly) {
            readonlyString = dateValue;
        } else {
            select = <Select.Async
                value={dateValue}
                loadOptions={this.getOptions}
                clearable={false}
                searchable={true}
                onChange={(value) => this.updateTime(value)}
            />
        }
        return <div className="boss-time-shift__select">
              {select}
              <p className="boss-time-shift__select-value">{readonlyString}</p>
        </div>
    }
    getPossibleShiftTimes(){
        var granularityInMinutes = 30;
        if (this.props.granularityInMinutes) {
            granularityInMinutes = this.props.granularityInMinutes
        }
        if (this.getShiftTimeType() === SHIFT_TIME_TYPES.START) {
            return getPossibleShiftStartTimeStrings(granularityInMinutes, this.props.rotaDate.startTime);
        } else {
            return getPossibleShiftEndTimeStrings(granularityInMinutes, this.props.rotaDate.startTime)
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
        if (!newValue.value) {
            return;
        }
        
        var newDate = this.getDateFromTime(newValue);
        this.props.onChange(newDate);
    }
}
