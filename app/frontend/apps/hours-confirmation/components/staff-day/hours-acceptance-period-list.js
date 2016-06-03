import React from "react"
import { objectHasBeenSavedToBackend } from "~lib/backend-data/process-backend-object"
import Validation from "~lib/validation"
import HoursAcceptancePeriodListItem from "./hours-acceptance-period-list-item"
import ValidationResult from "~components/validation-result"
import utils from "~lib/utils"


export default class HoursAcceptancePeriodList extends React.Component {
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

        var orderedHAPs = _.sortBy(this.props.hoursAcceptancePeriods, function(period){
            if (!objectHasBeenSavedToBackend(period)){
                return Number.POSITIVE_INFINITY
            }
            return period.starts_at.valueOf();
        })

        var intervalsOverlap = Validation.validateHoursPeriodsDontOverlap(this.props.hoursAcceptancePeriods)

        return <div>
            {orderedHAPs.map(
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
                            componentErrors={this.props.componentErrors}
                            rotaDate={this.props.rotaDate}
                            hoursAcceptanceReasons={this.props.hoursAcceptanceReasons}
                            hoursAcceptancePeriod={hoursAcceptancePeriod}
                            overlapsOtherIntervals={!intervalsOverlap.isValid} />
                    </div>
            )}
            <ValidationResult result={intervalsOverlap} />
            {markAsDoneButton}
            <a
                className="btn btn-default"
                data-test-marker-add-hours-acceptance-period
                onClick={() => this.addHours()}>
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
