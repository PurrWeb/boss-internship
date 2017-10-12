import React from 'react';
import PropTypes from 'prop-types';

import VenuesSelect from '~components/select-venue';
import BossSelect from '~components/boss-select';
import { DateRangePicker } from 'react-dates';
import {RadioGroup, Radio} from 'react-radio-group';

class VoucherUsagesFilter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
    }
  }
  
  onStatusChange = (status) => {
    this.props.onStatusChange(status && status.value);
  }
  
  render() {
    const {
      venues,
      startDate,
      endDate,
      onDatesChange,
      onSearch,
      dateTitle,
    } = this.props;
    
    const statusOptions = [{value: true, label: "Show All"}, {value: false, label: "Show active"}];

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
                  startDate={startDate}
                  endDate={endDate}
                  onDatesChange={onDatesChange}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                />
              </div>
            </div>
          </div>
          <div className="boss-form__field boss-form__field_layout_fluid">
            <RadioGroup name="filter" selectedValue={selectedFilter} onChange={handleChange} className="boss-form__switcher">
              <label className="boss-form__switcher-label">
                <Radio value="enabled" className="boss-form__switcher-radio" />
                <span className="boss-form__switcher-label-text">Enabled Only</span>
              </label>
              <label className="boss-form__switcher-label">
                <Radio value="all" className="boss-form__switcher-radio" />
                <span className="boss-form__switcher-label-text">Show All</span>
              </label>
            </RadioGroup>
          </div>
        </div>
      </div>
    )
  }
}

export default VouchersUsageFilter;
