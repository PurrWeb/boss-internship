import React from "react"
import Validation from "~lib/validation"
import ShiftTimeSelector from "~components/shift-time-selector"

export default class BreakListItem extends React.Component {
    render(){
        var breakItem = this.props.breakItem;

        var deleteBreakButton;
        if (!this.props.readonly) {
            deleteBreakButton = <a
                className="boss3-button boss3-button_type_small boss3-button_role_exclamation"
                onClick={() => {
                    this.props.boundActions.deleteHoursAcceptanceBreak({
                        clientId: breakItem.clientId
                    })
                }}>
                <i className="fa fa-remove" />
            </a>
        }

        var style = {};
        if (!this.isValid()) {
            style.color ="red"
        }

        return <div className="row clearfix">
            <div className="large-shrink small-12 column"
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
                    granularityInMinutes={this.props.granularityInMinutes}
                    readonly={this.props.readonly}
                />
            </div>
            <div className="shrink column">
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
