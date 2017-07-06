import React from "react"
import { objectHasBeenSavedToBackend } from "~lib/backend-data/process-backend-object"
import Validation from "~lib/validation"
import HoursAcceptancePeriodListItem from "./hours-acceptance-period-list-item"
import ValidationResult from "~components/validation-result"
import utils from "~lib/utils"
import _ from "underscore"

export default class HoursAcceptancePeriodList extends React.Component {
    render(){
        let rotaedAcceptedHoursDifference = this.props.rotaedAcceptedHoursDifference;
        let readonly = this.props.readonly;
        var markAsDoneButton = this.getMarkAsDoneButton();

        var orderedHAPs = _.sortBy(this.props.hoursAcceptancePeriods, function(period){
            if (!objectHasBeenSavedToBackend(period)){
                return Number.POSITIVE_INFINITY
            }
            return period.starts_at.valueOf();
        })

        var addShiftButton = null;
        if (this.hasClockedOut()){
            addShiftButton = <a
                className="boss2-button boss2-button_role_add"
                data-test-marker-add-hours-acceptance-period
                onClick={() => this.addHours()}>
                    Add Shift
            </a>
        }

        var intervalsOverlap = Validation.validateHoursPeriodsDontOverlap(this.props.hoursAcceptancePeriods)

        return <div>
            {orderedHAPs.map(
                (hoursAcceptancePeriod) =>
                    <div
                        className="mb-base"
                        key={hoursAcceptancePeriod.clientId}
                    >
                        <HoursAcceptancePeriodListItem
                            readonly={readonly}
                            boundActions={this.props.boundActions}
                            clockInBreaks={this.props.clockInBreaks}
                            componentErrors={this.props.componentErrors}
                            rotaDate={this.props.rotaDate}
                            hasClockedOut={this.hasClockedOut()}
                            rotaedAcceptedHoursDifference={rotaedAcceptedHoursDifference}
                            hoursAcceptancePeriod={hoursAcceptancePeriod}
                            overlapsOtherIntervals={!intervalsOverlap.isValid} />
                    </div>
            )}
            { !readonly && <div>
                {markAsDoneButton}
                {addShiftButton}
              </div>
            }

        </div>
    }
    hasClockedOut(){
        return this.props.clockInDay.status === "clocked_out";
    }
    getMarkAsDoneButton(){
        if (this.areAllShiftsAccepted() && this.hasClockedOut()) {
            return <button
                onClick={this.props.markDayAsDone}
                className="boss2-button">
                Done
            </button>
        }
        return null;
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
            reason_note: "",
            status: "pending"
        }

        this.props.boundActions.addHoursAcceptancePeriod(newHoursPeriod)
    }
}
