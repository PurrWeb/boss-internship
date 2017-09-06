import React from 'react';
import DatePicker from 'react-datepicker';
import Timekeeper from 'react-timekeeper';
import Modal from 'react-modal';

class DateTimeField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isTimeOpened: false,
    }
  }

  handleSelectTimeDone = () => {
    this.setState(state => ({
      isTimeOpened: false,
    }))
  }

  render() {
    const {
      date,
      time,
      label,
      required,
    } = this.props;
    
    return (
      <div className="boss-form__row">
        <Modal
          isOpen={this.state.isTimeOpened}
          contentLabel="Modal"
          className={{
            base: `ReactModal__Content boss-modal-window boss-modal-window_role_danger`,
            afterOpen: 'ReactModal__Content--after-open',
          }}        
        >
          <Timekeeper
            time={time.input.value}
            onChange={time.input.onChange}
            switchToMinuteOnHourSelect
            closeOnMinuteSelect
            onDoneClick={() => this.setState(state => ({isTimeOpened: false}))}
          />
        </Modal>
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">
              {label}
            </span>
          </p>
        </div>
        <div className="boss-form__field boss-form__field_layout_max">
          <div className="date-picker-input date-picker-input_type_icon">
            <DatePicker
              withPortal="withPortal"
              calendarClassName="date-picker"
              className={`${date.meta.touched && date.meta.error && 'boss-input_state_error'}`}
              showMonthDropdown
              showYearDropdown
              selected={date.input.value}
              onChange={date.input.onChange}
              dropdownMode="select"
              dateFormat="DD-MM-YYYY"
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
        <div className="boss-form__field boss-form__field_layout_quarter">
          <div className={`time-picker-input time-picker-input_type_icon ${date.meta.touched && date.meta.error && 'time-picker-input_state_error'}`}>
            <input
              type="text"
              value={time.input.value}
              onChange={() => {}}
              ref={(input) => this.input = input}
              onClick={() => this.setState(state => ({isTimeOpened: true}))} />
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
      </div>
    )
  }

}

export default DateTimeField;
