import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';
import queryString from 'query-string';

import { FINANCE_REPORT_SHOW_ALL_FILTER_TYPE, FILTER_TITLES, FILTER_TABS } from '../constants';

class FinanceReportsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.getActiveTabFromQueryString(),
    };
  }

  getActiveTabFromQueryString = () => {
    const activeTab = queryString.parse(window.location.search).tab || FINANCE_REPORT_SHOW_ALL_FILTER_TYPE;
    this.filterByActiveTab(activeTab);
    return activeTab;
  };

  filterByActiveTab = activeTab => {
    this.props.onFilterChange(activeTab);
  };

  handleFilterChange = value => {
    const queryStringObject = queryString.parse(window.location.search);
    window.history.pushState(
      'state',
      'title',
      `${window.location.pathname}?${queryString.stringify({ ...queryStringObject, tab: value })}`,
    );
    this.setState({ activeTab: value });
    this.filterByActiveTab(value);
  };

  renderFilterTabs = () => {
    return FILTER_TABS.map((filterTab, index) => {
      return (
        <label key={index} className="boss-form__switcher-label">
          <Radio value={filterTab} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">{FILTER_TITLES[filterTab]}</span>
        </label>
      );
    });
  };

  render() {
    return (
      <div className="boss-form">
        <div className="boss-form__field boss-form__field_layout_fluid">
          <RadioGroup
            name="filterType"
            selectedValue={this.state.activeTab}
            onChange={this.handleFilterChange}
            className="boss-form__switcher"
          >
            {this.renderFilterTabs()}
          </RadioGroup>
        </div>
      </div>
    );
  }
}

FinanceReportsFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FinanceReportsFilter;
