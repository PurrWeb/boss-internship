import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"
import moment from "moment"
import Validation from "~lib/validation"
import ErrorMessage from "~components/error-message"
import getHoursPeriodStats from "~lib/get-hours-period-stats"
import StaffTypeBadge from "~components/staff-type-badge"
import Spinner from "~components/spinner"

const TIME_GRANULARITY_IN_MINUTES = 1;

export default class StaffDay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            lastValidData: this.getLastValidDataFromProps(props)
        }
    }
    componentWillReceiveProps(nextProps){
        if (!Validation.validateHoursPeriods(nextProps.hoursAcceptancePeriods).isValid) {
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
            hoursAcceptancePeriods: props.hoursAcceptancePeriods,
            clockedClockInPeriods: props.clockedClockInPeriods,
            clockInBreaks: props.clockInBreaks,
            clockInEvents: props.clockInEvents
        }
    }
    render(){
        var amendedClockInPeriods = this.props.hoursAcceptancePeriods
        var {staffMember} = this.props;

        var style = {
            transition: ".2s all",
            maxHeight: 1000
        };

        if (this.props.markedAsDone){
            style.maxHeight = 0;
            style.overflow = "hidden";
        }

        var acceptedClockInPeriods = _(this.props.hoursAcceptancePeriods)
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
                        <br/>
                        <ClockOutButton
                            staffMember={this.props.staffMember}
                            clockOut={() => this.props.boundActions.forceStaffMemberClockOut({
                                staffMember: this.props.staffMember,
                                clockInDay: this.props.clockInDay
                            })}
                        />
                    </div>
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-8">
                                <HoursChart
                                    rotaDate={this.state.lastValidData.rotaDate}
                                    rotaedShifts={this.state.lastValidData.rotaedShifts}
                                    hoursAcceptancePeriods={this.state.lastValidData.hoursAcceptancePeriods}
                                    clockedClockInPeriods={this.state.lastValidData.clockedClockInPeriods}
                                    clockInEvents={this.state.lastValidData.clockInEvents}
                                    clockInBreaks={this.state.lastValidData.clockInBreaks}
                                />
                            </div>
                            <div className="col-md-4">
                                <StaffDayNotes notes={this.props.clockInNotes} />
                            </div>
                        </div>
                        <HoursAcceptancePeriodList
                            hoursAcceptanceReasons={this.props.hoursAcceptanceReasons}
                            rotaDate={this.props.rotaDate}
                            clockInDay={this.props.clockInDay}
                            hoursAcceptancePeriods={this.props.hoursAcceptancePeriods}
                            markDayAsDone={this.props.markDayAsDone}
                            clockInBreaks={this.props.clockInBreaks}
                            boundActions={this.props.boundActions}
                            onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
                    </div>
                </div>
            </div>
        </div>
    }
}

class ClockOutButton extends React.Component {
    render(){
        var staffMember = this.props.staffMember;
        var status = staffMember.clockInStatus;
        if (staffMember.forceClockoutIsInProgress){
            return <div style={{marginTop: 2}}>
                <Spinner/>
            </div>
        }
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
        var clockedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: clockedClockInPeriods
        });
        var acceptedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: acceptedClockInPeriods
        });
        var rotaedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: rotaedClockInPeriods
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
                    <li key={note.clientId}>{note.text}</li>
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
                onClick={() => {
                    this.props.boundActions.deleteHoursAcceptanceBreak({
                        clientId: breakItem.clientId
                    })
                }}>
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
                        var newBreak = {
                            ...times,
                            clientId: breakItem.clientId
                        };
                        this.props.boundActions.updateHoursAcceptanceBreak(newBreak)
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
        var {hoursAcceptancePeriod, breakItem} = this.props;

        var validationResult = Validation.validateBreak({
            breakItem,
            hoursPeriod: hoursAcceptancePeriod
        })

        return validationResult.isValid;
    }
}

