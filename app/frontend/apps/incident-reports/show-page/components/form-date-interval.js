import React from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

class FormDateInterval extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
    }
  }

  render() {
    const {
      label,
      fieldClassName,
      startDate,
      endDate,
      onDatesChange,
    } = this.props;

    return (
      <div className={`boss-form__field ${fieldClassName || ''}`}>
        <p className="boss-form__label">{label}</p>
        <div className="date-range-picker date-range-picker_type_icon date-range-picker_type_interval-fluid date-range-picker_adjust_third">
          <DateRangePicker
            numberOfMonths={1}
            withPortal
            showClearDates
            displayFormat={"DD/MM/YYYY"}
            isOutsideRange={() => false}
            startDate={startDate || moment()}
            onDatesChange={onDatesChange}
            endDate={endDate || moment()}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
        </div>
      </div>
    )    
  }
}

export default FormDateInterval;
