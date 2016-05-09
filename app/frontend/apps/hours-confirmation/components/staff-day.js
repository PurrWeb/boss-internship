import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"
import moment from "moment"
import Validation from "~lib/validation"
import ErrorMessage from "~components/error-message"
import getClockInPeriodStats from "~lib/get-clock-in-period-stats"

const TIME_GRANULARITY_IN_MINUTES = 15;

export default class StaffDay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            chartData: this.getChartDataFromProps(props)
        }
    }
    componentWillReceiveProps(nextProps){
        if (!Validation.validateHoursAcceptances(nextProps.acceptedHours).isValid) {
            return; // don't try to display invalid data on the chart
        }
        this.setState({
            chartData: this.getChartDataFromProps(nextProps)
        })
    }
    getChartDataFromProps(props){
        var proposedClockIns = _.pluck(props.acceptedHours, "clockInHours");
        return {
            rotaDate: props.rotaDate,
            rotaedShifts: props.rotaedShifts,
            acceptedHours: props.acceptedHours,
            proposedAcceptedClockIns: proposedClockIns,
            clockedClockIns: props.clockedClockIns,
            events: props.events
        }
    }
    render(){
        var proposedClockIns = _.pluck(this.props.acceptedHours, "clockInHours");
        var {staffMember} = this.props;

        var style = {
            transition: ".2s all",
            maxHeight: 1000
        };

        if (this.props.markedAsDone){
            style.maxHeight = 0;
            style.overflow = "hidden";
        }

        var acceptedClockInPeriods = _(this.props.acceptedHours)
            .chain()
            .filter({accepted_state: "accepted"})
            .pluck("clockInHours")
            .value();

        return <div style={style}>
            <div style={{
                marginBottom: 50,
                padding: 10,
                border: "1px solid #ddd"
            }}>
                <StaffDayHeader
                    rotaDate={this.props.rotaDate}
                    staffMember={this.props.staffMember}
                    clockedClockInPeriods={this.state.chartData.clockedClockIns}
                    acceptedClockInPeriods={acceptedClockInPeriods}
                    rotaedShifts={this.props.rotaedShifts}
                />
                <div className="row">
                    <div className="col-md-2">
                        <img
                            src={staffMember.avatar_url}
                            style={{width: "90%", marginBottom: 4}}
                        />
                    </div>
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-9">
                                <HoursChart
                                    rotaDate={this.state.chartData.rotaDate}
                                    rotaedShifts={this.state.chartData.rotaedShifts}
                                    acceptedHours={this.state.chartData.acceptedHours}
                                    proposedAcceptedClockIns={this.state.chartData.proposedAcceptedClockIns}
                                    clockedClockIns={this.state.chartData.clockedClockIns}
                                    events={this.state.chartData.events}
                                />
                            </div>
                            <div className="col-md-3">
                                <StaffDayNotes notes={this.props.notes} />
                            </div>
                        </div>
                        <AcceptedHoursList
                            predefinedReasons={this.props.predefinedReasons}
                            rotaDate={this.props.rotaDate}
                            acceptedHours={this.props.acceptedHours}
                            markDayAsDone={this.props.markDayAsDone}
                            onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
                    </div>
                </div>
            </div>
        </div>
    }
}

class StaffDayHeader extends React.Component {
    render(){
        var { staffMember, rotaDate, clockedClockInPeriods, acceptedClockInPeriods, rotaedShifts } = this.props;
        var rotaedClockInPeriods = rotaedShifts.map(function(shift){
            return {
                starts_at: shift.starts_at,
                ends_at: shift.ends_at,
                breaks: []
            }
        })

        var clockedStats = getClockInPeriodStats(clockedClockInPeriods);
        var acceptedStats = getClockInPeriodStats(acceptedClockInPeriods);
        var rotaedStats = getClockInPeriodStats(rotaedClockInPeriods)

        return <h2 style={{
                fontSize: 20,
                margin: 0,
                marginBottom: 10,
                borderBottom: "1px solid #eee",
                paddingBottom: 5
            }}>
            <div style={{display: "inline-block"}}>
                {staffMember.first_name} {staffMember.surname}
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "normal",
                marginLeft: 4,
                color: "#999",
                fontSize: 16
            }}>
                {rotaedStats.hours}h rotaed, {clockedStats.hours}h clocked, {acceptedStats.hours}h accepted
            </div>
            <div style={{float: "right"}}>
                {moment(rotaDate.startTime).format("DD MMM YYYY")}
            </div>
        </h2>
    }
}

class ValidationResult extends React.Component {
    render(){
        if (this.props.result.isValid) {
            return null;
        }
        return <ErrorMessage>
            {this.props.result.messages.map(
                msg => <div>{msg}</div>
            )}
        </ErrorMessage>
    }
}

