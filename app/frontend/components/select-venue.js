import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

const VenuesSelect = ({options, optionsType = {value: "value", label: "label"}, selected, onSelect, clientId = false}) => {
  let mappedOptions = [];
  let selectedOptions = {};

  if (clientId) {
    mappedOptions = _.values(options).map(function(venue){
      return {
          value: venue.serverId,
          label: venue.name
      };
    });
    selectedOptions = {
      value: selected.id,
      label: selected.name
    }
    
  } else {
    mappedOptions = options.map(option => {
      return {
        value: option[optionsType.value],
        label: option[optionsType.label],
      }
    });
    selectedOptions = {
      value: selected[optionsType.value],
      label: selected[optionsType.label]
    };
  }

  
  return (
    <div className="boss-form">
      <div className="boss-form__field boss-form__field_position_last">
        <div className="boss-form__select boss-form__select_size_small-fluid">
          <Select
            name="venue-select"
            value={selectedOptions}
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
