import React from 'react';
import DatePicker from 'react-datepicker';
import CalendarCustomInput from './calendar-custom-input';

class BossFormCalendar extends React.Component {

  render () {
    const {
      label,
      required,
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <DatePicker
          customInput={<CalendarCustomInput />}
          withPortal="withPortal"
          calendarClassName="date-picker"
          className={`${touched && error && 'boss-input_state_error'}`}
          showMonthDropdown
          showYearDropdown
          selected={value}
          onChange={(value) => onChange(value)}
          dropdownMode="select"
          dateFormat="DD-MM-YYYY"
          allowSameDay
        />
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }

}

  export default BossFormCalendar;
