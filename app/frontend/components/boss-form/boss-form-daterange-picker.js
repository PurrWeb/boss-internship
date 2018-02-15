import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';

const START_DATE_FIELD_NAME = 'startDate';
const END_DATE_FIELD_NAME = 'endDate';

class BossFormDaterangePicker extends Component {
  static defaultProps = {
    label: null,
  };

  state = {
    focusedInput: null,
  };

  _handleDatesChange = ({ startDate, endDate }) => {
    this.props[START_DATE_FIELD_NAME].input.onChange(startDate);
    this.props[END_DATE_FIELD_NAME].input.onChange(endDate);
  };

  render() {
    const { label } = this.props;
    const startDate = this.props[START_DATE_FIELD_NAME];
    const endDate = this.props[END_DATE_FIELD_NAME];

    if (!startDate || !endDate) {
      throw new Error(
        `BossFormDaterangePicker: filed names '${START_DATE_FIELD_NAME}' & '${END_DATE_FIELD_NAME}' for the ReduxForm Fields component must be present.`,
      );
    }
    return (
      <div className="boss-form__field">
        {label && (
          <p className="boss-form__label">
            <span className="boss-form__label-text">{label}</span>
          </p>
        )}
        <div className="date-range-picker date-range-picker_type_icon date-range-picker_type_interval-fluid date-range-picker_adjust_third">
          <DateRangePicker
            numberOfMonths={1}
            withPortal
            showClearDates
            displayFormat={'DD-MM-YYYY'}
            isOutsideRange={() => false}
            startDate={startDate.input.value || null}
            onDatesChange={this._handleDatesChange}
            endDate={endDate.input.value || null}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
        </div>
      </div>
    );
  }
}

export default BossFormDaterangePicker;
