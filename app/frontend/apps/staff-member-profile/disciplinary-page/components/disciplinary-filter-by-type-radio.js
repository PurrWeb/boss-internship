import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

import oFetch from 'o-fetch';

const SHOW_ALL_VALUE = 'show_all';
const ACTIVE_ONLY_VALUE = 'active_only';
const DISABLED_ONLY_VALUE = 'disabled_only';

class DisciplinaryFilterByType extends React.Component {
  state = {
    selectedValue: ACTIVE_ONLY_VALUE,
  };

  handleFilterChange = selectedValue => {
    this.setState({ selectedValue });
  };

  render() {
    const { selectedValue } = this.state;

    return (
      <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label">
        <RadioGroup
          name="payRatesFilter"
          selectedValue={selectedValue}
          onChange={this.handleFilterChange}
          className="boss-form__switcher"
        >
          <label className="boss-form__switcher-label">
            <Radio value={DISABLED_ONLY_VALUE} className="boss-form__switcher-radio" />
            <span className="boss-form__switcher-label-text">Disabled Only</span>
          </label>
          <label className="boss-form__switcher-label">
            <Radio value={ACTIVE_ONLY_VALUE} className="boss-form__switcher-radio" />
            <span className="boss-form__switcher-label-text">Active Only</span>
          </label>
          <label className="boss-form__switcher-label">
            <Radio value={SHOW_ALL_VALUE} className="boss-form__switcher-radio" />
            <span className="boss-form__switcher-label-text">Show All</span>
          </label>
        </RadioGroup>
      </div>
    );
  }
}

export default DisciplinaryFilterByType;
