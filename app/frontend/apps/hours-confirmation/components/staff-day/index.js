import React from "react"
import _ from "underscore"
import ErrorMessage from "~/components/error-message"
import StaffTypeBadge from "~/components/staff-type-badge"
import ComponentErrors from "~/components/component-errors"
import clockInStatusOptionsByValue from "~/lib/clock-in-status-options-by-value"

import utils from "~/lib/utils"
import Validation from "~/lib/validation"
import getHoursPeriodStats from "~/lib/get-hours-period-stats"
import HoursChart from "../hours-chart"
import ClockOutButton from "./clock-out-button"
import StaffDayHeader from "./staff-day-header"
import ClockInNotesList from "../../components/clock-in-notes-list"
import HoursAcceptancePeriodList from "./hours-acceptance-period-list"
import StaffDayAside from './staff-day-aside'

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
        var style = {}

        if (this.props.markedAsDone){
            style.maxHeight = 0;
            style.overflow = "hidden";
        }

        var clockInStatus = clockInStatusOptionsByValue[this.props.clockInDay.status]

        var acceptedClockInPeriods = _(this.props.hoursAcceptancePeriods)
            .filter({status: "accepted"})

        var staffType = this.props.staffType;

        var clockOutToEditHoursMessage = null;

        let rotaedClockInPeriods = this.props.rotaedShifts.map(
          function(shift){
            return {
                starts_at: shift.starts_at,
                ends_at: shift.ends_at,
                breaks: []
            }
          });

        var acceptedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: acceptedClockInPeriods
        });

        let rotaedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: rotaedClockInPeriods
        });

        var clockedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: this.state.lastValidData.clockedClockInPeriods
        });

        let acceptedHours = acceptedStats.hours;
        let clockedHours = clockedStats.hours;
        let rotaedHours = rotaedStats.hours;
        let rotaedAcceptedHoursDifference = utils.round(rotaedHours - acceptedStats.hours, 2);

        return <div style={style} className="boss-hrc boss-hrc_context_stack">
                <div className="boss-hrc__side">
                  <StaffDayAside
                    staffMember={this.props.staffMember}
                    rotaedHours={rotaedHours}
                    clockedHours={clockedHours}
                    acceptedHours={acceptedHours}
                    rotaedAcceptedHoursDifference={rotaedAcceptedHoursDifference}
                    staffTypeObject={staffType}
                  />
                </div>
                <div className="boss-hrc__main">
                    <div className="boss-hrc">
                      <StaffDayHeader
                        staffMember={this.props.staffMember}
                        rotaedHours={rotaedHours}
                        clockedHours={clockedHours}
                        acceptedHours={acceptedHours}
                        rotaDate={this.props.rotaDate}
                        venueName={this.props.venue.name}
                        displayVenue={this.props.displayVenue}
                        displayDate={this.props.displayDate}
                        rotaedAcceptedHoursDifference={rotaedAcceptedHoursDifference}
                        status={clockInStatus.title}
                      />
                    </div>
                    <div className="boss-hrc__content">
                        <div className="boss-hrc__info">
                            <div className="boss-hrc__graph">
                                <HoursChart
                                    rotaDate={this.state.lastValidData.rotaDate}
                                    rotaedShifts={this.state.lastValidData.rotaedShifts}
                                    hoursAcceptancePeriods={this.state.lastValidData.hoursAcceptancePeriods}
                                    clockedClockInPeriods={this.state.lastValidData.clockedClockInPeriods}
                                    clockInEvents={this.state.lastValidData.clockInEvents}
                                    clockInBreaks={this.state.lastValidData.clockInBreaks}
                                />
                            </div>
                            <div className="boss-hrc__notes">
                                <ClockInNotesList notes={this.props.clockInNotes} />
                            </div>
                        </div>
                        <div className="boss-hrc__shifts">
                          <HoursAcceptancePeriodList
                            readonly={this.props.readonly}
                            rotaDate={this.props.rotaDate}
                            clockInDay={this.props.clockInDay}
                            hoursAcceptancePeriods={this.props.hoursAcceptancePeriods}
                            rotaedAcceptedHoursDifference={rotaedAcceptedHoursDifference}
                            markDayAsDone={this.props.markDayAsDone}
                            clockInBreaks={this.props.clockInBreaks}
                            boundActions={this.props.boundActions}
                            componentErrors={this.props.componentErrors}
                            onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)}
                          />
                        </div>
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

    }
}
