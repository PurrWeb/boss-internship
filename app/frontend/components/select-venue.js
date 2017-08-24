import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

const VenuesSelect = ({options, selected, onSelect, clientId}) => {
  let mappedOptions = [];

  if (clientId) {
    mappedOptions = _.values(options).map(function(venue){
      return {
          value: venue.clientId,
          label: venue.name
      };
    });
  } else {
    mappedOptions = options;
  }
  
  return (
    <div className="boss-form">
      <div className="boss-form__field boss-form__field_position_last">
        <div className="boss-form__select boss-form__select_size_small-fluid">
          <Select
            name="venue-select"
            value={selected}
            clearable={false}
            options={mappedOptions}
            onChange={onSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default VenuesSelect;
