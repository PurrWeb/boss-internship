import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const VenuesSelect = ({options, selected, onSelect}) => {
  return (
    <div className="boss-form">
      <div className="boss-form__field boss-form__field_position_last">
        <div className="boss-form__select boss-form__select_size_small-fluid">
          <Select
            name="venue-select"
            value={selected}
            clearable={false}
            options={options}
            onChange={onSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default VenuesSelect;
