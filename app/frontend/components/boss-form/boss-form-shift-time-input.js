import React from "react"
import Select from "react-select"
import PropTypes from 'prop-types';
import RotaDate from "~/lib/rota-date.js"
import moment from "moment"
import { getPossibleShiftStartTimeStrings, getPossibleShiftEndTimeStrings } from "~/lib/possible-shift-time-strings"

class BossFromShiftTimeInput extends React.Component {
    static propTypes = {
    }

    getStartsAtOptions = (input, callback) => {
      callback(null, {
        options: getPossibleShiftStartTimeStrings(this.props.granularityInMinutes, this.props.shiftRotaDate.startTime).map(timeString => ({value: timeString, label: timeString})),
        complete: true
      })
    }

    getEndsAtOptions = (input, callback) => {
      callback(null, {
        options: getPossibleShiftEndTimeStrings(this.props.granularityInMinutes, this.props.shiftRotaDate.startTime).map(timeString => ({value: timeString, label: timeString})),
        complete: true
      })
    }

    updateStartsTime(newValue){
      if (!newValue.value) {
          return;
      }
      const newDate = this.props.shiftRotaDate.getDateFromShiftStartTimeString(newValue);
      this.props.starts_at.input.onChange(newDate);
    }

    updateEndsTime(newValue){
      if (!newValue.value) {
          return;
      }
      const newDate = this.props.shiftRotaDate.getDateFromShiftEndTimeString(newValue);
      this.props.ends_at.input.onChange(newDate);
    }

    render() {
        const {
          starts_at,
          ends_at,
        } = this.props;
        
        const timeStartsAt = starts_at.input.value;
        const timeEndsAt = ends_at.input.value;
        const startsAtDateValue = moment(timeStartsAt).format("HH:mm");
        const endsAtDateValue = moment(timeEndsAt).format("HH:mm");

        const selectStartAt = <Select.Async
            value={startsAtDateValue}
            loadOptions={this.getStartsAtOptions}
            clearable={false}
            searchable={true}
            onChange={(value) => this.updateStartsTime(value)}
        />
        const selectEndsAt = <Select.Async
            value={endsAtDateValue}
            loadOptions={this.getEndsAtOptions}
            clearable={false}
            searchable={true}
            onChange={(value) => this.updateEndsTime(value)}
        />

        return (
          <div className={`boss-form__field ${this.props.className}`}>
            <div className="boss-form__interval">
              <div className="boss-form__interval-item">
                <p className="boss-form__label">
                  <span className="boss-form__label-text">Start</span>
                </p>
                <div className={`boss-form__select boss-form__select_role_time ${starts_at.meta.touched && starts_at.meta.error && 'boss-form__select_state_error'}`}>
                  {selectStartAt}
                </div>
                {
                  starts_at.meta.touched && starts_at.meta.error &&
                    <div className="boss-form__error">
                      <p className="boss-form__error-text">
                        <span className="boss-form__error-line">{starts_at.meta.error}</span>
                      </p>
                    </div>
                }
              </div>
              <div className="boss-form__interval-delimiter"></div>
              <div className="boss-form__interval-item">
                <p className="boss-form__label">
                  <span className="boss-form__label-text">End</span>
                </p>
                <div className={`boss-form__select boss-form__select_role_time ${ends_at.meta.touched && ends_at.meta.error && 'boss-form__select_state_error'}`}>
                  {selectEndsAt}
                </div>
                {
                  ends_at.meta.touched && ends_at.meta.error &&
                    <div className="boss-form__error">
                      <p className="boss-form__error-text">
                        <span className="boss-form__error-line">{ends_at.meta.error}</span>
                      </p>
                    </div>
                }
            </div>
            </div>
          </div>
        )
    }
}

BossFromShiftTimeInput.defaultProps = {
  granularityInMinutes: 30,
  className: ''
};

export default BossFromShiftTimeInput;
