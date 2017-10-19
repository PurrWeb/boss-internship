import React from 'react';

import { DateRangePicker } from 'react-dates';

class VoucherUsagesFilter extends React.PureComponent {
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
    });

    if (startDate && endDate) {
      let queryParams = new URLSearchParams(window.location.search);
      queryParams.set('start_date', startDate.format('DD-MM-YYYY'));
      queryParams.set('end_date', endDate.format('DD-MM-YYYY'));
      const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`;
      window.location.href = link;
    }
  }

  render() {
    const {
      dateTitle,
    } = this.props;

    return (
      <div className="boss-page-main__filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_fluid">
              <p className="boss-form__label boss-form__label_type_icon-date">
                <span className="boss-form__label-text">
                  {dateTitle}
                </span>
              </p>
              <div className="date-range-picker date-range-picker_adjust_control">
                <DateRangePicker
                  numberOfMonths={1}
                  withPortal
                  isOutsideRange={() => false}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onDatesChange={this.onDatesChange}
                  focusedInput={this.state.focusedInput}
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

export default VoucherUsagesFilter;