class BreakList extends React.Component {
    render(){
        var breaks = this.props.hoursAcceptancePeriod.breaks;
        var validationResult = Validation.validateBreaks({
            breaks: breaks,
            hoursPeriod: this.props.hoursAcceptancePeriod
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
                    key={breakItem.clientId}
                    boundActions={this.props.boundActions}
                    readonly={this.props.readonly}
                    hoursAcceptancePeriod={this.props.hoursAcceptancePeriod}
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
        var hoursAcceptancePeriod = this.props.hoursAcceptancePeriod
        var {rotaDate} = this.props;
        var newBreaks = _.clone(this.props.breaks);

        var shiftStartOffset = rotaDate.getHoursSinceStartOfDay(hoursAcceptancePeriod.starts_at);
        var breakHoursOffset = shiftStartOffset + 1;
        if (breakHoursOffset > 23){
            breakHoursOffset = 23;
        }

        var newBreak = {
            starts_at: rotaDate.getDateNHoursAfterStartTime(breakHoursOffset, 0),
            ends_at: rotaDate.getDateNHoursAfterStartTime(breakHoursOffset, 15),
            id: null,
            clock_in_day: {id: hoursAcceptancePeriod.clock_in_day.serverId},
            hours_acceptance_period: {id: hoursAcceptancePeriod.serverId}
        }

        this.props.boundActions.addHoursAcceptanceBreak(newBreak)
    }
}

class ReasonSelector extends React.Component {
    render(){
        var {reason, reasonNote, reasons} = this.props;
        var reasonIsSelected = reason !== null;

        var showTextArea = reasonIsSelected && reason.title === "Other";

        var dropdown, dropdownSelectionString;
        if (this.props.readonly) {
            dropdownSelectionString = <div>
                {reason.title}
            </div>
        } else {
            dropdown = <select
                style={{marginBottom: 4}}
                value={reasonIsSelected ? reason.clientId : noneSelectedId}
                onChange={(e) => {
                    var reason;
                    var selectedValue = e.target.value;
                    this.triggerChange({
                        reason: reasons[selectedValue]
                    });
                }}>
                {_.values(reasons).map((reason) =>
                    <option value={reason.clientId} key={reason.clientId}>
                        {reason.text}
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
                        reasonNote: e.target.value
                    })
                }}
                readOnly={this.props.readonly}
                style={{display: showTextArea ? "block" : "none"}}
                value={reasonNote} />
        </div>
    }
    triggerChange(dataToUpdate){
        var newData = {
            reason: this.props.reason,
            reasonNote: this.props.reasonNote
        }
        _.extend(newData, dataToUpdate);

        this.props.onChange(newData)
    }
}

class HoursAcceptancePeriodListItem extends React.Component {
    render(){
        var hoursAcceptancePeriod = this.props.hoursAcceptancePeriod
        var readonly = this.isAccepted();


        return <div className="row">
            <div className="col-md-10">
                <div className="col-md-4">
                    <div className="staff-day__sub-heading">From/To</div>
                    <ShiftTimeSelector
                        defaultShiftTimes={{
                            starts_at: hoursAcceptancePeriod.starts_at,
                            ends_at: hoursAcceptancePeriod.ends_at
                        }}
                        readonly={readonly}
                        rotaDate={this.props.rotaDate}
                        onChange={(times) => {
                            this.props.boundActions.updateHoursAcceptancePeriod({
                                ...times,
                                clientId: hoursAcceptancePeriod.clientId
                            })
                        }}
                        granularityInMinutes={TIME_GRANULARITY_IN_MINUTES}
                        />
                </div>
                <div className="col-md-5">
                    <div style={{paddingRight: 30, paddingLeft: 30}}>
                        <div className="staff-day__sub-heading">Breaks</div>
                        <BreakList
                            boundActions={this.props.boundActions}
                            readonly={readonly}
                            clockInBreaks={this.props.clockInBreaks}
                            rotaDate={this.props.rotaDate}
                            hoursAcceptancePeriod={hoursAcceptancePeriod}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="staff-day__sub-heading">Reason</div>
                    <ReasonSelector
                        readonly={readonly}
                        reasons={this.props.hoursAcceptanceReasons}
                        reason={hoursAcceptancePeriod.hours_acceptance_reason}
                        reasonNote={hoursAcceptancePeriod.reason_note}
                        onChange={({reasonNote, reason}) => {
                            this.props.boundActions.updateHoursAcceptancePeriod({
                                clientId: hoursAcceptancePeriod.clientId,
                                reason_note: reasonNote,
                                hours_acceptance_reason: reason
                            })
                        }}
                    />
                </div>
            </div>
            <div className="col-md-2">
                {this.getAcceptUi()}
            </div>
        </div>
    }
    isAccepted(){
        return this.props.hoursAcceptancePeriod.status !== "pending";
    }
    isValid(){
        return Validation.validateHoursPeriod(this.props.hoursAcceptancePeriod).isValid;
    }
    getAcceptUi(){
        var hoursAcceptancePeriod = this.props.hoursAcceptancePeriod
        if (hoursAcceptancePeriod.updateIsInProgress) {
            return <Spinner />
        }

        var stats = getHoursPeriodStats({
            denormalizedHoursPeriods: [hoursAcceptancePeriod]
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
                    onClick={() => this.props.boundActions.acceptHoursAcceptancePeriod({
                        hoursAcceptancePeriod
                    })}
                    className={classes.join(" ")} style={{marginTop: 4}}>
                    Accept {stats.hours}h
                </a>
                <br/><br/>
                <a onClick={() => {
                    this.props.boundActions.deleteHoursAcceptancePeriod({
                        hoursAcceptancePeriod
                    })
                }}>
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
                    onClick={() => this.props.boundActions.unacceptHoursAcceptancePeriod({
                        hoursAcceptancePeriod: this.props.hoursAcceptancePeriod
                    })}>
                    Unaccept
                </a>
            </div>
        }
    }
}

class HoursAcceptancePeriodList extends React.Component {
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

