import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';
import  { PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE, PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE } from '../constants';

class PayrollReportsFilter extends Component {
  state = {
    payRate: PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE,
  };

  handleFilterChange = value => {
    this.setState({ payRate: value });
    this.props.onFilterChange(value);
  };

  render() {
    return (
      <div className="boss-form">
        <div className="boss-form__field boss-form__field_layout_fluid">
          <RadioGroup
            name="filterType"
            selectedValue={this.state.payRate}
            onChange={this.handleFilterChange}
            className="boss-form__switcher"
          >
            <label className="boss-form__switcher-label">
              <Radio value={ PAYROLL_REPORT_SALARY_ONLY_FILTER_TYPE } className="boss-form__switcher-radio" />
              <span className="boss-form__switcher-label-text">Salary Only</span>
            </label>
            <label className="boss-form__switcher-label">
              <Radio value={ PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE } className="boss-form__switcher-radio" />
              <span className="boss-form__switcher-label-text">Show All</span>
            </label>
          </RadioGroup>
        </div>
      </div>
    );
  }
}

PayrollReportsFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default PayrollReportsFilter;
