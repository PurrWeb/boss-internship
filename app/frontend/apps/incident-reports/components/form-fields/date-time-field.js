import React from 'react';
import TimePicker from 'rc-time-picker';
import BossDatePicker from '~/components/react-dates/boss-date-picker';
import safeMoment from "~/lib/safe-moment";

import 'rc-time-picker/assets/index.css';
import './time.sass';

class DateTimeField extends React.Component {
  render() {
    const {
      date,
      time,
      label,
      required,
    } = this.props;

    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">
              {label}
            </span>
          </p>
        </div>
        <div className="boss-form__field boss-form__field_layout_max">
            <BossDatePicker 
              id="date"
              date={date.input.value}
              onApply={date.input.onChange}
              invalid={date.meta.touched && date.meta.error}
            />
          {
            date.meta.touched && date.meta.error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{date.meta.error}</span>
                </p>
              </div>
          }
        </div>
        <div className="boss-form__field boss-form__field_layout_quarter">
          <TimePicker
            className={`time-picker-input time-picker-input_type_icon ${date.meta.touched && date.meta.error && 'time-picker-input_state_error'}`}
            placeholder="Select time ..."
            value={ time.input.value ? safeMoment.iso8601Parse(time.input.value) : null }
            hideDisabledOptions
            showSecond={false}
            onChange={time.input.onChange}
          />
          {
            date.meta.touched && date.meta.error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{date.meta.error}</span>
                </p>
              </div>
          }
        </div>
      </div>
    )
  }

}

export default DateTimeField;
