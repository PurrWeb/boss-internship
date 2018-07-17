import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { RadioGroup, Radio } from 'react-radio-group';

const SHOW_ALL_VALUE = 'show_all';
const UNCOLLECTED_ONLY_VALUE = 'uncollected_only';
const LATE_ONLY_VALUE = 'late_only';
const VALUES = [SHOW_ALL_VALUE, LATE_ONLY_VALUE, UNCOLLECTED_ONLY_VALUE];

class PaymentFilterFilterTypeRadioGroup extends Component {
  state = {
    payRate: SHOW_ALL_VALUE
  }

  handleFilterChange = value => {
    const requestInProgress = oFetch(this.props, 'requestInProgress');
    if (!requestInProgress) {
      this.setState({ payRate: value });
      oFetch(this.props, 'onFilterTypeChange')(value);
    }
  };

  render() {
    const currentValue = oFetch(this.props, 'currentValue');
    if (!VALUES.includes(currentValue)) {
      throw new Error(`Unsupported value ${currentValue} supplied for value of PaymentFilterFilterTypeRadioGroup`)
    }
    const formFieldClass = Array(this.props.forFieldClass);
    const className = oFetch(this, 'props.className');
    const radioGroupName = oFetch(this, 'props.radioGroupName');
    return (
      <RadioGroup
        name={radioGroupName}
        selectedValue={this.state.payRate}
        onChange={this.handleFilterChange}
        className={className} >
        <label className="boss-form__switcher-label">
          <Radio value={SHOW_ALL_VALUE} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">Show All</span>
        </label>
        <label className="boss-form__switcher-label">
          <Radio value={UNCOLLECTED_ONLY_VALUE} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">Uncollected Only</span>
        </label>
        <label className="boss-form__switcher-label">
          <Radio value={LATE_ONLY_VALUE} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">Late Only</span>
        </label>
      </RadioGroup>
    )
  }
}

const defaultFilterValue = SHOW_ALL_VALUE;

export {
  PaymentFilterFilterTypeRadioGroup,
  defaultFilterValue
}
