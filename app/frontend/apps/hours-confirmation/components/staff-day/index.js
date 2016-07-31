import React from "react"
import _ from "underscore"
import ErrorMessage from "~components/error-message"
import StaffTypeBadge from "~components/staff-type-badge"
import ComponentErrors from "~components/component-errors"
import clockInStatusOptionsByValue from "~lib/clock-in-status-options-by-value"

import Validation from "~lib/validation"
import HoursChart from "../hours-chart"
import ClockOutButton from "./clock-out-button"
import StaffDayHeader from "./staff-day-header"
import ClockInNotesList from "~components/clock-in-notes-list"
import HoursAcceptancePeriodList from "./hours-acceptance-period-list"

export default class StaffDay extends React.Component {
    constructor(props){
        super(props)
        this.clockOutErrorId = _.uniqueId();
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

        var clockInStatus = clockInStatusOptionsByValue[this.props.clockInDay.status]

        var acceptedClockInPeriods = _(this.props.hoursAcceptancePeriods)
            .filter({status: "accepted"})

        var staffType = this.props.staffType;

        var clockOutToEditHoursMessage = null;

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
                        <div style={{marginTop: 4}}>
                            Status: {clockInStatus.title}
                        </div>
                        <ComponentErrors errorHandlingId={this.clockOutErrorId} />
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
                                <div className="staff-day__sub-heading">Notes</div>
                                <ClockInNotesList notes={this.props.clockInNotes} />
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
                            componentErrors={this.props.componentErrors}
                            onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
                        <div>
                            <ClockOutButton
                                clockInDay={this.props.clockInDay}
                                clockOut={() => this.props.boundActions.forceStaffMemberClockOut({
                                    staffMember: this.props.staffMember,
                                    clockInDay: this.props.clockInDay,
                                    errorHandlingId: this.clockOutErrorId
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
