import React from 'react';
import {RadioGroup, Radio} from 'react-radio-group';

export default function MachinesFilter({selectedFilter}) {

  function handleChange(value) {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('filter', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  return (
    <div className="boss-page-main__filter">
      <div className="boss-form">
        <div className="boss-form__row boss-form__row_justify_end boss-form__row_position_last">
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
    </div>
  )
}
