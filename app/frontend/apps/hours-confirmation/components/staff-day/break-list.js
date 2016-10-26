import React from "react"
import Validation from "~lib/validation"
import BreakListItem from "./break-list-item"
import ValidationResult from "~components/validation-result"

export default class BreakList extends React.Component {
    render(){
        var breaks = this.props.hoursAcceptancePeriod.breaks;
        var validationResult = Validation.validateBreaks({
            breaks: breaks,
            hoursPeriod: this.props.hoursAcceptancePeriod
        })

        var addBreakButton;
        if (!this.props.readonly) {
            addBreakButton = <a
                className="button small"
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
                    granularityInMinutes={this.props.granularityInMinutes}
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
