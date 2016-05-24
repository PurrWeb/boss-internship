import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"
import moment from "moment"
import Validation from "~lib/validation"
import ErrorMessage from "~components/error-message"
import getClockInPeriodStats from "~lib/get-clock-in-period-stats"
import StaffTypeBadge from "~components/staff-type-badge"

const TIME_GRANULARITY_IN_MINUTES = 15;

export default class StaffDay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            lastValidData: this.getLastValidDataFromProps(props)
        }
    }
    componentWillReceiveProps(nextProps){
        if (!Validation.validateHoursAcceptances(nextProps.acceptedHours).isValid) {
            return; // don't try to display invalid data on the chart
        }
        this.setState({
            lastValidData: this.getLastValidDataFromProps(nextProps)
        })
    }
    getLastValidDataFromProps(props){
        return {
            rotaDate: props.rotaDate,
            rotaedShifts: props.rotaedShifts,
            amendedClockInPeriods: props.amendedClockInPeriods,
            clockedClockInPeriods: props.clockedClockInPeriods,
            clockInBreaks: props.clockInBreaks,
            clockInEvents: props.clockInEvents
        }
    }
    render(){
        var amendedClockInPeriods = this.props.amendedClockInPeriods
        var {staffMember} = this.props;

        var style = {
            transition: ".2s all",
            maxHeight: 1000
        };

        if (this.props.markedAsDone){
            style.maxHeight = 0;
            style.overflow = "hidden";
        }

        var acceptedClockInPeriods = _(this.props.amendedClockInPeriods)
            .filter({status: "accepted"})

        var staffType = this.props.staffType;

        return <div style={style}>
            <div style={{
                marginBottom: 50,
                padding: 10,
                border: "1px solid #ddd"
            }}>
                <StaffDayHeader
                    rotaDate={this.props.rotaDate}
                    staffMember={this.props.staffMember}
                    clockedClockInPeriods={this.state.lastValidData.clockedClockInPeriods}
                    acceptedClockInPeriods={acceptedClockInPeriods}
                    rotaedShifts={this.props.rotaedShifts}
                    clockInBreaks={this.props.clockInBreaks}
                />
                <div className="row">
                    <div className="col-md-2">
                        <img
                            src={staffMember.avatar_url}
                            style={{width: "90%", marginBottom: 4}}
                        />
                        <StaffTypeBadge staffTypeObject={staffType} />
                        <ClockOutButton
                            staffMemberClockInStatus={this.props.staffMemberClockInStatus}
                            clockOut={() => alert("todo")}
                        />
                    </div>
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-8">
                                <HoursChart
                                    rotaDate={this.state.lastValidData.rotaDate}
                                    rotaedShifts={this.state.lastValidData.rotaedShifts}
                                    amendedClockInPeriods={this.state.lastValidData.amendedClockInPeriods}
                                    clockedClockInPeriods={this.state.lastValidData.clockedClockInPeriods}
                                    clockInEvents={this.state.lastValidData.clockInEvents}
                                    clockInBreaks={this.state.lastValidData.clockInBreaks}
                                />
                            </div>
                            <div className="col-md-4">
                                <StaffDayNotes notes={this.props.clockInNotes} />
                            </div>
                        </div>
                        <AcceptedHoursList
                            clockInReasons={this.props.clockInReasons}
                            rotaDate={this.props.rotaDate}
                            amendedClockInPeriods={this.props.amendedClockInPeriods}
                            markDayAsDone={this.props.markDayAsDone}
                            clockInBreaks={this.props.clockInBreaks}
                            onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
                    </div>
                </div>
            </div>
        </div>
    }
}

class ClockOutButton extends React.Component {
    render(){
        var status = this.props.staffMemberClockInStatus;
        if (status === "clocked_out") {
            return null;
        }
        return <button
            className="btn btn-warning"
            onClick={this.props.clockOut}
            style={{marginTop: 4, marginLeft: 4}}>
            Clock Out
        </button>
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

        var clockInBreaks = this.props.clockInBreaks;
        var clockedStats = getClockInPeriodStats({
            clockInPeriods: clockedClockInPeriods,
            clockInBreaks
        });
        var acceptedStats = getClockInPeriodStats({
            clockInPeriods: acceptedClockInPeriods,
            clockInBreaks
        });
        var rotaedStats = getClockInPeriodStats({
            clockInPeriods: rotaedClockInPeriods,
            clockInBreaks
        })

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
            <div className="staff-day__sub-heading">Notes</div>
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
            deleteBreakButton = <a
                className="btn btn-default"
                style={{marginLeft: -10}}
                onClick={this.props.onDeleteItem}>
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
        var {amendedClockInPeriod, breakItem} = this.props;

        var validationResult = Validation.validateBreak({
            breakItem,
            clockInPeriod: amendedClockInPeriod
        })

        return validationResult.isValid;
    }
}

