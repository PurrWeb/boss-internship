import React from "react"
import Validation from "~/lib/validation"
import BreakListItem from "./break-list-item"
import ValidationResult from "../validation-result"

export default class BreakList extends React.Component {
    constructor() {
      super();
      this.state = {
        breakIsOpen: false
      }
    }

    toggleBreak = () => {
      this.setState({
        breakIsOpen: !this.state.breakIsOpen
      })
    }

    render(){
        var breaks = this.props.hoursAcceptancePeriod.breaks;
        var validationResult = Validation.validateBreaks({
            breaks: breaks,
            hoursPeriod: this.props.hoursAcceptancePeriod
        })
        const readonly = this.props.readonly;
        return <div className={`boss-time-shift__break ${readonly ? 'boss-time-shift__log_state_accepted' : ''}`}>
            <div className="boss-time-shift__break-controls">
              <button
                type="button"
                className="boss-time-shift__break-toggle boss-time-shift__break-toggle_state_visible boss-time-shift__break-toggle_state_opened"
                onClick={this.toggleBreak}
                style={{display: "inline-block", marginTop: 10, marginBottom: 4}}>
                Breaks
              </button>
            </div>
            <div className="boss-time-shift__break-content boss-time-shift__break_state_opened" style={{display: this.state.breakIsOpen ? 'block' : 'none'}}>
              <div className="boss-time-shift__break-inner">
                { breaks.map((breakItem) => {
                    return <BreakListItem
                        key={breakItem.clientId}
                        boundActions={this.props.boundActions}
                        readonly={this.props.readonly}
                        hoursAcceptancePeriod={this.props.hoursAcceptancePeriod}
                        rotaDate={this.props.rotaDate}
                        granularityInMinutes={this.props.granularityInMinutes}
                        breakItem={breakItem} />
                })}
              </div>
              { !this.props.readonly && <div className="boss-time-shift__actions">
                  <button
                    type="button"
                    className="boss-button boss-button_role_add boss-time-shift__button boss-time-shift__button_role_add-break"
                    onClick={() => this.addBreak()}
                  >
                    Add Break
                  </button>
                </div>
              }
              
            </div>
            {/* <div className="boss-time-shift__break-controls">
              {!this.state.breakIsOpen ? (
                <a
                  className="boss-time-shift__break-add"
                  onClick={() => this.addBreak()}
                  style={{display: "inline-block", marginTop: 10, marginBottom: 4}}>
                  Add Break
                </a>
              ) : (
                <a
                  className="boss-time-shift__break-toggle boss-time-shift__break-toggle_state_visible boss-time-shift__break-toggle_state_opened"
                  onClick={this.toggleBreak}
                  style={{display: "inline-block", marginTop: 10, marginBottom: 4}}>
                  Break
                </a>
              )}
            </div> */}
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

      this.props.boundActions.addHoursAcceptanceBreak(newBreak);
  }
}
