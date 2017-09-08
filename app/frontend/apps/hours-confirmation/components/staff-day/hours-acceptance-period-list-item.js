import React from "react"
import BreakList from "./break-list"
import ShiftTimeSelector from "~/components/shift-time-selector"
import getHoursPeriodStats from "~/lib/get-hours-period-stats"
import ComponentErrors from "../component-errors"
import Modal from "react-modal"
import Validation from "~/lib/validation"
import Spinner from "~/components/spinner"
import _ from "lodash";

const TIME_GRANULARITY_IN_MINUTES = 1;

export default class HoursAcceptancePeriodListItem extends React.Component {
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
        this.state = {
          showModal: false,
          reason: this.props.hoursAcceptancePeriod.reason_note || '',
        }
    }

    onReasonChange = (value) => {
      this.setState({
        reason: value,
      }, () => {
        this.changedReason(value);
      })
    }

    changedReason = _.debounce((reasonNote) => {
      this.props.boundActions.updateHoursAcceptancePeriod({
        clientId: this.props.hoursAcceptancePeriod.clientId,
        reason_note: reasonNote
      })
    }, 1000);

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
          reasonSection = <p className="boss-time-shift__message-value">N/A</p>;
        } else {
          reasonSection = <textarea className="boss-time-shift__textarea"
            value={ this.state.reason }
            onChange={(e) => this.onReasonChange(e.target.value)}
          />;
        }

        return (
          <div className="boss-time-shift">
            { this.getModal() }
            <div className="boss-time-shift__header">
              <h4 className="boss-time-shift__title">From/To </h4>
            </div>
            <form className="boss-time-shift__form">
              <div className={`boss-time-shift__log ${readonly && 'boss-time-shift__log_state_accepted'}`}>
                <div className="boss-time-shift__group">
                  <div className="boss-time-shift__time">
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
                    <ComponentErrors errorHandlingId={this.componentId} extraStyle={{marginTop: 4}}/>
                  </div>
                  <div className="boss-time-shift__message">
                    <p className="boss-time-shift__label">
                      <span className="boss-time-shift__label-text">Reason</span>
                    </p>
                    {reasonSection}
                  </div>
                </div>
                {this.getAcceptUi()}
              </div>
                <BreakList
                    boundActions={this.props.boundActions}
                    readonly={readonly}
                    clockInBreaks={this.props.clockInBreaks}
                    rotaDate={this.props.rotaDate}
                    granularityInMinutes={TIME_GRANULARITY_IN_MINUTES}
                    hoursAcceptancePeriod={hoursAcceptancePeriod}
                />
            </form>
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

      return (
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Modal"
          className={{
            base: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_note'
          }}
        >
          <button
            className="boss-modal-window__close"
            onClick={closeModal}
          ></button>
          <div className="boss-modal-window__header boss-modal-window__header_warning">WARNING !!!</div>
          <div className="boss-modal-window__content">
            <div className="boss-modal-window__message-block boss-modal-window__message-block_role_note">
              <span className="boss-modal-window__message-text">If you accept these hours, the total amount of accepted hours for this staff member will be greater than what was rotaed.</span>
              <span className="boss-modal-window__message-text">Please ensure you have added suitable reason notes to explain the time difference.</span>
              <span className="boss-modal-window__message-text">These will be reviewed by senior management.</span>
            </div>
            <div className="boss-modal-window__actions">
              <button
                className="boss-button boss-button_role_inactive boss-modal-window__button"
                onClick={closeModal}
              >
                CANCEL
              </button>
              <button
                className="boss-button boss-modal-window__button"
                onClick={handleAccept}
              >
                ACCEPT
              </button>
            </div>
          </div>
        </Modal>
      )
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

        if (!this.isAccepted() && !this.props.readonly) {
            if (!this.props.hasClockedOut) {
                return <span></span>
            } else {
                return <div className="boss-time-shift__actions">
                 <button
                        type="button"
                        data-test-marker-accept-hours-acceptance-period
                        onClick={ acceptButtonOnClick }
                        className="boss-button boss-button_role_success boss-time-shift__button boss-time-shift__button_role_accept-shift">
                        Accepted
                        <span className="boss-time-shift__button-count">
                           {' ' + stats.hours}h
                        </span>
                    </button>

                    <button
                        type="button"
                        className="boss-button boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_delete-shift"
                        data-test-marker-delete-hours-acceptance-period
                        onClick={() => {
                            this.props.boundActions.deleteHoursAcceptancePeriod({
                                hoursAcceptancePeriod,
                                errorHandlingId: this.componentId
                            })
                        }}>
                        Delete
                    </button>
                </div>
            }
        } else {
            return <div>
                <p className="boss-time-shift__status  boss-time-shift__status_state_visible">
                    {stats.hours}h ACCEPTED
                </p>
                { !this.props.readonly &&
                  <button
                      type="button"
                      className="boss-button boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_unaccept-shift boss-time-shift__button_state_visible"
                      onClick={() => this.props.boundActions.unacceptHoursAcceptancePeriod({
                          hoursAcceptancePeriod: this.props.hoursAcceptancePeriod,
                          errorHandlingId: this.componentId
                      })}>
                      Unaccept
                  </button>
                }
            </div>
        }
    }
}