        var intervalsOverlap = Validation.validateHoursPeriodsDontOverlap(this.props.hoursAcceptancePeriods)

        return <div>
            {this.props.hoursAcceptancePeriods.map(
                (hoursAcceptancePeriod) =>
                    <div key={hoursAcceptancePeriod.clientId}
                        style={{
                            border: "1px solid #ddd",
                            padding: 5,
                            marginBottom: 5
                        }}>
                        <HoursAcceptancePeriodListItem
                            boundActions={this.props.boundActions}
                            clockInBreaks={this.props.clockInBreaks}
                            rotaDate={this.props.rotaDate}
                            hoursAcceptanceReasons={this.props.hoursAcceptanceReasons}
                            hoursAcceptancePeriod={hoursAcceptancePeriod} />
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
        var unacceptedShifts = _(this.props.hoursAcceptancePeriods).filter({
            status: "pending"
        })
        return unacceptedShifts.length === 0;
    }
    getNewHoursDefaultTimes(){
        var {hoursAcceptancePeriods, rotaDate} = this.props;

        if (hoursAcceptancePeriods.length === 0) {
            return {
                starts_at: rotaDate.getDateFromShiftStartTime(9, 0),
                ends_at: rotaDate.getDateFromShiftStartTime(10, 0),
            }
        }

        var lastExitingHours = _.last(hoursAcceptancePeriods);
        var previousShiftHoursOffset = rotaDate.getHoursSinceStartOfDay(lastExitingHours.ends_at);

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

        var newHoursPeriod = {
            ...defaultTimes,
            id: null,
            clock_in_day: {id: this.props.clockInDay.serverId},
            hours_acceptance_reason: null,
            reason_note: "",
            status: "pending"
        }

        this.props.boundActions.addHoursAcceptancePeriod(newHoursPeriod)
    }
}
