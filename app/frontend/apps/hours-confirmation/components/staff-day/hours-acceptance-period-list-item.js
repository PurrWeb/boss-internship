import React from "react"
import BreakList from "./break-list"
import ShiftTimeSelector from "~components/shift-time-selector"
import ReasonSelector from "./reason-selector"
import getHoursPeriodStats from "~lib/get-hours-period-stats"
import ComponentErrors from "~components/component-errors"
import Validation from "~lib/validation"
import Spinner from "~components/spinner"
import _ from "underscore"

const TIME_GRANULARITY_IN_MINUTES = 1;

export default class HoursAcceptancePeriodListItem extends React.Component {
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
    }
    render(){
        var hoursAcceptancePeriod = this.props.hoursAcceptancePeriod
        var readonly = this.isAccepted();

        var periodTimeSelectorStyles = {};
        if (!this.periodTimesAreValid()) {
            periodTimeSelectorStyles.color = "red"
        }

        return <div data-test-marker-hours-acceptance-period-item>
            <div className="row" >
                <div className="col-md-10">
                    <div className="col-md-4">
                        <div className="staff-day__sub-heading">From/To</div>
                        <div style={periodTimeSelectorStyles}>
                            <ShiftTimeSelector
                                showErrorMessages={false}
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
                    </div>
                    <div className="col-md-5">
                        <div style={{paddingRight: 30, paddingLeft: 30}}>
                            <div className="staff-day__sub-heading">Breaks</div>
                            <BreakList
                                boundActions={this.props.boundActions}
                                readonly={readonly}
                                clockInBreaks={this.props.clockInBreaks}
                                rotaDate={this.props.rotaDate}
                                granularityInMinutes={TIME_GRANULARITY_IN_MINUTES}
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
            <ComponentErrors errorHandlingId={this.componentId} extraStyle={{marginTop: 4}}/>
        </div>
    }
    periodTimesAreValid(){
        return Validation.validateShiftTimes({
            starts_at: this.props.hoursAcceptancePeriod.starts_at,
            ends_at: this.props.hoursAcceptancePeriod.ends_at,
            granularityInMinutes: TIME_GRANULARITY_IN_MINUTES
        }).isValid
    }
    isAccepted(){
        return this.props.hoursAcceptancePeriod.status !== "pending";
    }
    isValid(){
        return Validation.validateHoursPeriod(this.props.hoursAcceptancePeriod).isValid
            && !this.props.overlapsOtherIntervals;
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

            classes.push("btn-success")

            return <div>
                <a
                    data-test-marker-accept-hours-acceptance-period
                    onClick={() => this.props.boundActions.acceptHoursAcceptancePeriod({
                        hoursAcceptancePeriod,
                        errorHandlingComponent: this.componentId
                    })}
                    className={classes.join(" ")} style={{marginTop: 4}}>
                    Accept {stats.hours}h
                </a>
                <br/><br/>
                <a data-test-marker-delete-hours-acceptance-period
                onClick={() => {
                    this.props.boundActions.deleteHoursAcceptancePeriod({
                        hoursAcceptancePeriod,
                        errorHandlingComponent: this.componentId
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
                        hoursAcceptancePeriod: this.props.hoursAcceptancePeriod,
                        errorHandlingComponent: this.componentId
                    })}>
                    Unaccept
                </a>
            </div>
        }
    }
}
