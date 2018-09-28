import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { RadioGroup, Radio } from 'react-radio-group';
import { ACTIVE_ONLY, ALL } from '../constants';

class DashboardActiveFilter extends Component {
  handleFilterChange = value => {
    oFetch(this.props, 'onActiveFilterChange')(value);
  };

  render() {
    return (
      <div className="boss-dropdown__header-group">
        <form className="boss-form">
          <div className="boss-form__row boss-form__row_justify_end boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_fluid">
              <RadioGroup
                name="dashboardActiveFilter"
                selectedValue={this.props.activeFilter}
                onChange={this.handleFilterChange}
                className="boss-form__switcher"
              >
                <label className="boss-form__switcher-label">
                  <Radio value={ACTIVE_ONLY} className="boss-form__switcher-radio" />
                  <span className="boss-form__switcher-label-text">Active Only</span>
                </label>
                <label className="boss-form__switcher-label">
                  <Radio value={ALL} className="boss-form__switcher-radio" />
                  <span className="boss-form__switcher-label-text">Show All</span>
                </label>
              </RadioGroup>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

DashboardActiveFilter.propTypes = {
  onActiveFilterChange: PropTypes.func.isRequired,
};

export default DashboardActiveFilter;
