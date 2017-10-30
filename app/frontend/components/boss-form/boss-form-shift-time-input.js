import React from "react"
import Select from "react-select"
import PropTypes from 'prop-types';
import safeMoment from "~/lib/safe-moment";
import moment from "moment";
import RotaDate from "~/lib/rota-date";

import { getPossibleShiftStartTimeStrings, getPossibleShiftEndTimeStrings } from "~/lib/possible-shift-time-strings"

class BossFromShiftTimeInput extends React.Component {
    static propTypes = {
    }

    getStartsAtOptions = (input, callback, shiftRotaDate) => {
      callback(null, {
        options: getPossibleShiftStartTimeStrings(this.props.granularityInMinutes, shiftRotaDate.startTime).map(timeString => ({value: timeString, label: timeString})),
        complete: true
      })
    }

    getEndsAtOptions = (input, callback, shiftRotaDate) => {
      callback(null, {
        options: getPossibleShiftEndTimeStrings(this.props.granularityInMinutes, shiftRotaDate.startTime).map(timeString => ({value: timeString, label: timeString})),
        complete: true
      })
    }

    updateStartsTime(newValue, shiftRotaDate){
      if (!newValue.value) {
          return;
      }
      const newDate = shiftRotaDate.getDateFromShiftStartTimeString(newValue);
      this.props.starts_at.input.onChange(newDate);
    }

    updateEndsTime(newValue, shiftRotaDate){
      if (!newValue.value) {
          return;
      }
      const newDate = shiftRotaDate.getDateFromShiftEndTimeString(newValue);
      this.props.ends_at.input.onChange(newDate);
    }

    render() {
        const {
          starts_at,
          ends_at,
          rotaDate,
        } = this.props;

        const dRotaDate = safeMoment.uiDateParse(rotaDate).toDate();
        
        const shiftRotaDate = new RotaDate({
          dateOfRota: dRotaDate,
        });
        
        const timeStartsAt = starts_at.input.value;
        const timeEndsAt = ends_at.input.value;
        const sStartsAtDateValue = moment(timeStartsAt).format("HH:mm");
        const sEndsAtDateValue = moment(timeEndsAt).format("HH:mm");

        const selectStartAt = <Select.Async
            value={sStartsAtDateValue}
            loadOptions={(input, callback) => this.getStartsAtOptions(input, callback, shiftRotaDate)}
            clearable={false}
            searchable={true}
            onChange={(value) => this.updateStartsTime(value, shiftRotaDate)}
        />
        const selectEndsAt = <Select.Async
            value={sEndsAtDateValue}
            loadOptions={(input, callback) => this.getEndsAtOptions(input, callback, shiftRotaDate)}
            clearable={false}
            searchable={true}
            onChange={(value) => this.updateEndsTime(value, shiftRotaDate)}
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
