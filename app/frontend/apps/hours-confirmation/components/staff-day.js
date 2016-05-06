import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"
import moment from "moment"
import Validation from "~lib/validation"
import ErrorMessage from "~components/error-message"

export default class StaffDay extends React.Component {
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

        return <div style={style}>
            <div style={{
                marginBottom: 50,
                padding: 10,
                border: "1px solid #ddd"
            }}>
                <h2 style={{
                        fontSize: 20,
                        margin: 0,
                        marginBottom: 10,
                        borderBottom: "1px solid #eee",
                        paddingBottom: 5
                    }}>
                    <div style={{display: "inline-block"}}>
                        {staffMember.first_name} {staffMember.surname}
                    </div>
                    <div style={{float: "right"}}>
                        {moment(this.props.rotaDate.startTime).format("DD MMM YYYY")}
                    </div>
                </h2>
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
                                    rotaDate={this.props.rotaDate}
                                    rotaedShifts={this.props.rotaedShifts}
                                    acceptedHours={this.props.acceptedHours}
                                    proposedAcceptedClockIns={proposedClockIns}
                                    clockedClockIns={this.props.clockedClockIns}
                                    events={this.props.events}
                                />
                                (todo: stats)
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
        var breakItem = this.props.breakItem
        var {acceptedHoursClockInHours} = this.props;

        var errors = null;
        var validationResult = Validation.validateBreak({
            breakItem,
            acceptedHoursClockInHours
        })

        return <div className="row" style={{marginBottom: 10}}>
            <div className="col-md-10">
                <ShiftTimeSelector
                    defaultShiftTimes={{
                        starts_at: breakItem.starts_at,
                        ends_at: breakItem.ends_at
                    }}
                    rotaDate={this.props.rotaDate}
                    onChange={(times) => {
                        this.props.onChange(times)
                    }}
                />
                <ValidationResult result={validationResult} />
            </div>
            <div className="col-md-2">
                <br/>
                <a className="btn btn-default" onClick={this.props.onDeleteItem}>
                    x
                </a>
            </div>
        </div>
    }
}

class BreakList extends React.Component {
    render(){
        var validationResult = Validation.validateBreakList({breaks: this.props.breaks})

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
                <a
                    className="btn btn-default btn-sm"
                    onClick={() => this.addBreak()}>
                    Add Break
                </a>
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

        return <div>
            <select
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
            <textarea
                onChange={(e) => this.triggerChange({
                    reason_text: e.target.value
                })}
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
                            clockInHours:{
                                starts_at: times.starts_at,
                                ends_at: times.ends_at
                            }
                        })}
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
                        rotaDate={this.props.rotaDate}
                        breaks={clockIn.breaks}
                        acceptedHours={acceptedHours}
                        />
                </div>
                <div className="col-md-3">
                    <u>Reason</u>
                    <ReasonSelector
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
    getAcceptUi(){
        var acceptedState = this.props.acceptedHours.accepted_state;
        if (acceptedState === "in_progress") {
            return <a
                onClick={() => this.triggerChange({accepted_state: "accepted"})}
                className="btn btn-success" style={{marginTop: 4}}>
                Accept
            </a>
        } else if (acceptedState === "accepted") {
            return <div>
                <div style={{
                    fontSize: 20,
                    color: "green",
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 4
                }}>
                    ACCEPTED
                </div>
                <a
                    onClick={() => this.triggerChange({accepted_state: "in_progress"})}>
                    Unaccept
                </a>
                <br/>
                TODO: make left side read-only
            </div>
        } else {
            throw Error("Unhandled state")
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
                            rotaDate={this.props.rotaDate}
                            predefinedReasons={this.props.predefinedReasons}
                            acceptedHours={acceptedHours} />
                    </div>
            )}
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