class StaffDayNotes extends React.Component {
    render(){
        return <div>
            <u>Notes</u>
            <ul style={{paddingLeft: 20}}>
                {this.props.notes.map((note) =>
                    <li>{note.text}</li>
                )}
            </ul>
        </div>
    }
}

class BreakListItem extends React.Component {
    render(){
        var breakItem = this.props.breakItem;

        var deleteBreakButton;
        if (!this.props.readonly) {
            deleteBreakButton = <a className="btn btn-default" onClick={this.props.onDeleteItem}>
                x
            </a>
        }

        var style = {};
        if (!this.isValid()) {
            style.color ="red"
        }

        return <div className="row" style={{marginBottom: 10}}>
            <div className="col-md-10"
                style={style}>
                <ShiftTimeSelector
                    defaultShiftTimes={{
                        starts_at: breakItem.starts_at,
                        ends_at: breakItem.ends_at
                    }}
                    showErrorMessages={false}
                    rotaDate={this.props.rotaDate}
                    onChange={(times) => {
                        this.props.onChange(times)
                    }}
                    granularityInMinutes={TIME_GRANULARITY_IN_MINUTES}
                    readonly={this.props.readonly}
                />
            </div>
            <div className="col-md-2">
                <br/>
                {deleteBreakButton}
            </div>
        </div>
    }
    isValid(){
        var {acceptedHoursClockInHours, breakItem} = this.props;

        var validationResult = Validation.validateBreak({
            breakItem,
            acceptedHoursClockInHours
        })

        return validationResult.isValid;
    }
}

class BreakList extends React.Component {
    render(){
        var validationResult = Validation.validateBreaks({
            breaks: this.props.breaks,
            acceptedHoursClockInHours: this.props.acceptedHours.clockInHours
        })

        var addBreakButton;
        if (!this.props.readonly) {
            addBreakButton = <a
                className="btn btn-default btn-sm"
                onClick={() => this.addBreak()}
                style={{display: "inline-block", marginBottom: 4}}>
                Add Break
            </a>
        }

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
                    readonly={this.props.readonly}
                    acceptedHoursClockInHours={this.props.acceptedHours.clockInHours}
                    onDeleteItem={() => {
                        var newBreaks = _(this.props.breaks).reject(
                            (breakItemArg) => breakItemArg === breakItem
                        )
                        this.props.onChange(newBreaks)
                    }}
                    rotaDate={this.props.rotaDate}
                    breakItem={breakItem} />
            })}
            <div>
                {addBreakButton}
            </div>
            <ValidationResult result={validationResult} />
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

        var dropdown, dropdownSelectionString;
        if (this.props.readonly) {
            dropdownSelectionString = <div>
                {selectedReason.title}
            </div>
        } else {
            dropdown = <select
                style={{marginBottom: 4}}
                value={reasonId}
                onChange={(e) => this.triggerChange({
                    reason_id: e.target.value
                })}>
                {predefinedReasons.map((reason) =>
                    <option value={reason.id}>
                        {reason.title}
                    </option>
                )}
            </select>
        }

        return <div>
            {dropdown}
            {dropdownSelectionString}
            <textarea
                onChange={(e) => {
                    if (this.props.readonly) {
                        return;
                    }
                    this.triggerChange({
                        reason_text: e.target.value
                    })
                }}
                readonly={this.props.readonly}
                style={{display: showTextArea ? "block" : "none"}}
                value={reasonText} />
        </div>
    }
    triggerChange(dataToUpdate){
        var newData = {
            reason_id: this.props.reasonId,
            reason_text: this.props.reasonText
        }
        _.extend(newData, dataToUpdate);
        this.props.onChange(newData)
    }
}

