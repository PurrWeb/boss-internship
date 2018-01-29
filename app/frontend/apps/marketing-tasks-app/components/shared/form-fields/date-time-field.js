import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import CalendarCustomInput from '~/components/boss-form/calendar-custom-input';
import safeMoment from "~/lib/safe-moment";

export default class DateTimeField extends React.Component {
  render() {
    const {
      date,
      time,
      label,
      required,
    } = this.props;

    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_layout_half">

          <p className="boss-form__label">
            <span className="boss-form__label-text">{ label }</span>
          </p>

          <div className={ `date-picker-input date-picker-input_type_icon ${date.meta.touched && date.meta.error && 'boss-form__input_state_error'} false` }>
            <DatePicker
              customInput={<CalendarCustomInput />}
              withPortal="withPortal"
              calendarClassName="date-picker"
              className={`${date.meta.touched && date.meta.error && 'boss-form__input_state_error'} false`}
              showMonthDropdown
              showYearDropdown
              locale="en-gb"
              selected={date.input.value}
              onChange={(value) => date.input.onChange(value)}
              dropdownMode="select"
              dateFormat="DD-MM-YYYY"
              placeholderText="Select a date"
              allowSameDay
            />
          </div>

          {
            date.meta.touched && date.meta.error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{date.meta.error}</span>
                </p>
              </div>
          }
        </div>

        <div className="boss-form__field boss-form__field_layout_half">
          <p className="boss-form__label">
            <span className="boss-form__label-text">Time</span>
          </p>

          <TimePicker
            className={`rc-time-picker time-picker-input time-picker-input_type_icon ${date.meta.touched && date.meta.error && 'time-picker-input_state_error'} false`}
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
