import React from 'react';
import { DateRangePicker } from 'react-dates';

class EditHolidayContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      startDate: props.startDate,
      endDate: props.endDate,
    }
  }
  
  onDatesChange = ({startDate, endDate}) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    })
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
      <div className="boss-form">
        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_layout_max">
            <p className="boss-form__label">
              <span className="boss-form__label-text">
                Date
              </span>
            </p>
            <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
              <DateRangePicker
                numberOfMonths={1}
                withPortal
                showClearDates
                isOutsideRange={() => false}
                startDate={startDate}
                endDate={endDate}
                onDatesChange={this.onDatesChange}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
            </div>
          </div>
          <div className="boss-form__field boss-form__field_layout_third">
            <p className="boss-form__label">
              <span className="boss-form__label-text">
                Holiday Type
              </span>
            </p>
          </div>
        </div>
        <div className="boss-form__field">
          <p className="boss-form__label">
            <span className="boss-form__label-text">
              Note
            </span>
          </p>
          <textarea className="boss-form__textarea"></textarea>
        </div>
        <div className="boss-form__field">
          <button
            onClick={onSubmit}
            className="boss-button boss-form__submit"
          >Update</button>
        </div>
      </div>
    )
  }
}

export default EditHolidayContent;
