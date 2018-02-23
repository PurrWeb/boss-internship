import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import CalendarCustomInput from '~/components/boss-form/calendar-custom-input';
import safeMoment from "~/lib/safe-moment";

class DateField extends React.Component {
  render() {
    const {
      input,
      options,
      label,
      required,
      type,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <span>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </p>

        <div className={ `date-picker-input date-picker-input_type_icon ${touched && error && 'boss-form__input_state_error'} false` }>
          <DatePicker
            customInput={<CalendarCustomInput />}
            withPortal="withPortal"
            calendarClassName="date-picker"
            className={`${touched && error && 'boss-form__input_state_error'} false`}
            showMonthDropdown
            showYearDropdown
            locale="en-gb"
            selected={input.value}
            onChange={(value) => input.onChange(value)}
            dropdownMode="select"
            dateFormat="DD-MM-YYYY"
            allowSameDay
            placeholderText="Select a date"
          />
        </div>

        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </span>
    )
  }

}

export default DateField;