class AcceptedHoursListItem extends React.Component {
    render(){
        var acceptedHours = this.props.acceptedHours;
        var clockIn = this.props.acceptedHours.clockInHours;
        var readonly = this.isAccepted();


        return <div className="row">
            <div className="col-md-9">
                <div className="col-md-4">
                    <u>From/To</u>
                    <ShiftTimeSelector
                        defaultShiftTimes={{
                            starts_at: clockIn.starts_at,
                            ends_at: clockIn.ends_at
                        }}
                        readonly={readonly}
                        rotaDate={this.props.rotaDate}
                        onChange={(times) => this.triggerChange({
                            clockInHours:{
                                starts_at: times.starts_at,
                                ends_at: times.ends_at
                            }
                        })}
                        granularityInMinutes={TIME_GRANULARITY_IN_MINUTES}
                        />
                </div>
                <div className="col-md-5">
                    <u>Breaks</u>
                    <br/>
                    <BreakList
                        onChange={(breaks) => this.triggerChange({clockInHours: {
                                breaks
                            }
                        })}
                        readonly={readonly}
                        rotaDate={this.props.rotaDate}
                        breaks={clockIn.breaks}
                        acceptedHours={acceptedHours}
                        />
                </div>
                <div className="col-md-3">
                    <u>Reason</u>
                    <ReasonSelector
                        readonly={readonly}
                        predefinedReasons={this.props.predefinedReasons}
                        reasonId={acceptedHours.reason_id}
                        reasonText={acceptedHours.reason_text}
                        onChange={(newData) => this.triggerChange(newData)}
                    />
                </div>
            </div>
            <div className="col-md-3">
                {this.getAcceptUi()}
            </div>
        </div>
    }
    isAccepted(){
        return this.props.acceptedHours.accepted_state !== "in_progress";
    }
    isValid(){
        return Validation.validateHoursAcceptance(this.props.acceptedHours).isValid;
    }
    getAcceptUi(){
        var stats = getClockInPeriodStats(this.props.acceptedHours.clockInHours);
        if (!this.isAccepted()) {
            var classes = ["btn"]
            if (this.isValid()) {
                classes.push("btn-success")
            } else {
                classes.push("btn-default")
                classes.push("disabled")
            }
            return <div>
                <a
                    onClick={() => this.triggerChange({accepted_state: "accepted"})}
                    className={classes.join(" ")} style={{marginTop: 4}}>
                    Accept {stats.hours}h
                </a>
                <br/><br/>
                <a onClick={this.props.deleteHoursAcceptance}>
                    Delete
                </a>
            </div>
        } else {
            return <div>
                <div style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 4
                }}>
                    {stats.hours}h ACCEPTED
                </div>
                <a
                    onClick={() => this.triggerChange({accepted_state: "in_progress"})}>
                    Unaccept
                </a>
            </div>
        }
    }
    triggerChange(dataToUpdate){
        var acceptedHours = _.clone(this.props.acceptedHours);
        var clockIn = acceptedHours.clockInHours;
        if (dataToUpdate.clockInHours) {
            clockIn = _.extend({}, clockIn, dataToUpdate.clockInHours);
            acceptedHours.clockInHours = clockIn;
        } else {
            _.extend(acceptedHours, dataToUpdate)
        }

        this.props.onChange(acceptedHours)
    }
}

class AcceptedHoursList extends React.Component {
    render(){
        var markAsDoneButton = null;
        if (this.areAllShiftsAccepted()) {
            markAsDoneButton = <button
                onClick={this.props.markDayAsDone}
                style={{float: "right"}}
                className="btn btn-success">
                Done
            </button>
        }

        var intervalsOverlap = Validation.validateHoursAssignmentsDontOverlap({
            hoursAssignments: this.props.acceptedHours
        })

        return <div>
            {this.props.acceptedHours.map(
                (acceptedHours) =>
                    <div style={{
                            border: "1px solid #ddd",
                            padding: 5,
                            marginBottom: 5
                        }}>
                        <AcceptedHoursListItem
                            onChange={(newAcceptedHours) => {
                                var newValue = _.clone(this.props.acceptedHours);
                                newValue = utils.replaceArrayElement(newValue, acceptedHours, newAcceptedHours)
                                this.props.onChange(newValue)
                            }}
                            deleteHoursAcceptance={() => {
                                var newValue = _(this.props.acceptedHours).reject(function(hoursAcceptanceArg){
                                    return hoursAcceptanceArg === acceptedHours
                                })
                                this.props.onChange(newValue);
                            }}
                            rotaDate={this.props.rotaDate}
                            predefinedReasons={this.props.predefinedReasons}
                            acceptedHours={acceptedHours} />
                    </div>
            )}
            <ValidationResult result={intervalsOverlap} />
            {markAsDoneButton}
            <a className="btn btn-default" onClick={() => this.addHours()}>
                Add Shift
            </a>

        </div>
    }
    areAllShiftsAccepted(){
        var unacceptedShifts = _(this.props.acceptedHours).filter({
            accepted_state: "in_progress"
        })
        return unacceptedShifts.length === 0;
    }
    addHours(){
        var {acceptedHours, rotaDate} = this.props;
        acceptedHours = _.clone(acceptedHours)
        acceptedHours.push({
            clockInHours: {
                starts_at: rotaDate.getDateFromShiftStartTime(16, 0),
                ends_at: rotaDate.getDateFromShiftStartTime(18, 0),
                breaks: []
            },
            reason_id: "599",
            reason_text: "",
            accepted_state: "in_progress"
        })
        this.props.onChange(acceptedHours);
    }
}
