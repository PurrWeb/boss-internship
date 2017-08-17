import React from 'react';
import { DateRangePicker } from 'react-dates';

import {filter} from '../actions'

class HolidaysFilter extends React.PureComponent {
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

    return (
      <div className="boss-board__manager-filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_align_center boss-form__row_desktop">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_max">
              <p className="boss-form__label boss-form__label_type_light">
                <span className="boss-form__label-text">
                  Filter
                </span>
              </p>
              <div className="date-range-picker date-range-picker_type_interval date-range-picker_type_icon">
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
            <div className="boss-form__field boss-form__field_layout_min">
              <button className="boss-button boss-form__submit">Update</button>
            </div>
          </div>
          <div className="boss-form__row boss-form__row_mobile">
            <div className="boss-form__field boss-form__field_layout_max">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Filter </span>
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
          </div>
        </div>
      </div>
    )
  }
}

export default HolidaysFilter;
