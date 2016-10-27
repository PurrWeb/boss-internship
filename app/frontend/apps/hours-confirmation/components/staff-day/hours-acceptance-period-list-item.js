import React from "react"
import BreakList from "./break-list"
import ShiftTimeSelector from "~components/shift-time-selector"
import getHoursPeriodStats from "~lib/get-hours-period-stats"
import ComponentErrors from "~components/component-errors"
import { ModalContainer, ModalDialog} from "react-modal-dialog"
import Validation from "~lib/validation"
import Spinner from "~components/spinner"
import _ from "underscore"

const TIME_GRANULARITY_IN_MINUTES = 1;

export default class HoursAcceptancePeriodListItem extends React.Component {
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
        this.state = {
          showModal: false
        }
    }
    render(){
        var hoursAcceptancePeriod = this.props.hoursAcceptancePeriod
        var readonly = this.isAccepted() || !this.props.hasClockedOut;

        var periodTimeSelectorStyles = {};
        if (!this.periodTimesAreValid()) {
            periodTimeSelectorStyles.color = "red"
        }

        var reasonSection;
        if ( readonly && !(hoursAcceptancePeriod.reason_note == null) ){
          reasonSection = <p>{ hoursAcceptancePeriod.reason_note }</p>;
        } else if ( readonly ){
          reasonSection = <p>N/A</p>;
        } else {
          reasonSection = <textarea
            value={ hoursAcceptancePeriod.reason_note }
             onChange={(event) => {
               let reasonNote = event.target.value;
               this.props.boundActions.updateHoursAcceptancePeriod({
                 clientId: hoursAcceptancePeriod.clientId,
                 reason_note: reasonNote
               })
             }}
          />;
        }

        return (
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">From/To</div>
            </div>
            <div className="panel-body">
              <div
                className="row"
                data-test-marker-hours-acceptance-period-item
              >
                { this.getModal() }
                    <div className="shrink column mb-md">
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
                    <div className="shrink column">
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
                    <div className="column">
                        <div className="staff-day__sub-heading">Reason</div>
                        <div>
                          {reasonSection}
                        </div>
                      {this.getAcceptUi()}
                    </div>
                  <ComponentErrors errorHandlingId={this.componentId} extraStyle={{marginTop: 4}}/>
              </div>
            </div>
          </div>
        )
    }
    acceptModalRequired(){
      let rotaedAcceptedHoursDifference = this.props.rotaedAcceptedHoursDifference;
      let periodHours = getHoursPeriodStats({
          denormalizedHoursPeriods: [this.props.hoursAcceptancePeriod]
      }).hours;

      return (rotaedAcceptedHoursDifference - periodHours) < 0;
    }
    getModal(){
      let self = this;
      if (!(self.state.showModal && this.acceptModalRequired())){
        return null;
      }

      let closeModal = function(){
        self.setState({
          showModal: false
        })
      };

      let warningMessages = [
        "If you accept these hours, the total amount of accepted hours for this staff member will be greater than what was rotaed.",
        "Please ensure you have added suitable reason notes to explain the time difference.",
        "These will be reviewed by senior management."
      ];

      let handleAccept = ()=>{
        this.performAccept();
        closeModal();
      }

      return <ModalContainer onClick={closeModal}>
        <ModalDialog onClose={closeModal}>
          <p>If you accept these hours, the total amount of accepted hours for this staff member will be greater than what was rotaed.</p>
          <p>Please ensure you have added suitable reason notes to explain the time difference.</p>
          <p>These will be reviewed by senior management.</p>
          <a className="button success" onClick={handleAccept}>Accept</a>
          <a className="button" onClick={closeModal}>Cancel</a>
        </ModalDialog>
      </ModalContainer>
    }
    performAccept(){
      this.props.boundActions.acceptHoursAcceptancePeriod({
        hoursAcceptancePeriod: this.props.hoursAcceptancePeriod,
        errorHandlingId: this.componentId
      })
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

        let acceptButtonOnClick;
        if( this.acceptModalRequired() ){
          acceptButtonOnClick = () => {
            this.setState({
              showModal: true
            })
          };
        } else {
          acceptButtonOnClick = () => {
            this.performAccept();
          };
        }

        if (!this.isAccepted()) {
            if (!this.props.hasClockedOut) {
                return <span></span>
            } else {
                return <div className="row">
                  <div className="column">
                    <a
                        data-test-marker-accept-hours-acceptance-period
                        onClick={ acceptButtonOnClick }
                        className="button success">
                        <i className="fa fa-check mr-sm" />Accept {stats.hours}h
                    </a>
                  </div>
                  <div className="shrink column">
                    <a
                        className="button alert"
                        data-test-marker-delete-hours-acceptance-period
                    onClick={() => {
                        this.props.boundActions.deleteHoursAcceptancePeriod({
                            hoursAcceptancePeriod,
                            errorHandlingId: this.componentId
                        })
                    }}>
                      <i className="fa fa-remove mr-sm" />Delete
                    </a>
                  </div>
                </div>
            }
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
                    className="button alert pull-right"
                    onClick={() => this.props.boundActions.unacceptHoursAcceptancePeriod({
                        hoursAcceptancePeriod: this.props.hoursAcceptancePeriod,
                        errorHandlingId: this.componentId
                    })}>
                    <i className="fa fa-close mr-base" />Unaccept
                </a>
            </div>
        }
    }
}
