import React from 'react';
import { DateRangePicker } from 'react-dates';
import HolidaysForm from './add-holiday-content-form';

class EditHolidayContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      startDate: props.startDate,
      endDate: props.endDate,
      holidayType: null,
      note: null
    }
  }

  render() {
    const {
      focusedInput,
      startDate,
      endDate,
    } = this.state;

    const {
      onSubmit,
    } = this.props;

    return (
      <div>
        <HolidaysForm
          onDatesChange={this.onDatesChange}
          startDate={startDate}
          endDate={endDate}
          onSubmit={this.onSubmit}
          onChangeType={this.onChangeType}
          focusedInput={focusedInput}
        />
      </div>
    )
  }
}

export default EditHolidayContent;