class BreakList extends React.Component {
    render(){
        var breaks = this.props.amendedClockInPeriod.breaks.map((breakItem) => {
            return breakItem.get(this.props.clockInBreaks)
        })
        var validationResult = Validation.validateBreaks({
            breaks: breaks,
            clockInPeriod: this.props.amendedClockInPeriod
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
            {breaks.map((breakItem) => {
                return <BreakListItem
                    onChange={(newBreakItem) => {
                        var breaks = utils.replaceArrayElement(
                            this.props.breaks,
                            breakItem,
                            newBreakItem)
                        this.props.onChange(breaks)
                    }}
                    readonly={this.props.readonly}
                    amendedClockInPeriod={this.props.amendedClockInPeriod}
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
        var clockInHours = this.props.acceptedHours.clockInHours;

        var {rotaDate} = this.props;
        var newBreaks = _.clone(this.props.breaks);

        var shiftStartOffset = rotaDate.getHoursSinceStartOfDay(clockInHours.starts_at);
        var breakHoursOffset = shiftStartOffset + 1;
        if (breakHoursOffset > 23){
            breakHoursOffset = 23;
        }

        newBreaks.push({
            starts_at: rotaDate.getDateNHoursAfterStartTime(breakHoursOffset, 0),
            ends_at: rotaDate.getDateNHoursAfterStartTime(breakHoursOffset, 15)
        })
        this.props.onChange(newBreaks);
    }
}

class ReasonSelector extends React.Component {
    render(){
        var {reasonClientId, reasonText, clockInReasons} = this.props;
        var selectedReason = _(clockInReasons).find({clientId: reasonClientId});

        var showTextArea = selectedReason.title === "Other";

        var dropdown, dropdownSelectionString;
        if (this.props.readonly) {
            dropdownSelectionString = <div>
                {selectedReason.title}
            </div>
        } else {
            dropdown = <select
                style={{marginBottom: 4}}
                value={reasonClientId}
                onChange={(e) => this.triggerChange({
                    reason_id: e.target.value
                })}>
                {_.values(clockInReasons).map((reason) =>
                    <option value={reason.clientId}>
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
        var amendedClockInPeriod = this.props.amendedClockInPeriod
        var readonly = this.isAccepted();


        return <div className="row">
            <div className="col-md-10">
                <div className="col-md-4">
                    <div className="staff-day__sub-heading">From/To</div>
                    <ShiftTimeSelector
                        defaultShiftTimes={{
                            starts_at: amendedClockInPeriod.starts_at,
                            ends_at: amendedClockInPeriod.ends_at
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
                    <div style={{paddingRight: 30, paddingLeft: 30}}>
                        <div className="staff-day__sub-heading">Breaks</div>
                        <BreakList
                            onChange={(breaks) => this.triggerChange({clockInHours: {
                                    breaks
                                }
                            })}
                            readonly={readonly}
                            clockInBreaks={this.props.clockInBreaks}
                            rotaDate={this.props.rotaDate}
                            amendedClockInPeriod={amendedClockInPeriod}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="staff-day__sub-heading">Reason</div>
                    <ReasonSelector
                        readonly={readonly}
                        clockInReasons={this.props.clockInReasons}
                        reasonClientId={amendedClockInPeriod.reason.clientId}
                        reasonText={amendedClockInPeriod.reason_text}
                        onChange={(newData) => this.triggerChange(newData)}
                    />
                </div>
            </div>
            <div className="col-md-2">
                {this.getAcceptUi()}
            </div>
        </div>
    }
    isAccepted(){
        return this.props.amendedClockInPeriod.status !== "in_progress";
    }
    isValid(){
        return Validation.validateClockInPeriod({
            clockInPeriod: this.props.amendedClockInPeriod,
            clockInBreaks: this.props.clockInBreaks
        }).isValid;
    }
    getAcceptUi(){
        var stats = getClockInPeriodStats({
            clockInPeriods: [this.props.amendedClockInPeriod],
            clockInBreaks: this.props.clockInBreaks
        });
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
            hoursAssignments: this.props.amendedClockInPeriods
        })

        return <div>
            {this.props.amendedClockInPeriods.map(
                (amendedClockInPeriod) =>
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
                            clockInBreaks={this.props.clockInBreaks}
                            rotaDate={this.props.rotaDate}
                            clockInReasons={this.props.clockInReasons}
                            amendedClockInPeriod={amendedClockInPeriod} />
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
    getNewHoursDefaultTimes(){
        var {acceptedHours, rotaDate} = this.props;

        if (acceptedHours.length === 0) {
            return {
                starts_at: rotaDate.getDateFromShiftStartTime(9, 0),
                ends_at: rotaDate.getDateFromShiftStartTime(10, 0),
            }
        }

        var lastExitingHours = _.last(acceptedHours);
        var previousShiftHoursOffset = rotaDate.getHoursSinceStartOfDay(lastExitingHours.clockInHours.ends_at);

        var newHoursStartOffset = previousShiftHoursOffset + 1;
        var newHoursEndOffset = newHoursStartOffset + 1;

        newHoursStartOffset = utils.containNumberWithinRange(newHoursStartOffset, [0, 23]);
        newHoursEndOffset = utils.containNumberWithinRange(newHoursEndOffset, [0, 23]);

        return {
            starts_at: rotaDate.getDateNHoursAfterStartTime(newHoursStartOffset),
            ends_at: rotaDate.getDateNHoursAfterStartTime(newHoursEndOffset)
        }
    }
    addHours(){
        var {acceptedHours, rotaDate} = this.props;
        acceptedHours = _.clone(acceptedHours)

        var defaultTimes = this.getNewHoursDefaultTimes();

        acceptedHours.push({
            clockInHours: {
                starts_at: defaultTimes.starts_at,
                ends_at: defaultTimes.ends_at,
                breaks: []
            },
            reason_id: "599",
            reason_text: "",
            accepted_state: "in_progress"
        })
        this.props.onChange(acceptedHours);
    }
}
