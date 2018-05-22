import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';

class PayRatesFilter extends Component {
  state = {
    payRate: 'all',
  };

  handleFilterChange = value => {
    this.setState({ payRate: value });
    this.props.onPayRateChange(value);
  };

  render() {
    return (
      <div className="boss-form">
        <div className="boss-form__field boss-form__field_layout_fluid">
          <RadioGroup
            name="payRatesFilter"
            selectedValue={this.state.payRate}
            onChange={this.handleFilterChange}
            className="boss-form__switcher"
          >
            <label className="boss-form__switcher-label">
              <Radio value="weekly" className="boss-form__switcher-radio" />
              <span className="boss-form__switcher-label-text">Weekly Only</span>
            </label>
            <label className="boss-form__switcher-label">
              <Radio value="all" className="boss-form__switcher-radio" />
              <span className="boss-form__switcher-label-text">Show All Pay Rates</span>
            </label>
          </RadioGroup>
        </div>
      </div>
    );
  }
}

PayRatesFilter.propTypes = {
  onPayRateChange: PropTypes.func.isRequired,
};

export default PayRatesFilter;
