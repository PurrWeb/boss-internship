import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import './time.sass';

class DateTimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDatePicker: false
    };
  }

  datePickerOnClick = () => {
    this.setState({displayDatePicker: true});
  }

  datePickerOnDateClick = () => {
    this.setState({displayDatePicker: false});
  }

  handleDateClick = (value) => {
    this.props.date.input.onChange(value);
    this.datePickerOnDateClick();
  }

  render() {
    const {
      date,
      time,
      label,
      required,
    } = this.props;
    console.log(date);
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
          <div className="date-picker-input date-picker-input_type_icon" onClick={this.datePickerOnClick}>
            <div className="react-datepicker__input-container react-datepicker__tether-target react-datepicker__tether-element-attached-bottom react-datepicker__tether-element-attached-left react-datepicker__tether-target-attached-top react-datepicker__tether-target-attached-left react-datepicker__tether-enabled">
              <div className="date-picker-input-field">{date.input.value && date.input.value.format('DD-MM-YYYY')}</div>
            </div>
          </div>
          { this.state.displayDatePicker && (
            <DatePicker
              withPortal="withPortal"
              calendarClassName="date-picker"
              className={`${date.meta.touched && date.meta.error && 'boss-input_state_error'}`}
              showMonthDropdown
              showYearDropdown
              selected={date.input.value}
              onChange={(value) => this.handleDateClick(value)}
              dropdownMode="select"
              dateFormat="DD-MM-YYYY"
              inline
            /> )
          }
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
            value={time.input.value}
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
