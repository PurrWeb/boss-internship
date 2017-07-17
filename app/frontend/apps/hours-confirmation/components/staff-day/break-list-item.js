import React from "react"
import Validation from "~/lib/validation"
import ShiftTimeSelector from "~/components/shift-time-selector"

export default class BreakListItem extends React.Component {
    render(){
        var breakItem = this.props.breakItem;

        var actionBreakButton;
        if (!this.props.readonly) {
            actionBreakButton = <a
                className="boss-button boss-button_type_icon boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_delete-break"
                onClick={() => {
                    this.props.boundActions.deleteHoursAcceptanceBreak({
                        clientId: breakItem.clientId
                    })
                }}>
                <i className="fa fa-remove" />
            </a>
        } else {
          actionBreakButton = <a
          className="boss-button boss-button_role_add boss-time-shift__button boss-time-shift__button_role_add-break"
          onClick={() => {

          }}
          >Add a break</a> 
        };

        var style = {};
        if (!this.isValid()) {
            style.color ="red"
        }

        return <div className="boss-time-shift__break-item">
            <div className="boss-time-shift__log boss-time-shift__log_layout_break">
              <div className="boss-time-shift__group">
                <div className="boss-time-shift__time">
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
              </div>
               <div className="boss-time-shift__actions">
                {actionBreakButton}
              </div>
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
