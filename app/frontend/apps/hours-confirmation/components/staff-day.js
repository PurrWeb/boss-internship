import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"

export default class StaffDay extends React.Component {
    render(){
        var proposedClockIns = _.pluck(this.props.acceptedHours, "clockInHours");

        return <div className="row">
            <div className="col-md-2">
                name/picture
            </div>
            <div className="col-md-10">
                <div className="row">
                    <div className="col-md-9">
                        <HoursChart
                            rotaDate={this.props.rotaDate}
                            rotaedShifts={this.props.rotaedShifts}
                            acceptedHours={this.props.acceptedHours}
                            proposedAcceptedClockIns={proposedClockIns}
                            clockedClockIns={this.props.clockedClockIns}/>
                            (todo: stats)
                    </div>
                    <div className="col-md-3">
                        notes
                    </div>
                </div>
                <AcceptedHoursList
                    predefinedReasons={this.props.predefinedReasons}
                    rotaDate={this.props.rotaDate}
                    acceptedHours={this.props.acceptedHours}
                    onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
            </div>
        </div>
    }
}


class BreakListItem extends React.Component {
    render(){
        var breakItem = this.props.breakItem
        return <div>
            <ShiftTimeSelector
                defaultShiftTimes={{
                    starts_at: breakItem.starts_at,
                    ends_at: breakItem.ends_at
                }}
                rotaDate={this.props.rotaDate}
                onChange={(times) =>{
                    this.props.onChange(times)
                }}
            />
        </div>
    }
}

class BreakList extends React.Component {
    render(){
        return <div>
            {this.props.breaks.map((breakItem) => {
                return <BreakListItem
                    onChange={(newBreakItem) => {
                        var breaks = utils.replaceArrayElement(
                            this.props.breaks,
                            breakItem,
                            newBreakItem)
                        this.props.onChange(breaks)
                    }}
                    rotaDate={this.props.rotaDate}
                    breakItem={breakItem} />
            })}
            <div>
                <a
                    className="btn btn-default btn-sm"
                    onClick={() => this.addBreak()}>
                    +
                </a>
            </div>
        </div>
    }
    addBreak(){
        var {rotaDate} = this.props;
        var newBreaks = _.clone(this.props.breaks);
        newBreaks.push({
            starts_at: rotaDate.getDateFromShiftStartTime(8, 0),
            ends_at: rotaDate.getDateFromShiftEndTime(9, 0)
        })
        this.props.onChange(newBreaks);
    }
}

class ReasonSelector extends React.Component {
    render(){
        var {reasonId, reasonText, predefinedReasons} = this.props;
        var selectedReason = _(predefinedReasons).find({id: reasonId});

        var showTextArea = selectedReason.title === "Other";

        return <div>
            <select value={reasonId}>
                {predefinedReasons.map((reason) =>
                    <option value={reason.id}>
                        {reason.title}
                    </option>
                )}
            </select>
            <textarea
                style={{display: showTextArea ? "block" : "none"}}
                value={reasonText} />
        </div>
    }
}

class AcceptedHoursListItem extends React.Component {
    render(){
        var acceptedHours = this.props.acceptedHours;
        var clockIn = this.props.acceptedHours.clockInHours
        return <div className="row">
            <div className="col-md-9">
                <div className="col-md-4">
                    <u>From/To</u>
                    <ShiftTimeSelector
                        defaultShiftTimes={{
                            starts_at: clockIn.starts_at,
                            ends_at: clockIn.ends_at
                        }}
                        rotaDate={this.props.rotaDate}
                        onChange={(times) => this.triggerChange({
                            starts_at: times.starts_at,
                            ends_at: times.ends_at
                        })}
                        />
                </div>
                <div className="col-md-4">
                    <u>Breaks</u>
                    <br/>
                    <BreakList
                        onChange={(breaks) => this.triggerChange({
                            breaks
                        })}
                        rotaDate={this.props.rotaDate}
                        breaks={clockIn.breaks}
                        />
                </div>
                <div className="col-md-4">
                    <u>Reason</u>
                    <ReasonSelector
                        predefinedReasons={this.props.predefinedReasons}
                        reasonId={acceptedHours.reason_id}
                        reasonText={acceptedHours.reason_text}
                    />
                </div>
            </div>
            <div className="col-md-3">
                Accept/Save
            </div>
        </div>
    }
    triggerChange(dataToUpdate){
        var acceptedHours = _.clone(this.props.acceptedHours);
        var clockIn = acceptedHours.clockInHours;
        clockIn = _.extend({}, clockIn, dataToUpdate);
        acceptedHours.clockInHours = clockIn;
        this.props.onChange(acceptedHours)
    }
}

class AcceptedHoursList extends React.Component {
    render(){
        return <div>
            {this.props.acceptedHours.map(
                (acceptedHours) =>
                    <AcceptedHoursListItem
                        onChange={(newAcceptedHours) => {
                            var newValue = _.clone(this.props.acceptedHours);
                            newValue = utils.replaceArrayElement(newValue, acceptedHours, newAcceptedHours)
                            this.props.onChange(newValue)
                        }}
                        rotaDate={this.props.rotaDate}
                        predefinedReasons={this.props.predefinedReasons}
                        acceptedHours={acceptedHours} />
            )}
        </div>
    }
}
