import React from 'react';
import HolidaysForm from './add-holiday-content-form';

class AddHolidayContent extends React.PureComponent {
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
      buttonTitle,
    } = this.props;

    const initialValues = {
      note: null,
      startDate: null,
      endDate: null,
      holidayType: null,
    }

    return (
      <div className="boss-modal-window__form">
        <HolidaysForm
          onDatesChange={this.onDatesChange}
          startDate={startDate}
          endDate={endDate}
          initialValues={initialValues}
          submission={onSubmit}
          onChangeType={this.onChangeType}
          focusedInput={focusedInput}
          buttonTitle={buttonTitle}
        />
      </div>
    )
  }
}

export default AddHolidayContent;
